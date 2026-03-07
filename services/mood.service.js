import MoodLog from "./models/moodLog.model.js";
import Content from "./models/content.model.js";
import Like from "./models/like.model.js";
import { User } from "./models/user.model.js";

// Log moods
class MoodService {
  static async logMood(userId, mood, date) {
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setUTCHours(0, 0, 0, 0);

    const moodLog = await MoodLog.findOneAndUpdate(
      { user: userId, date: targetDate },
      { mood: mood.toLowerCase() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return moodLog;
  }

//   Get mood history with pagination
  static async getMoodHistory(userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      MoodLog.find({ user: userId })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      MoodLog.countDocuments({ user: userId }),
    ]);

    return {
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

//   Recommendation Logic - The logic automatically recommend content based on:
//     Current mood
//     Previously liked content
//     Saved items
//     Most liked content in that mood
  static async getRecommendations(userId, mood, limit = 10) {
    const normalizedMood = mood.toLowerCase();

    const [likedContentIds, savedContentIds] = await Promise.all([
      MoodService._getLikedContentIds(userId),
      MoodService._getSavedContentIds(userId),
    ]);

    const preferredMoods = await MoodService._inferPreferredMoods(
      likedContentIds,
      normalizedMood
    );

    const [moodMatches, popularInMood, likedSimilar] = await Promise.all([
      MoodService._getContentByMood(normalizedMood, likedContentIds, savedContentIds, limit),
      MoodService._getMostLikedByMood(normalizedMood, likedContentIds, savedContentIds, limit),
      MoodService._getContentByMoods(preferredMoods, normalizedMood, likedContentIds, savedContentIds, Math.ceil(limit / 2)),
    ]);

    const scored = MoodService._scoreAndDeduplicate(
      { moodMatches, popularInMood, likedSimilar },
      likedContentIds,
      savedContentIds,
      limit
    );

    return scored;
  }

//  Helper method for fetching IDs of content the user has liked or saved, which we use to personalize recommendations and avoid suggesting content they've already engaged with.
  static async _getLikedContentIds(userId) {
    const likes = await Like.find({ user: userId }).select("content").lean();
    return likes.map((l) => l.content.toString());
  }

  static async _getSavedContentIds(userId) {
    const user = await User.findById(userId).select("savedContent").lean();
    return (user?.savedContent ?? []).map((id) => id.toString());
  }

  static async _inferPreferredMoods(likedContentIds, excludeMood) {
    if (!likedContentIds.length) return [];

    const contents = await Content.find({ _id: { $in: likedContentIds } })
      .select("moods")
      .lean();

    const moodFrequency = {};
    contents.forEach(({ moods }) => {
      moods.forEach((m) => {
        if (m !== excludeMood) {
          moodFrequency[m] = (moodFrequency[m] ?? 0) + 1;
        }
      });
    });

    return Object.entries(moodFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([m]) => m);
  }

  static async _getContentByMood(mood, likedIds, savedIds, limit) {
    return Content.find({
      moods: mood,
      isApproved: true,
    })
      .sort({ likesCount: -1 })
      .limit(limit * 2) 
      .lean();
  }

  static async _getMostLikedByMood(mood, likedIds, savedIds, limit) {
    return Content.find({
      moods: mood,
      isApproved: true,
    })
      .sort({ likesCount: -1 })
      .limit(limit)
      .lean();
  }

  static async _getContentByMoods(moods, excludeMood, likedIds, savedIds, limit) {
    if (!moods.length) return [];

    return Content.find({
      moods: { $in: moods },
      isApproved: true,
    })
      .sort({ likesCount: -1 })
      .limit(limit)
      .lean();
  }

  static _scoreAndDeduplicate(buckets, likedIds, savedIds, limit) {
    const likedSet = new Set(likedIds);
    const savedSet = new Set(savedIds);

    const allCandidates = [
      ...buckets.moodMatches.map((c) => ({ ...c, _source: "mood" })),
      ...buckets.popularInMood.map((c) => ({ ...c, _source: "popular" })),
      ...buckets.likedSimilar.map((c) => ({ ...c, _source: "similar" })),
    ];

    const seen = new Set();
    const unique = [];
    for (const item of allCandidates) {
      const key = item._id.toString();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }

    const unseen = unique.filter((c) => !likedSet.has(c._id.toString()));

    const sortedByLikes = [...unseen].sort((a, b) => b.likesCount - a.likesCount);
    const topQuartileThreshold =
      sortedByLikes[Math.floor(sortedByLikes.length * 0.25)]?.likesCount ?? 0;

    const scored = unseen.map((c) => {
      let score = 0;
      if (c._source === "mood") score += 3;
      if (c._source === "similar") score += 2;
      if (savedSet.has(c._id.toString())) score += 1;
      if (c.likesCount >= topQuartileThreshold) score += 1;

      return { ...c, _relevanceScore: score };
    });

    return scored
      .sort((a, b) => b._relevanceScore - a._relevanceScore)
      .slice(0, limit);
  }
}

export default MoodService;

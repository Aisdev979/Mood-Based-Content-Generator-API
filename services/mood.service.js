import MoodLog from "../models/moodLog.model.js";
import Content from "../models/content.model.js";
import Like from "../models/like.model.js";
import { User } from "../models/user.model.js";

class MoodService {
  // Normalize mood input
  static normalizeMood(inputMood) {
    return inputMood.trim().toLowerCase();
  }

  // Normalize date to start of the day (UTC)
  static normalizeDate(inputDate) {
    const normalizedDate = inputDate ? new Date(inputDate) : new Date();
    normalizedDate.setUTCHours(0, 0, 0, 0);
    return normalizedDate;
  }

  // Log or update mood for a specific day
  static async logMood(userId, inputMood, inputDate) {
    const normalizedMood = this.normalizeMood(inputMood);
    const normalizedDate = this.normalizeDate(inputDate);

    const moodLogDocument = await MoodLog.findOneAndUpdate(
      { user: userId, date: normalizedDate },
      { mood: normalizedMood },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return moodLogDocument;
  }

  // Get paginated mood history
  static async getMoodHistory(userId, options = {}) {
    const currentPage = options.page || 1;
    const itemsPerPage = options.limit || 20;
    const documentsToSkip = (currentPage - 1) * itemsPerPage;

    const [moodLogs, totalMoodLogsCount] = await Promise.all([
      MoodLog.find({ user: userId })
        .sort({ date: -1 })
        .skip(documentsToSkip)
        .limit(itemsPerPage)
        .lean(),
      MoodLog.countDocuments({ user: userId }),
    ]);

    return {
      logs: moodLogs,
      pagination: {
        total: totalMoodLogsCount,
        page: currentPage,
        limit: itemsPerPage,
        totalPages: Math.ceil(totalMoodLogsCount / itemsPerPage),
      },
    };
  }

  // Main recommendation engine
  static async getRecommendations(userId, inputMood, recommendationLimit = 10) {
    const normalizedMood = this.normalizeMood(inputMood);

    const [
      likedContentIdList,
      savedContentIdList
    ] = await Promise.all([
      this._getLikedContentIds(userId),
      this._getSavedContentIds(userId),
    ]);

    const excludedContentIdsSet = new Set([
      ...likedContentIdList,
      ...savedContentIdList,
    ]);

    const inferredPreferredMoods = await this._inferPreferredMoods(
      likedContentIdList,
      normalizedMood
    );

    const [
      contentMatchingCurrentMood,
      contentMatchingPreferredMoods
    ] = await Promise.all([
      this._getContentBySingleMood(normalizedMood, recommendationLimit * 2),
      this._getContentByMultipleMoods(inferredPreferredMoods, recommendationLimit),
    ]);

    const combinedCandidateContent = [
      ...contentMatchingCurrentMood,
      ...contentMatchingPreferredMoods,
    ];

    const uniqueCandidateContent = this._removeDuplicateContent(
      combinedCandidateContent
    );

    const filteredUnseenContent = uniqueCandidateContent.filter(
      (contentItem) =>
        !excludedContentIdsSet.has(contentItem._id.toString())
    );

    const scoredContent = this._scoreContentByRelevance(
      filteredUnseenContent
    );

    return scoredContent.slice(0, recommendationLimit);
  }

  // Get IDs of liked content
  static async _getLikedContentIds(userId) {
    const likeDocuments = await Like.find({ user: userId })
      .select("content")
      .lean();

    return likeDocuments.map((likeDoc) =>
      likeDoc.content.toString()
    );
  }

  // Get IDs of saved content
  static async _getSavedContentIds(userId) {
    const userDocument = await User.findById(userId)
      .select("savedContent")
      .lean();

    return (userDocument?.savedContent ?? []).map((contentId) =>
      contentId.toString()
    );
  }

  // Infer user preferred moods based on liked content
  static async _inferPreferredMoods(likedContentIdList, excludedMood) {
    if (!likedContentIdList.length) return [];

    const likedContentDocuments = await Content.find({
      _id: { $in: likedContentIdList },
    })
      .select("mood")
      .lean();

    const moodFrequencyMap = {};

    for (const contentItem of likedContentDocuments) {
      for (const mood of contentItem.mood) {
        if (mood !== excludedMood) {
          moodFrequencyMap[mood] =
            (moodFrequencyMap[mood] || 0) + 1;
        }
      }
    }

    return Object.entries(moodFrequencyMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([mood]) => mood);
  }

  // Get content matching a single mood
  static async _getContentBySingleMood(targetMood, limit) {
    return Content.find({
      mood: targetMood,
      status: "approved",
    })
      .sort({ likesCount: -1 })
      .limit(limit)
      .lean();
  }

  // Get content matching multiple moods
  static async _getContentByMultipleMoods(targetMoods, limit) {
    if (!targetMoods.length) return [];

    return Content.find({
      mood: { $in: targetMoods },
      status: "approved",
    })
      .sort({ likesCount: -1 })
      .limit(limit)
      .lean();
  }

  // Remove duplicate content items
  static _removeDuplicateContent(contentList) {
    const seenContentIds = new Set();

    return contentList.filter((contentItem) => {
      const contentId = contentItem._id.toString();

      if (seenContentIds.has(contentId)) return false;

      seenContentIds.add(contentId);
      return true;
    });
  }

  // Score content based on relevance (simple popularity-based scoring)
  static _scoreContentByRelevance(contentList) {
    return contentList
      .map((contentItem) => ({
        ...contentItem,
        relevanceScore: contentItem.likesCount || 0,
      }))
      .sort((a, b) => b.relevanceScore - a.relevanceScore);
  }
}

export default MoodService;

import MoodService from "./services/mood.service.js";

// Log moods and get recommendations based on mood and user preferences.
export const logMood = async (req, res, next) => {
  try {
    const { mood, date } = req.body;

    if (!mood || typeof mood !== "string") {
      return res.status(400).json({
        success: false,
        message: "mood is required and must be a string",
      });
    }

    const moodLog = await MoodService.logMood(req.user.id, mood, date);

    const recommendations = await MoodService.getRecommendations(
      req.user.id,
      mood
    );

    return res.status(201).json({
      success: true,
      message: "Mood logged successfully",
      data: {
        moodLog,
        recommendations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Mood History with Pagination
export const getMoodHistory = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;

    const result = await MoodService.getMoodHistory(req.user.id, {
      page,
      limit,
    });

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const mood = req.params.mood?.toLowerCase();

    if (!mood) {
      return res.status(400).json({
        success: false,
        message: "mood param is required",
      });
    }

    const limit = parseInt(req.query.limit, 10) || 10;
    const recommendations = await MoodService.getRecommendations(
      req.user.id,
      mood,
      limit
    );

    return res.status(200).json({
      success: true,
      data: recommendations,
    });
  } catch (error) {
    next(error);
  }
};

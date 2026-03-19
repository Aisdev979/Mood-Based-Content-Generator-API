import MoodService from "../services/mood.service.js";

// Log user's mood and return recommendations
export const logMood = async (req, res, next) => {
  try {
    const { mood: inputMood, date: inputDate } = req.body;
    const authenticatedUserId = req.userId;

    const moodLogDocument = await MoodService.logMood(
      authenticatedUserId,
      inputMood,
      inputDate
    );

    const recommendedContent = await MoodService.getRecommendations(
      authenticatedUserId,
      inputMood
    );

    return res.status(201).json({
      success: true,
      message: "Mood logged successfully",
      data: {
        moodLog: moodLogDocument,
        recommendations: recommendedContent,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get paginated mood history for authenticated user
export const getMoodHistory = async (req, res, next) => {
  try {
    const authenticatedUserId = req.userId;

    const currentPage =
      parseInt(req.query.page, 10) || 1;

    const itemsPerPage =
      parseInt(req.query.limit, 10) || 20;

    const moodHistoryResult = await MoodService.getMoodHistory(
      authenticatedUserId,
      {
        page: currentPage,
        limit: itemsPerPage,
      }
    );

    return res.status(200).json({
      success: true,
      data: moodHistoryResult,
    });
  } catch (error) {
    next(error);
  }
};

// Get recommendations based on a specific mood
export const getRecommendations = async (req, res, next) => {
  try {
    const moodFromParams = req.params.mood;
    const authenticatedUserId = req.userId;

    const recommendationLimit =
      parseInt(req.query.limit, 10) || 10;

    const recommendedContent = await MoodService.getRecommendations(
      authenticatedUserId,
      moodFromParams,
      recommendationLimit
    );

    return res.status(200).json({
      success: true,
      data: recommendedContent,
    });
  } catch (error) {
    next(error);
  }
};

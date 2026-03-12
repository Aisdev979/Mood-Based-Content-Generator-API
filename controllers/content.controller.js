import ContentService from "../services/content.service.js";

export const getByMood = async (req, res, next) => {
  try {
    const mood = req.params.mood.toLowerCase();
    const result = await ContentService.getByMood(mood);

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

export const getRandom = async (req, res, next) => {
  try {
    const result = await ContentService.getRandom();

    res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    next(error);
  }
};

export const submitContent = async (req, res, next) => {
  try {
    const { mood, type, content } = req.body;

    if (!mood || !type || !content) {
      throw new Error("Mood, type and content are required");
    }

    const newContent = await ContentService.submitContent(
      req.body,
      req.userId
    );

    res.status(201).json({
      success: true,
      message: "Content submitted for approval",
      data: newContent,
    });

  } catch (error) {
    next(error);
  }
};
import Like from "../models/like.model.js";
import Save from "../models/save.model.js";
import Content from "../models/content.model.js";

// Like a content item
export const likeContent = async (req, res, next) => {
  try {
    const contentIdFromParams = req.params.id;
    const authenticatedUserId = req.userId;

    const contentExists = await Content.findById( contentIdFromParams );

    if (!contentExists) {
      const error = new Error('Content not found');
      error.statusCode = 404;
      throw error;
    }

    const likeDocument = new Like({
      user: authenticatedUserId,
      content: contentIdFromParams,
    });

    const likedDocument = await likeDocument.save();

    await Content.findByIdAndUpdate(
      contentIdFromParams,
      { $inc: { likesCount: 1 } },
      { returnDocument: 'after' }
    ).lean();

    const populatedLikedDocument = await Like.findById(likedDocument._id)
      .populate("user")
      .populate("content")
      .lean();

    res.status(201).json({
      message: "Content liked successfully",
      data: populatedLikedDocument,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Already liked content",
      });
    }
    next(error);
  }
};

// Save a content item
export const saveContent = async (req, res, next) => {
  try {
    const contentIdFromParams = req.params.id;
    const authenticatedUserId = req.userId;

    const contentExists = await Content.findById( contentIdFromParams );

    if (!contentExists) {
      const error = new Error('Content not found');
      error.statusCode = 404;
      throw error;
    }

    const saveDocument = new Save({
      userId: authenticatedUserId,
      contentId: contentIdFromParams,
    });

    const savedDocument = await saveDocument.save();

    const populatedSaveDocument = await Save.findById(savedDocument._id)
      .populate("userId")
      .populate("contentId")
      .lean();

    res.status(201).json({
      message: "Content saved successfully",
      data: populatedSaveDocument,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        error: "Content already saved",
      });
    }
    next(error);
  }
};

// Get all saved content for a user
export const getSavedContent = async (req, res, next) => {
  try {
    const authenticatedUserId = req.userId;

    const savedContentDocuments = await Save.find({
      userId: authenticatedUserId,
    })
      .populate("contentId")
      .lean();

    res.status(200).json(savedContentDocuments);
  } catch (error) {
    next(error);
  }
};

// Remove saved content
export const removeSavedContent = async (req, res, next) => {
  try {
    const authenticatedUserId = req.userId;
    const contentIdToRemove = req.params.id;

    const contentExists = await Content.findById( contentIdToRemove );

    if (!contentExists) {
      const error = new Error('Content not found');
      error.statusCode = 404;
      throw error;
    }

    await Save.findOneAndDelete({
      userId: authenticatedUserId,
      contentId: contentIdToRemove,
    });

    res.status(200).json({
      message: "Content removed",
    });
  } catch (error) {
    next(error);
  }
};

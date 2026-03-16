import Like from '../models/like.js';
import Save from '../models/save.js';
export const likeContent = async (req, res) => {
  try {
    const contentId = req.params.id;     
    const userId = req.user._id;         

    const newLike = new Like({
       userId: userId,
       contentId: contentId
    });

    await newLike.save(); 
    res.status(201).json({ message: "Content liked successfully!" });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Already liked post" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};
export const saveContent = async (req, res) => {
  try {
    const contentId = req.params.id;
    const userId = req.user._id;

    const newSave = new Save({
      userId: userId,
      contentId: contentId
    });

    await newSave.save();
    res.status(201).json({ message: "Content saved successfully" });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "Cannot save duplicate content" });
    }
    res.status(500).json({ error: "Something went wrong" });
  }
};
export const getSavedContent = async (req, res) => {
  try {
    const savedItems = await Save.find({ userId: req.user._id }).populate('contentId');
    res.status(200).json(savedItems);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

export const removeSavedContent = async (req, res) => {
  try {
    await Save.findOneAndDelete({ userId: req.user._id, contentId: req.params.id });
    res.status(200).json({ message: "Content removed" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
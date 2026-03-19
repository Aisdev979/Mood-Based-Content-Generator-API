import mongoose from 'mongoose';

const SaveSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  contentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Content'
  }
});

// Our special rule: This exact combination must be unique!
SaveSchema.index({ userId: 1, contentId: 1 }, { unique: true });

export default mongoose.model('Save', SaveSchema);
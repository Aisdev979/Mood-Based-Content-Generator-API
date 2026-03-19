import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    mood: {
      type: [String],
      required: true,
      lowercase: true,
      default: []
    },
    type: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    likesCount: {
      type: Number,
      default: 0,
    }
  },
  { timestamps: true }
);

const Content = mongoose.model("Content", contentSchema);

export default Content;
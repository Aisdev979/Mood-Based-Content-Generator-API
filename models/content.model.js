import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        body: {
            type: String,
            required: true,
        },

        type: {
            type: String,
            enum: ["quote", "joke", "affirmation", "story"],
            required: true,
        },

        moods: [
            {
                type: String,
                required: true,
            },
        ],

        tags: [
            {
                type: String,
            },
        ],

        likesCount: {
            type: Number,
            default: 0,
        },

        isApproved: {
            type: Boolean,
            default: true,
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

contentSchema.index({ type: 1, moods: 1 });

const Content = mongoose.model("Content", contentSchema);

export default Content;
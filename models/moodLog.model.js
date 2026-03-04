import mongoose from "mongoose";

const moodLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    mood: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: Date,
        default: Date.now,
        index: true
    }
});

moodLogSchema.index({ user: 1, date: 1 }, { unique: true });

export default mongoose.model("MoodLog", moodLogSchema);
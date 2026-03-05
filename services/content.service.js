import Content from "../models/content.model.js";

class ContentService {

  static async getByMood(mood) {
    const result = await Content.aggregate([
      { $match: { mood, status: "approved" } },
      { $sample: { size: 1 } }
    ]);

    if (!result.length) {
      throw new Error("No approved content found for this mood");
    }

    return result[0];
  }

  static async getRandom() {
    const result = await Content.aggregate([
      { $match: { status: "approved" } },
      { $sample: { size: 1 } }
    ]);

    if (!result.length) {
      throw new Error("No approved content available");
    }

    return result[0];
  }

  static async submitContent(data, userId) {
    return await Content.create({
      ...data,
      mood: data.mood.toLowerCase(),
      status: "pending",
      createdBy: userId,
    });
  }
}

export default ContentService;
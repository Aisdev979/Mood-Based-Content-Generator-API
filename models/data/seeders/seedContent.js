//import { connectDb } from "../../../db/connectDb.js";
import Content from "../../content.model.js";
import { User } from "../../user.model.js";
import sampleContents from "../sampleContents.js";

const seedContent = async () => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      throw new Error("No users found. Seed users first.");
    }

    const getRandomAuthor = () => {
      const randomIndex = Math.floor(Math.random() * users.length);
      return users[randomIndex]._id;
    };

    const contentsWithAuthors = sampleContents.map((content) => ({
      ...content,
      author: getRandomAuthor(),
    }));

    await Content.deleteMany();
    await Content.insertMany(contentsWithAuthors);

    console.log("Content Seeded Successfully ✅");

  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default seedContent
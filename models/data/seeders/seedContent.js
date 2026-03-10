import connectDB from "./config/db.js"; // use your existing DB connection
import Content from "./models/content.model.js";
import User from "./models/user.model.js";
import sampleContents from "./data/sampleContents.js";

const seedContent = async () => {
  try {
    // use the existing database connection
    await connectDB();

    const users = await User.find();

    const getRandomAuthor = () => {
      const randomIndex = Math.floor(Math.random() * users.length);
      return users[randomIndex]._id;
    };

    const contentsWithAuthors = sampleContents.map((content) => {
      return {
        ...content,
        author: getRandomAuthor(),
      };
    });

    await Content.deleteMany();
    await Content.insertMany(contentsWithAuthors);

    console.log("Content Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedContent();

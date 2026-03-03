import mongoose from "mongoose";
import Content from "./models/content.model.js";
import User from "./models/user.model.js";
import sampleContents from "./data/sampleContents.js";

const seedContent = async () => {
    try {
     await mongoose.connect(process.env.MONGO_URI);

     const users = await User.find();
    
    const getRandomAuthor = () => {
    const randomIndex = Math.floor(Math.random() * users.length);
    return users[randomIndex]._id;
};

const contentsWithAuthors = sampleContents.map(content => {
    return {
    ...content,
    author: getRandomUserId()
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
import app from "./index.js";
import { connectDb } from "./db/connectDb.js";
import seedContent from "./models/data/seeders/seedContent.js";

const PORT = process.env.PORT || 3000

const startServer = async () => {
  try {
    await connectDb();

    app.listen(PORT, async() => {
      console.log(`Server running on port ${PORT} 🚀`);
      //await seedContent()
    });

  } catch (error) {
    console.error("Failed to connect to DB...", error);
    process.exit(1);
  }
};

startServer();
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from .env");
    }

    const connection = await mongoose.connect(
      process.env.MONGO_URI,
      {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
      }
    );

    console.log(
      `MongoDB Connected: ${connection.connection.host}`
    );

    // Remove old unique doctorId index
    try {
      const schedulesCollection =
        connection.connection.db.collection(
          "schedules"
        );

      const indexes =
        await schedulesCollection.indexes();

      const oldIndex = indexes.find(
        (index) => index.name === "doctorId_1"
      );

      if (oldIndex) {
        await schedulesCollection.dropIndex(
          "doctorId_1"
        );

        console.log(
          "✅ Old doctorId_1 index removed"
        );
      }
    } catch (indexError) {
      console.log(
        "Index cleanup:",
        indexError.message
      );
    }
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
};

export default connectDB;
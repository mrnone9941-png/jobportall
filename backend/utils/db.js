import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(" ⚠️ MongoDB connection failed:", error.message);
    console.warn(" The server will continue running, but database features will be unavailable.");
  }
};

export default connectDB;
import express, { Express } from "express";
import mongoose from "mongoose";
import postRoute from "./routes/postRoute";
import commentRoute from "./routes/commentRoute";
import authRoute from "./routes/authRoute";
import dotenv from "dotenv";

dotenv.config();


const app: Express = express();

app.use(express.json());
app.use("/posts", postRoute);
app.use("/posts/:postId/comments", commentRoute);
app.use("/auth", authRoute);


const initApp = async (): Promise<Express> => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/assignment2");
    console.log("Mongoose connected");

    const db = mongoose.connection;
    db.on("error", (error) => console.error(error));
    db.once("open", () => console.log("Connected to Database"));

    return app;
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

export default initApp;

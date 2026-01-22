import mongoose, { Schema, Document } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
  userId: string;
}

const postSchema = new Schema<IPost>({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  }
});

export default mongoose.model<IPost>("Post", postSchema);

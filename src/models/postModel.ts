import mongoose, { Schema, Document } from "mongoose";

interface IPost extends Document {
  title: string;
  content: string;
  userId: mongoose.Schema.Types.ObjectId;
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
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

export default mongoose.model<IPost>("Post", postSchema);

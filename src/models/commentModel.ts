import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  content: string;
  post: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  content: {
    type: String,
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "Post",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IComment>("Comment", commentSchema);

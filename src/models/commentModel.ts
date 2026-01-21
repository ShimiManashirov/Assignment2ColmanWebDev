import mongoose, { Schema, Document } from "mongoose";

interface IComment extends Document {
  author: string;
  content: string;
  post: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const commentSchema = new Schema<IComment>({
  author: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: "post",
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IComment>("Comment", commentSchema);

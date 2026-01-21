import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  email: string;
  refreshTokens?: string[];
  lastLogout?: Date;
}

const userSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true, trim: true },
  refreshTokens: { type: [String], default: [] },
  lastLogout: { type: Date, default: null }
});



export default mongoose.model<IUser>('User', userSchema);

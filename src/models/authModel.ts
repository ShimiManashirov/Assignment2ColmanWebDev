import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  refreshTokens?: string[];
}



export interface IUser extends Document {
  username: string;
  password: string;
  refreshTokens?: string[];
  lastLogout?: Date; // שדה חדש
}

const userSchema: Schema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  refreshTokens: { type: [String], default: [] },
  lastLogout: { type: Date, default: null } // ערך ברירת מחדל
});



export default mongoose.model<IUser>('User', userSchema);

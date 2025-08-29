import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  dob: string;
  isActive: boolean;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  dob: { type: String, required: false },
  isActive: { type: Boolean, default: false },
});

const User = mongoose.model<IUser>("User", UserSchema);

export default User;

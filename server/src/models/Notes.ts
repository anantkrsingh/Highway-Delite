import mongoose, { Document, Schema, Types } from "mongoose";
import { IUser } from "./User";

export interface INote extends Document {
  title: string;
  content: string;
  user: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema: Schema<INote> = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true } 
);

const Note = mongoose.model<INote>("Note", NoteSchema);

export default Note;

// models/userModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProjectRef {
  id: mongoose.Types.ObjectId; // the actual Project _id
  name: string;
}

export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  projects: IProjectRef[];
}

const userSchema: Schema<IUser> = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    projects: [
      {
        id: {
          type: Schema.Types.ObjectId,
          ref: "Project",
          required: true,
        },
        name: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);

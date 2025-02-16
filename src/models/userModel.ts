// models/userModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProjectRef {
  id: mongoose.Types.ObjectId; // the actual Project _id
  name: string;
  createdAt: Date;
  updatedAt: Date;
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
        createdAt: { type: Date },
        updatedAt: { type: Date },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>("User", userSchema);

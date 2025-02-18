// models/projectModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IProject extends Document {
  user: mongoose.Types.ObjectId; // Which user owns this project
  name: string;
  idField: string;
  svgJson: any;
  clipPathsJson: any;
  data: any;
  variableFields: any;
  svgThresholds: any;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    idField: { type: String, required: true },
    svgJson: { type: Schema.Types.Mixed, default: {} },
    clipPathsJson: { type: Schema.Types.Mixed, default: {} },
    data: { type: Schema.Types.Mixed, default: {} },
    variableFields: { type: Schema.Types.Mixed, default: {} },
    svgThresholds: { type: Schema.Types.Mixed, default: {} },
  },
  {
    timestamps: true,
  }
);

export const Project = mongoose.model<IProject>("Project", ProjectSchema);

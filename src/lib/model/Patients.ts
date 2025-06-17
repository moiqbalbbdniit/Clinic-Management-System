import mongoose, { Schema } from "mongoose";

const PatientSchema = new Schema(
  {
    name: String,
    address: String,
    mobile: String,
    disease: String,
    totalCost: Number,
    dateOfVisit: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const PatientModel =
  mongoose.models.Patient || mongoose.model("Patient", PatientSchema);

import mongoose, { Schema, models, model } from "mongoose";

const PaymentSchema = new Schema(
  {
    patientId: {
      type: Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Use existing model if it exists (for hot reload in dev)
export const PaymentModel = models.Payment || model("Payment", PaymentSchema);

import dbConnect from "@/lib/db";
import { PaymentModel } from "@/lib/model/Payment";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// ✅ Utility to extract ID from request URL
function getIdFromUrl(url: string): string | null {
  const segments = url.split("/");
  return segments.pop() || segments.pop() || null; // Handles trailing slash
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const paymentId = getIdFromUrl(req.url); // ✅ Manual extraction
    if (!paymentId || !mongoose.Types.ObjectId.isValid(paymentId)) {
      return NextResponse.json({ error: "Invalid payment ID" }, { status: 400 });
    }

    const body = await req.json();

    const updated = await PaymentModel.findByIdAndUpdate(
      paymentId,
      {
        amount: body.amount,
        date: body.date ? new Date(body.date) : new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/payments/[id] error:", error);
    return NextResponse.json({ error: "Failed to update payment" }, { status: 500 });
  }
}

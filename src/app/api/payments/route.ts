import dbConnect from "@/lib/db";
import { PaymentModel } from "@/lib/model/Payment";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// --- GET: Fetch payments by patientId ---
export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");

  if (!patientId) return NextResponse.json([]);

  const payments = await PaymentModel.find({ patientId }).sort({ date: -1 }).lean();
  return NextResponse.json(payments);
}

// --- POST: Create new payment ---
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newPayment = await PaymentModel.create({
      patientId: body.patientId,
      amount: body.amount,
      date: body.date ? new Date(body.date) : new Date()
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json({ error: "Failed to save payment" }, { status: 500 });
  }
}

// --- PUT: Update payment by ID ---
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const url = new URL(req.url);
    const paymentId = url.pathname.split("/").pop(); // Extract ID from route `/api/payments/[id]`
    console.log("Updating payment with ID:", paymentId);
    if (!paymentId || !mongoose.Types.ObjectId.isValid(paymentId)) {
      return NextResponse.json({ error: "Invalid payment ID" }, { status: 400 });
    }

    const body = await req.json();
    const updated = await PaymentModel.findByIdAndUpdate(
      paymentId,
      {
        amount: body.amount,
        date: body.date ? new Date(body.date) : new Date()
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

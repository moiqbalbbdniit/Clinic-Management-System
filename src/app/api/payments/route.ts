import dbConnect from "@/lib/db";
import { PaymentModel } from "@/lib/model/Payment";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const patientId = searchParams.get("patientId");

  if (!patientId) return NextResponse.json([]);

  const payments = await PaymentModel.find({ patientId }).sort({ date: -1 }).lean();
  return NextResponse.json(payments);
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const newPayment = await PaymentModel.create({
      patientId: body.patientId,
      amount: body.amount,
      date: new Date(), // or: body.date if passed manually
    });

    return NextResponse.json(newPayment, { status: 201 });
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json({ error: "Failed to save payment" }, { status: 500 });
  }
}

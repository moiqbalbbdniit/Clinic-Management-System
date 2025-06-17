import dbConnect from "@/lib/db";
import { PatientModel } from "@/lib/model/patients";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const patient = await PatientModel.create({ ...data, dateOfVisit: new Date() });
  return NextResponse.json(patient);
}

export async function GET() {
  await dbConnect();
  const patients = await PatientModel.find().sort({ createdAt: -1 });
  return NextResponse.json(patients);
}

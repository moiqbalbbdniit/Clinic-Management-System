import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { PatientModel } from "@/lib/model/Patients";
import mongoose from "mongoose";

// Extract ID from URL
function getIdFromUrl(req: NextRequest): string | null {
  const url = new URL(req.url);
  const pathname = url.pathname;
  const match = pathname.match(/\/api\/patients\/([^\/\?]+)/);
  return match?.[1] || null;
}

// GET /api/patients/[id]
export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const id = getIdFromUrl(req);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
    }

    const patient = await PatientModel.findById(id).lean();

    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(patient);
  } catch (error) {
    console.error("GET /api/patients/[id] error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

// PUT /api/patients/[id]
export async function PUT(req: NextRequest) {
  try {
    await dbConnect();

    const id = getIdFromUrl(req);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
    }

    const updates = await req.json();

    const updatedPatient = await PatientModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!updatedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error("PUT /api/patients/[id] error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// DELETE /api/patients/[id]
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();

    const id = getIdFromUrl(req);
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid or missing ID" }, { status: 400 });
    }

    const deletedPatient = await PatientModel.findByIdAndDelete(id);

    if (!deletedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Patient deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE /api/patients/[id] error:", error);
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}

import dbConnect from "@/lib/db";
import { PatientModel} from "@/lib/model/Patients";
import { PatientType } from "@/lib/types"; // Assuming PatientType is correctly defined
import { PaymentModel } from "@/lib/model/Payment"; // Import PaymentModel to use its collection name
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

// --- Utility function to extract ID from URL (remains unchanged) ---


// --- POST /api/patients (remains unchanged) ---
export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  // Ensure dateOfVisit is set when creating a new patient
  // Assuming PatientModel schema has 'dateOfVisit: { type: Date, default: Date.now }'
  const patient = await PatientModel.create({ ...data, dateOfVisit: new Date() });
  return NextResponse.json(patient);
}

// --- GET /api/patients (UPDATED for monthly report and payments) ---
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);

    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    const matchQuery: mongoose.FilterQuery<PatientType> = {}; // Initialize empty match query

    // 1. Implement filtering by month and year for patients' 'dateOfVisit'
    if (monthParam && yearParam) {
      const monthNum = parseInt(monthParam, 10);
      const yearNum = parseInt(yearParam, 10);

      // Basic validation for month and year
      if (isNaN(monthNum) || monthNum < 1 || monthNum > 12 || isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
        return NextResponse.json({ error: "Invalid month or year provided for filter." }, { status: 400 });
      }

      // Calculate start and end dates for the selected month
      const startDate = new Date(yearNum, monthNum - 1, 1); // Month is 0-indexed in Date constructor
      const endDate = new Date(yearNum, monthNum, 1);       // First day of the next month

      // Apply date range filter to dateOfVisit.
      // IMPORTANT: Ensure 'dateOfVisit' field exists and is a Date type in your PatientModel schema.
      // If you meant 'createdAt', change this to 'createdAt'.
      matchQuery.dateOfVisit = {
        $gte: startDate,
        $lt: endDate,
      };
      console.log(`Filtering patients from ${startDate.toISOString()} to ${endDate.toISOString()}`);
    }

    // 2. Use MongoDB Aggregation to join Patient data with their Payments
    const patients = await PatientModel.aggregate([
      {
        $match: matchQuery, // Apply the date filter here
      },
      {
        $lookup: {
          from: PaymentModel.collection.name, // The name of the payments collection (e.g., 'payments' if model is 'Payment')
          localField: "_id",                 // Field from the input documents (PatientModel)
          foreignField: "patientId",         // Field from the documents of the "from" collection (PaymentModel)
          as: "payments",                    // The name of the new array field to add to the output documents
        },
      },
      // Optional: Add a $sort stage if you want specific ordering (e.g., by name or dateOfVisit)
      {
        $sort: { dateOfVisit: -1 } // Sort by most recent visit date first
      }
    ]);

    return NextResponse.json(patients);
  } catch (error) {
    console.error("GET /api/patients error:", error);
    return NextResponse.json({ error: "Something went wrong fetching patients" }, { status: 500 });
  }
}

// --- The /api/patients/[id] dynamic route handlers (GET, PUT, DELETE) are in a separate file.
// They remain unchanged and are not included in this file.

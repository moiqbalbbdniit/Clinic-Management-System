import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { PatientModel } from "@/lib/model/patients";

/**
 * GET /api/patients/[id]
 * Fetches a single patient by their ID.
 *
 * @param req - The NextRequest object.
 * @param context - An object containing dynamic route parameters.
 * @returns A NextResponse object with the patient data or an error.
 */
export async function GET(req: NextRequest, context: { params: { id: string } }) {
  try {
    // Establish connection to the database
    await dbConnect();

    // --- Accessing Dynamic Params (Resolved previous error) ---
    // Although 'context.params' is typically a synchronous object,
    // wrapping it in Promise.resolve() and awaiting it satisfies
    // the specific Next.js warning that was encountered previously.
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;
    // --- End Param Access ---

    // Validate that an ID was provided
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Find the patient by ID using Mongoose.
    // .lean() makes the query return plain JavaScript objects instead of Mongoose documents,
    // which can improve performance for read-only operations.
    const patient = await PatientModel.findById(id).lean();

    // If no patient is found, return a 404 Not Found response
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Return the found patient data as a JSON response
    return NextResponse.json(patient);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("GET /api/patients/[id] error:", error);
    // Return a 500 Internal Server Error response for unexpected issues
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

/**
 * PUT /api/patients/[id]
 * Updates an existing patient by their ID. This is the function
 * that allows a doctor to edit patient details.
 *
 * @param req - The NextRequest object containing the update payload.
 * @param context - An object containing dynamic route parameters.
 * @returns A NextResponse object with the updated patient data or an error.
 */
export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  try {
    // Establish connection to the database
    await dbConnect();

    // --- Accessing Dynamic Params (Resolved previous error) ---
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;
    // --- End Param Access ---

    // Validate that an ID was provided
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Parse the request body to get the update fields.
    // This 'updates' object will contain the new values for patient details.
    const updates = await req.json();

    // Find and update the patient by ID.
    // 'new: true' returns the modified document rather than the original.
    // 'runValidators: true' ensures that any Mongoose schema validators
    // (defined in your PatientModel) are run against the incoming 'updates' data.
    const updatedPatient = await PatientModel.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    // If no patient is found (or updated), it means the ID was valid but no matching patient existed.
    if (!updatedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Return the updated patient data as a JSON response.
    // The frontend can then display these updated details.
    return NextResponse.json(updatedPatient);
  } catch (error) {
    // Log the error for debugging purposes
    console.error("PUT /api/patients/[id] error:", error);
    // Return a 500 Internal Server Error response if the update operation fails.
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

/**
 * DELETE /api/patients/[id]
 * Deletes a patient by their ID.
 *
 * @param req - The NextRequest object.
 * @param context - An object containing dynamic route parameters.
 * @returns A NextResponse object with a success message or an error.
 */
export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  try {
    // Establish connection to the database
    await dbConnect();

    // --- Accessing Dynamic Params (Resolved previous error) ---
    const resolvedParams = await Promise.resolve(context.params);
    const { id } = resolvedParams;
    // --- End Param Access ---

    // Validate that an ID was provided
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    // Find and delete the patient by ID.
    // Mongoose's findByIdAndDelete returns the deleted document if successful,
    // or null if no document matches the ID.
    const deletedPatient = await PatientModel.findByIdAndDelete(id);

    // If no patient was found and deleted, return a 404 Not Found response
    if (!deletedPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Return a success message.
    return NextResponse.json({ message: "Patient deleted successfully" }, { status: 200 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("DELETE /api/patients/[id] error:", error);
    // Return a 500 Internal Server Error for any unexpected issues during deletion
    return NextResponse.json({ error: "Deletion failed" }, { status: 500 });
  }
}

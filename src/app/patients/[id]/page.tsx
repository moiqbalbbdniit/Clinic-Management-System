"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { toast, Toaster } from "sonner";
import type { PatientType, PaymentType } from "@/lib/types";
import PaymentForm from "@/components/PaymentForm";
import PatientForm from "@/components/PatientForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorLoader from "@/components/Loader";

export default function PatientDetailPage({ params }: { params: { id: string } }) {
  const [patient, setPatient] = useState<PatientType | null>(null);
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchDetails = async () => {
    if (!params.id) {
      console.error("❌ params.id is undefined");
      toast.error("Invalid patient ID.");
      setLoading(false);
      return;
    }

    console.log("✅ Fetching patient details for ID:", params.id);

    try {
      const resPatient = await axios.get(`/api/patients/${params.id}`);
      console.log("✅ Patient data received:", resPatient.data);
      
      const resPayments = await axios.get(`/api/payments?patientId=${params.id}`);
      console.log("✅ Payments data received:", resPayments.data);

      setPatient(resPatient.data);
      setPayments(resPayments.data);
    } catch (err) {
      console.error("❌ Error fetching patient or payments:", err);
      toast.error("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this patient?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/patients/${params.id}`);
      toast.success("Patient deleted successfully");
      router.push("/search");
    } catch (err) {
      toast.error("Failed to delete patient");
      console.error("❌ Error deleting patient:", err);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    console.log("⏳ Loading data...");
    return <DoctorLoader />;
  }

  if (!patient) {
    console.warn("⚠️ No patient data found!");
    return (
      <main className="max-w-3xl mx-auto p-4">
        <Toaster />
        <div className="text-center text-red-500 font-semibold">
          Patient not found.
        </div>
      </main>
    );
  }

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = patient.totalCost - totalPaid;

  return (
    <>
      <Toaster />
      <main className="max-w-3xl mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-700">Patient Detail</h1>
          <div className="space-x-2">
            <Button variant="default" onClick={() => setEditMode((prev) => !prev)}>
              {editMode ? "Cancel Edit" : "Edit Patient"}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        {editMode ? (
          <PatientForm
            initialData={patient}
            patientId={params.id}
            onSuccess={() => {
              fetchDetails();
              setEditMode(false);
            }}
          />
        ) : (
          <Card className="p-4 space-y-1 bg-white shadow">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Mobile:</strong> {patient.mobile}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            <p><strong>Disease:</strong> {patient.disease}</p>
            <p><strong>Total Cost:</strong> ₹{patient.totalCost}</p>
            <p><strong>Total Paid:</strong> ₹{totalPaid}</p>
            <p><strong>Balance:</strong> ₹{balance}</p>
          </Card>
        )}

        <PaymentForm patientId={params.id} onPaid={fetchDetails} />

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-teal-800">Payment History</h2>
          {payments.length === 0 ? (
            <p>No payments yet.</p>
          ) : (
            payments.map((pay) => (
              <Card key={pay._id} className="p-3">
                ₹{pay.amount} on {dayjs(pay.date).format("DD-MM-YYYY")}
              </Card>
            ))
          )}
        </div>
      </main>
    </>
  );
}

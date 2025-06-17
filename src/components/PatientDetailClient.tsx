// components/PatientDetailClient.tsx
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

export default function PatientDetailClient({ id }: { id: string }) {
  const [patient, setPatient] = useState<PatientType | null>(null);
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const fetchDetails = async () => {
    if (!id) {
      toast.error("Invalid patient ID.");
      setLoading(false);
      return;
    }

    try {
      const resPatient = await axios.get(`/api/patients/${id}`);
      const resPayments = await axios.get(`/api/payments?patientId=${id}`);

      setPatient(resPatient.data);
      setPayments(resPayments.data);
    } catch (err) {
      console.error("❌ Error fetching data:", err);
      toast.error("Failed to load patient data.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this patient?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/api/patients/${id}`);
      toast.success("Patient deleted successfully");
      router.push("/search");
    } catch (err) {
      toast.error("Failed to delete patient");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) return <DoctorLoader />;

  if (!patient) {
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
            <Button onClick={() => setEditMode((prev) => !prev)}>
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
            patientId={id}
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

        <PaymentForm patientId={id} onPaid={fetchDetails} />

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

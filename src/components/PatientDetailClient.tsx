"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import type { PatientType, PaymentType } from "@/lib/types";
// your components
import PaymentForm from "@/components/PaymentForm";
import PatientForm from "@/components/PatientForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorLoader from "@/components/Loader";

export default function PatientDetailClient() {
  const { id } = useParams(); // ✅ extract id here
  const router = useRouter();

  const [patient, setPatient] = useState<PatientType | null>(null);
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    if (!id || typeof id !== "string") return;

    try {
      const resPatient = await axios.get(`/api/patients/${id}`);
      const resPayments = await axios.get(`/api/payments?patientId=${id}`);
      setPatient(resPatient.data);
      setPayments(resPayments.data);
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id || typeof id !== "string") return;

    try {
      await axios.delete(`/api/patients/${id}`);
      toast.success("Deleted successfully");
      router.push("/search");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) return <DoctorLoader />;
  if (!patient) return <div>Patient not found</div>;

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
              {editMode ? "Cancel Edit" : "Edit"}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>

        {editMode ? (
          <PatientForm
            initialData={patient}
            patientId={id as string}
            onSuccess={() => {
              fetchDetails();
              setEditMode(false);
            }}
          />
        ) : (
          <Card className="p-4">
            <p><strong>Name:</strong> {patient.name}</p>
            <p><strong>Mobile:</strong> {patient.mobile}</p>
            <p><strong>Address:</strong> {patient.address}</p>
            <p><strong>Disease:</strong> {patient.disease}</p>
            <p><strong>Total Cost:</strong> ₹{patient.totalCost}</p>
            <p><strong>Total Paid:</strong> ₹{totalPaid}</p>
            <p><strong>Balance:</strong> ₹{balance}</p>
          </Card>
        )}

        <PaymentForm patientId={id as string} onPaid={fetchDetails} />

        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-teal-800">Payment History</h2>
          {payments.map((pay) => (
            <Card key={pay._id} className="p-3">
              ₹{pay.amount} on {dayjs(pay.date).format("DD-MM-YYYY")}
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}

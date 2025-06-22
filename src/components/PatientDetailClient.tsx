"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import dayjs from "dayjs";
import type { PatientType, PaymentType } from "@/lib/types";

import PaymentForm from "@/components/PaymentForm";
import PatientForm from "@/components/PatientForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import DoctorLoader from "@/components/Loader";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

export default function PatientDetailClient() {
  const { id } = useParams();
  const router = useRouter();

  const [patient, setPatient] = useState<PatientType | null>(null);
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [editMode, setEditMode] = useState(false);
  const [editPayment, setEditPayment] = useState<PaymentType | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    if (!id || typeof id !== "string") return;

    try {
      const resPatient = await axios.get(`/api/patients/${id}`);
      const resPayments = await axios.get(`/api/payments?patientId=${id}`);
      setPatient(resPatient.data);
      setPayments(resPayments.data);
    } catch (err) {
      console.error("Error fetching patient details:", err);
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
      console.error("Error deleting patient:", err);
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) return <DoctorLoader />;
  if (!patient) return <div className="text-center text-red-600">Patient not found</div>;

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const balance = patient.totalCost - totalPaid;

  return (
    <>
      <Toaster />
      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-wrap gap-2 justify-between items-center">
          <h1 className="text-2xl font-bold text-teal-700">Patient Detail</h1>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setEditMode((prev) => !prev)}>
              {editMode ? "Cancel Edit" : "Edit"}
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the patient and all payment records.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Yes, Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button variant="outline" onClick={() => router.push("/")}>
              Return to Add Patient
            </Button>

            <Button variant="secondary" onClick={() => router.push("/search")}>
              List of Patients
            </Button>
          </div>
        </div>

        {/* Patient Info */}
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
          <Card className="p-6 space-y-2 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p><strong>Name:</strong> {patient.name}</p>
              <p><strong>Mobile:</strong> {patient.mobile}</p>
              <p><strong>Address:</strong> {patient.address}</p>
              <p><strong>Disease:</strong> {patient.disease}</p>
              <p><strong>Total Cost:</strong> ₹{patient.totalCost}</p>
              <p><strong>Total Paid:</strong> ₹{totalPaid}</p>
              <p><strong>Balance:</strong> ₹{balance}</p>
              <p><strong>Admission Date:</strong> {dayjs(patient.dateOfVisit).format("DD-MM-YYYY")}</p>
            </div>
          </Card>
        )}

        {/* Payment Form */}
        {!editPayment && (
          <div className="pt-4">
            <PaymentForm patientId={id as string} onPaid={fetchDetails} />
          </div>
        )}

        {/* Payment History */}
        <div className="space-y-2 pt-4">
          <h2 className="text-lg font-semibold text-teal-800">Payment History</h2>
          {payments.length === 0 ? (
            <p className="text-sm text-gray-600">No payments recorded yet.</p>
          ) : (
            payments.map((pay) => (
              <Card
                key={pay._id}
                className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
              >
                <div className="text-sm">
                  ₹{pay.amount} on {dayjs(pay.date).format("DD-MM-YYYY")}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditPayment(pay)}
                  className="w-full sm:w-auto"
                >
                  Edit
                </Button>
              </Card>
            ))
          )}
        </div>

        {/* Edit Payment */}
        {editPayment && (
          <Card className="p-4 bg-gray-50 border mt-4">
            <h3 className="font-medium mb-3 text-sm text-teal-700">Edit Payment</h3>
            <PaymentForm
              patientId={id as string}
              paymentId={editPayment._id}
              initialData={editPayment}
              onPaid={() => {
                fetchDetails();
                setEditPayment(null);
              }}
              onCancel={() => setEditPayment(null)}
            />
          </Card>
        )}
      </main>
    </>
  );
}

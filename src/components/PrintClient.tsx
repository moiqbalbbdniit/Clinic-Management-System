"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import type { PatientType, PaymentType } from "@/lib/types";

export default function PrintClient() {
  const { id } = useParams(); // ✅ fetch ID from URL
  const [patient, setPatient] = useState<PatientType | null>(null);
  const [payments, setPayments] = useState<PaymentType[]>([]);

  useEffect(() => {
    if (!id) return;

    const fetch = async () => {
      const res1 = await axios.get(`/api/patients/${id}`);
      const res2 = await axios.get(`/api/payments?patientId=${id}`);
      setPatient(res1.data);
      setPayments(res2.data);
      setTimeout(() => window.print(), 500);
    };

    fetch();
  }, [id]);

  const totalPaid = payments.reduce((acc, p) => acc + p.amount, 0);
  const balance = patient ? patient.totalCost - totalPaid : 0;

  if (!patient) return <p>Loading...</p>;

  return (
    <main className="p-6 print:p-2 font-sans text-sm text-black">
      {/* content same as before */}
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-teal-700">Obonti Piles Clinic</h1>
        <p className="font-medium">Dr. Abhijit Kumar Vishwas</p>
        <p className="text-xs">{new Date().toLocaleDateString("en-IN")}</p>
        <hr className="my-2 border-gray-400" />
      </div>

      <div className="mb-4 space-y-1">
        <p><strong>Name:</strong> {patient.name}</p>
        <p><strong>Mobile:</strong> {patient.mobile}</p>
        <p><strong>Address:</strong> {patient.address}</p>
        <p><strong>Disease:</strong> {patient.disease}</p>
        <p><strong>Total Cost:</strong> ₹{patient.totalCost}</p>
        <p><strong>Total Paid:</strong> ₹{totalPaid}</p>
        <p><strong>Balance:</strong> ₹{balance}</p>
      </div>

      <div className="mt-6">
        <h2 className="font-semibold underline text-teal-700 mb-2">Payment History</h2>
        {payments.length === 0 ? (
          <p>No payments made.</p>
        ) : (
          <table className="w-full border border-gray-300 text-sm">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-2 py-1">#</th>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p._id}>
                  <td className="border px-2 py-1 text-center">{i + 1}</td>
                  <td className="border px-2 py-1">{dayjs(p.date).format("DD-MM-YYYY")}</td>
                  <td className="border px-2 py-1 text-right">{p.amount}</td>
                </tr>
              ))}
              <tr className="font-semibold">
                <td colSpan={2} className="border px-2 py-1 text-right">Total</td>
                <td className="border px-2 py-1 text-right">₹{totalPaid}</td>
              </tr>
            </tbody>
          </table>
        )}
      </div>

      <p className="mt-8 text-center italic text-xs">
        This receipt is system generated. Thank you for trusting Obonti Piles Clinic.
      </p>
    </main>
  );
}

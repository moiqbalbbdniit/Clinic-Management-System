"use client";

import { useEffect, useState, useCallback } from "react"; // Import useCallback
import axios from "axios";
import { useRouter } from "next/navigation";
import PatientForm from "@/components/PatientForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Stethoscope, Search, Printer } from "lucide-react";
import { toast, Toaster } from "sonner"; // Assuming you want toasts for this page too

export default function HomePage() {
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const router = useRouter();

  // Define fetchPatients as a useCallback to ensure it's stable and won't cause
  // unnecessary re-renders or effect re-runs if passed as a prop
  const fetchPatients = useCallback(async () => {
    try {
      const res = await axios.get("/api/patients");
      setTotalPatients(res.data.length);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      toast.error("Failed to load total patients."); // Add a toast for error
    }
  }, []); // Empty dependency array means this function is created once

  // Initial fetch when the component mounts
  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]); // Depend on fetchPatients (which is stable due to useCallback)

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10 bg-gray-50">
      <Toaster /> {/* Place Toaster for notifications */}
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2 text-teal-700">
            <Stethoscope className="w-8 h-8" />
            Obonti Piles Clinic Management Dashboard
          </h1>
          <div className="flex gap-3 flex-wrap">
            <Button
              onClick={() => router.push("/search")}
              variant="outline"
              className="flex items-center gap-2 border-teal-600 text-teal-700 hover:bg-teal-100"
            >
              <Search className="w-4 h-4" />
              View Patients
            </Button>
            <Button
              onClick={() => router.push("/print/monthly")} 
              variant="default"
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700"
            >
              <Printer className="w-4 h-4" />
              Print Monthly Report
            </Button>
          </div>
        </div>

        {/* Stat Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-xl shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Patients</p>
                <p className="text-2xl font-bold">{totalPatients}</p>
              </div>
              <Users className="w-9 h-9 opacity-80" />
            </div>
          </Card>
        </div>

        {/* Patient Form */}
        <div className="mt-6">
          {/* Pass the fetchPatients function as an onSuccess prop */}
          <PatientForm onSuccess={fetchPatients} />
        </div>
      </div>
    </main>
  );
}

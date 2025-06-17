"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PatientForm from "@/components/PatientForm";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Stethoscope, Search } from "lucide-react";

export default function HomePage() {
  const [totalPatients, setTotalPatients] = useState<number>(0);
  const router = useRouter();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get("/api/patients");
        setTotalPatients(res.data.length);
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };
    fetchPatients();
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-start px-4 py-10 bg-gray-50">
      <div className="w-full max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold flex items-center gap-2 text-teal-700">
            <Stethoscope className="w-8 h-8" />
            Obonti Piles Clinic Management Dashboard
          </h1>
          <Button
            onClick={() => router.push("/search")}
            variant="outline"
            className="flex items-center gap-2 border-teal-600 text-teal-700 hover:bg-teal-100"
          >
            <Search className="w-4 h-4" />
            View Patients
          </Button>
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
          <PatientForm />
        </div>
      </div>
    </main>
  );
}

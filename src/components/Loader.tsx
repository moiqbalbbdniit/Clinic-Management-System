// components/DoctorLoader.tsx
"use client";

import { Stethoscope } from "lucide-react";

export default function DoctorLoader() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center gap-4 animate-pulse">
        <Stethoscope className="w-12 h-12 text-teal-600 animate-spin" />
        <p className="text-teal-700 font-semibold text-lg">Loading, please wait...</p>
      </div>
    </div>
  );
}

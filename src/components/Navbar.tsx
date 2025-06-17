// components/Navbar.tsx
"use client";

import { CalendarDays } from "lucide-react";

export default function Navbar() {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AK</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Dr. Abhijit Kumar Vishwas
              </h1>
              <p className="text-xs text-teal-800 font-bold">
                Obonti Piles Clinic – Patient Management System
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-700 font-medium">
            <CalendarDays size={18} />
            <span>{today}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

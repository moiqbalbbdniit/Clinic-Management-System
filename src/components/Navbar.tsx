"use client";

import { CalendarDays, LogOut } from "lucide-react";
import { UserButton, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { signOut } = useClerk();
  const router = useRouter();

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
          {/* Left Side: Logo and Title */}
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">AK</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Dr. Abhijit Kumar
              </h1>
              <p className="text-xs text-teal-800 font-bold">
                Obonti Piles Clinic – Patient Management System
              </p>
            </div>
          </div>

          {/* Right Side: Date, User, Logout */}
          <div className="flex items-center space-x-4 text-sm text-gray-700 font-medium">
            <div className="flex items-center space-x-2">
              <CalendarDays size={18} />
              <span>{today}</span>
            </div>

            {/* Clerk User Button */}
            <UserButton afterSignOutUrl="/" />

            {/* Custom Logout Button */}
            <button
              onClick={async () => {
                await signOut();
                router.push("/");
              }}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

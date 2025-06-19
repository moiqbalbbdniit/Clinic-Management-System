// File: src/app/seedData/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast, Toaster } from "sonner";
import axios from "axios";

export default function SeedDataPage() {
  const [seeding, setSeeding] = useState(false);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await axios.post("/api/seed");
      toast.success("Sample data seeded successfully!");
    } catch (err) {
      toast.error("Failed to seed data");
      console.error(err);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto py-10 px-4 space-y-4">
      <Toaster />
      <h1 className="text-2xl font-bold text-center text-teal-700">Seed Sample Data</h1>
      <p className="text-sm text-center">This will generate 50–100 patient records for June, July, and August 2025 with partial payments.</p>
      <div className="flex justify-center">
        <Button onClick={handleSeed} disabled={seeding} className="px-6 py-2">
          {seeding ? "Seeding..." : "Seed Sample Data"}
        </Button>
      </div>
    </main>
  );
}

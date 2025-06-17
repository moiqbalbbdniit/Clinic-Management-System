"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PaymentForm({ patientId, onPaid }: { patientId: string; onPaid: () => void }) {
  const [amount, setAmount] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/payments", {
        patientId,
        amount: parseInt(amount),
      });
      setAmount("");
      onPaid(); // refresh payments
    } catch (err) {
      console.error("Payment submit error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <Input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Button type="submit">Save</Button>
    </form>
  );
}

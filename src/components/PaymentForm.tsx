"use client";

import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function PaymentForm({ patientId, onPaid }: { patientId: string; onPaid: () => void }) {
  const [amount, setAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(new Date());

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/payments", {
        patientId,
        amount: parseInt(amount),
        date: paymentDate,
      });
      setAmount("");
      setPaymentDate(new Date());
      onPaid(); // refresh payments
    } catch (err) {
      console.error("Payment submit error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 flex-wrap">
      <Input
        type="number"
        placeholder="Enter amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "text-sm w-[160px] justify-start text-left font-normal",
              !paymentDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {paymentDate ? format(paymentDate, "PPP") : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar mode="single" selected={paymentDate} onSelect={setPaymentDate} initialFocus />
        </PopoverContent>
      </Popover>
      <Button type="submit">Save</Button>
    </form>
  );
}

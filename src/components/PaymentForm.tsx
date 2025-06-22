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
import { toast } from "sonner";
import { Card } from "@/components/ui/card";

export default function PaymentForm({
  patientId,
  onPaid,
  initialData,
  paymentId,
  onCancel,
}: {
  patientId: string;
  onPaid: () => void;
  initialData?: { amount: number; date: string };
  paymentId?: string;
  onCancel?: () => void;
}) {
  const [amount, setAmount] = useState(initialData?.amount?.toString() || "");
  const [paymentDate, setPaymentDate] = useState<Date | undefined>(
    initialData?.date ? new Date(initialData.date) : new Date()
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      patientId,
      amount: parseInt(amount),
      date: paymentDate,
    };

    try {
      if (paymentId) {
        await axios.put(`/api/payments/${paymentId}`, payload);
        toast.success("Payment updated");
      } else {
        await axios.post("/api/payments", payload);
        toast.success("Payment saved");
      }
      setAmount("");
      setPaymentDate(new Date());
      onPaid();
      onCancel?.();
    } catch (err) {
      console.error("Payment submit error:", err);
      toast.error("Failed to save payment");
    }
  };

  return (
    <Card className="p-6 border border-gray-200 shadow-sm rounded-xl">
      <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-3">
        {/* Amount Input */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Amount (₹)</label>
          <Input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        {/* Date Picker */}
        <div>
          <label className="block text-sm font-medium mb-1 text-gray-700">Payment Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left text-sm font-normal",
                  !paymentDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {paymentDate ? format(paymentDate, "PPP") : <span>Select date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={paymentDate}
                onSelect={setPaymentDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-6 sm:mt-0">
          <Button type="submit" className="w-full">
            {paymentId ? "Update" : "Save"}
          </Button>
          {paymentId && onCancel && (
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              className="w-full"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Card>
  );
}

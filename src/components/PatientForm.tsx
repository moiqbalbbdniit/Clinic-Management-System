"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import axios from "axios";
import type { PatientType } from "@/lib/types";
import { toast } from "sonner";
import {  XCircle } from "lucide-react";

export default function PatientForm({
  initialData,
  patientId,
  onSuccess,
}: {
  initialData?: PatientType;
  patientId?: string;
  onSuccess?: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    address: "",
    mobile: "",
    disease: "",
    totalCost: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        address: initialData.address,
        mobile: initialData.mobile,
        disease: initialData.disease,
        totalCost: initialData.totalCost.toString(),
      });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (patientId) {
        await axios.put(`/api/patients/${patientId}`, {
          ...form,
          totalCost: parseInt(form.totalCost),
        });
        toast.success("Patient updated successfully");

      } else {
        await axios.post("/api/patients", {
          ...form,
          totalCost: parseInt(form.totalCost),
        });
        toast.success("Patient added successfully");
      }

      onSuccess?.();
      setForm({
        name: "",
        address: "",
        mobile: "",
        disease: "",
        totalCost: "",
      });
    } catch (err) {
      console.error("Submit failed", err);
      toast.error(
        <div className="flex items-center gap-2">
          <XCircle className="text-red-600 w-5 h-5" />
          <span>Something went wrong</span>
        </div>
      );
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md p-6 shadow-lg border border-gray-200 bg-white">
        <h2 className="text-xl font-semibold mb-4 text-center text-teal-700">
          {patientId ? "Edit Patient" : "Add New Patient"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <Input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            required
          />
          <Input
            name="mobile"
            placeholder="Mobile"
            value={form.mobile}
            onChange={handleChange}
            required
          />
          <Input
            name="disease"
            placeholder="Disease"
            value={form.disease}
            onChange={handleChange}
            required
          />
          <Input
            name="totalCost"
            placeholder="Total Cost"
            value={form.totalCost}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="w-full">
            {patientId ? "Update Patient" : "Add Patient"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

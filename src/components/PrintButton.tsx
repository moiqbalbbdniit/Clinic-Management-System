"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrintButton() {
  return (
    <Button onClick={() => window.print()} variant="outline" className="flex gap-2 items-center">
      <Printer className="w-4 h-4" />
      Print
    </Button>
  );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Printer, Eye } from "lucide-react";
import { PatientType } from "@/lib/types";

export default function PatientCard({ patient }: { patient: PatientType }) {
  const handlePrint = () => {
    window.open(`/print/${patient._id}`, "_blank");
  };

  return (
    <div className="bg-white p-4 rounded shadow-md space-y-2 border">
      <h2 className="text-lg font-semibold">{patient.name}</h2>
      <p className="text-sm">Mobile: {patient.mobile}</p>
      <p className="text-sm">Disease: {patient.disease}</p>
      <div className="flex gap-2 mt-2">
        <Link href={`/patients/${patient._id}`}>
          <Button size="sm" variant="default" className="flex gap-1 items-center">
            <Eye className="w-4 h-4" />
            View
          </Button>
        </Link>
        <Button
          size="sm"
          variant="outline"
          className="flex gap-1 items-center"
          onClick={handlePrint}
        >
          <Printer className="w-4 h-4" />
          Print
        </Button>
      </div>
    </div>
  );
}

"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Button } from "@/components/ui/button";
import DoctorLoader from "@/components/Loader";
import { toast, Toaster } from "sonner"; // Import toast and Toaster
import { PatientType, PaymentType } from "@/lib/types";

// Assuming your PatientType and PaymentType are defined in '@/lib/types'
// Make sure PaymentType includes an 'amount' property
// export interface PaymentType { amount: number; }
// export interface PatientType {
//   _id: string;
//   name: string;
//   mobile: string;
//   address: string;
//   disease: string;
//   totalCost: number;
//   dateOfVisit?: Date; // Optional based on your schema
//   createdAt: Date;
//   payments?: PaymentType[]; // Crucial for the aggregated data
// }

export default function PrintByMonthPage() {
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [patients, setPatients] = useState<PatientType[]>([]);
  const [loading, setLoading] = useState(false);
  const [readyToPrint, setReadyToPrint] = useState(false);
const router = useRouter();
  const handleFetch = async () => {
    if (!month || !year) {
      toast.error("Please select both month and year.");
      return;
    }
    setLoading(true);
    setReadyToPrint(false);
    try {
      const res = await axios.get(`/api/patients?month=${month}&year=${year}`);
      setPatients(res.data);
      if (res.data.length === 0) {
        toast.info(
          `No patients found for ${dayjs()
            .month(Number(month) - 1)
            .format("MMMM")} ${year}.`
        );
      } else {
        toast.success(
          `${res.data.length} patients found for ${dayjs()
            .month(Number(month) - 1)
            .format("MMMM")} ${year}.`
        );
      }
      setReadyToPrint(true);
    } catch (err) {
      console.error("Failed to fetch patients", err);
      toast.error("Failed to fetch data. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    // Change: Initialize jsPDF with 'landscape' orientation

    // To make it landscape, use 'l' instead of 'p'
    const doc_landscape = new jsPDF("l", "mm", "a4");

    // --- Header ---
    doc_landscape.setFontSize(18);
    doc_landscape.setTextColor(34, 139, 34); // ForestGreen, or use RGB for teal-700
    doc_landscape.text(
      `Obonti Piles Clinic`,
      doc_landscape.internal.pageSize.width / 2,
      15,
      { align: "center" }
    );
    doc_landscape.setFontSize(12);
    doc_landscape.setTextColor(0, 0, 0); // Black
    doc_landscape.text(
      `Dr. Abhijit Kumar`,
      doc_landscape.internal.pageSize.width / 2,
      22,
      { align: "center" }
    );
    doc_landscape.setFontSize(10);
    doc_landscape.text(
      `Monthly Patient Report - ${dayjs()
        .month(Number(month) - 1)
        .format("MMMM")} ${year}`,
      doc_landscape.internal.pageSize.width / 2,
      29,
      { align: "center" }
    );
    doc_landscape.line(14, 32, doc_landscape.internal.pageSize.width - 14, 32); // Horizontal line

    // --- Table Content ---
    autoTable(doc_landscape, {
      startY: 37, // Adjusted startY to give space for the header
      head: [
        // Removed "Partial Payments" column
        [
          "#",
          "Name",
          "Admit Date",
          "Mobile",
          "Address",
          "Disease",
          "Total Cost (₹)",
          "Paid (₹)",
          "Balance (₹)",
        ],
      ],
      body: patients.map((p, index) => {
        const totalPaid =
          p.payments?.reduce(
            (sum: number, pay: PaymentType) => sum + pay.amount,
            0
          ) || 0;
        const balance = p.totalCost - totalPaid;

        return [
          index + 1, // Serial number
          p.name,
          dayjs(p.dateOfVisit).format("DD-MM-YYYY"), // ✅ Format date properly
          p.mobile,
          p.address,
          p.disease,
          p.totalCost.toFixed(0),
          totalPaid.toFixed(0),
          balance.toFixed(0),
        ];
      }),

      styles: {
        fontSize: 9, // Slightly increased font size since fewer columns
        cellPadding: 1.5,
        valign: "middle",
        // overflow: 'linebreak', // Not as crucial now that partial payments are removed
      },
      headStyles: {
        fillColor: [22, 163, 74], // Darker green for header (Tailwind's teal-700 approx)
        textColor: [255, 255, 255], // White text
        fontStyle: "bold",
        halign: "center", // Center align header text
      },
      columnStyles: {
        // Adjusted column widths for 8 columns instead of 9
        // These widths will apply to landscape mode
        0: { halign: "center", cellWidth: 10 }, // #
        1: { halign: "left", cellWidth: 40 }, // Name (more space in landscape)
        2: { halign: "left", cellWidth: 30 }, // Mobile
        3: { halign: "left", cellWidth: 55 }, // Address (more space in landscape)
        4: { halign: "left", cellWidth: 35 }, // Disease
        5: { halign: "right", cellWidth: 25 }, // Total Cost
        6: { halign: "right", cellWidth: 25 }, // Paid
        7: { halign: "right", cellWidth: 25 }, // Balance
      },
      didDrawPage: function (data) {
        // Footer
        const pageCount = doc_landscape.internal.pages.length - 1; // Correct page count
        doc_landscape.setFontSize(8);
        doc_landscape.setTextColor(150);
        doc_landscape.text(
          `Page ${data.pageNumber} of ${pageCount}`,
          doc_landscape.internal.pageSize.width - 20,
          doc_landscape.internal.pageSize.height - 10,
          { align: "right" }
        );
        doc_landscape.text(
          `Generated on ${new Date().toLocaleDateString("en-IN")}`,
          14,
          doc_landscape.internal.pageSize.height - 10,
          { align: "left" }
        );
        doc_landscape.text(
          `This receipt is system generated. Thank you for trusting Obonti Piles Clinic.`,
          doc_landscape.internal.pageSize.width / 2,
          doc_landscape.internal.pageSize.height - 5,
          { align: "center" }
        );
      },
    });

    doc_landscape.save(`Patient_Report_${month}_${year}.pdf`);
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <Toaster /> {/* Place Toaster for notifications */}
      <h1 className="text-2xl font-bold text-teal-700 text-center">
        Monthly Patient Report
      </h1>
      <Button className="ml-auto" onClick={() => router.push("/")}>
                Return to Add Patient
              </Button>
      <div className="flex flex-wrap gap-4 justify-center items-end">
        <div>
          <label htmlFor="month-select" className="block mb-1 text-sm">
            Select Month
          </label>
          <select
            id="month-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Month --</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={String(m).padStart(2, "0")}>
                {dayjs()
                  .month(m - 1)
                  .format("MMMM")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="year-input" className="block mb-1 text-sm">
            Select Year
          </label>
          <input
            id="year-input"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border p-2 rounded"
            min="2020"
            max={new Date().getFullYear()} // Limit max year to current year
          />
        </div>
        <Button onClick={handleFetch} className="h-10">
          Fetch Data
        </Button>
      </div>
      {loading && <DoctorLoader />}
      {readyToPrint && patients.length > 0 && (
        <div className="text-center">
          <p className="mb-4">
            {patients.length} patients found for{" "}
            {dayjs()
              .month(Number(month) - 1)
              .format("MMMM")}{" "}
            ${year}.
          </p>
          <Button
            onClick={handleDownloadPDF}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Download PDF Report
          </Button>
        </div>
      )}
      {readyToPrint && patients.length === 0 && (
        <div className="text-center text-gray-600">
          <p>No data available for the selected month and year.</p>
          <p>
            Please adjust your selection or ensure patients exist for that
            period.
          </p>
        </div>
      )}
    </main>
  );
}

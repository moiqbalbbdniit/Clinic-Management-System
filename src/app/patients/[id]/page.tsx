// app/patients/[id]/page.tsx
import PatientDetailClient from "@/components/PatientDetailClient";

export default function Page({ params }: { params: { id: string } }) {
  return <PatientDetailClient id={params.id} />;
}

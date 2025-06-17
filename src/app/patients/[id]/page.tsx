// app/patients/[id]/page.tsx
import PatientDetailClient from "@/components/PatientDetailClient";

export default async function Page({ params }: { params: { id: string } }) {
  // --- This is the line that needs to be fixed ---
  // const id = await Promise.resolve(params.id); // <--- REMOVE THIS LINE
  const id = params.id; // <--- USE THIS LINE INSTEAD

  return <PatientDetailClient id={id} />;
}

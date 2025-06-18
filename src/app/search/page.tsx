"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import PatientCard from "@/components/PatientCard";
import SearchBar from "@/components/SearchBar";
import type { PatientType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import DoctorLoader from "@/components/Loader";

const BATCH_SIZE = 20;

export default function SearchPage() {
  const [allPatients, setAllPatients] = useState<PatientType[]>([]);
  const [displayedPatients, setDisplayedPatients] = useState<PatientType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    axios.get("/api/patients").then((res) => {
      setAllPatients(res.data);
      setDisplayedPatients(res.data.slice(0, BATCH_SIZE));
      setLoading(false);
    });
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const filtered = allPatients.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.mobile.includes(query)
    );
    setDisplayedPatients(filtered.slice(0, BATCH_SIZE));
    setVisibleCount(BATCH_SIZE);
  };

  const handleLoadMore = () => {
    const filtered = allPatients.filter((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mobile.includes(searchQuery)
    );
    const nextBatch = filtered.slice(0, visibleCount + BATCH_SIZE);
    setDisplayedPatients(nextBatch);
    setVisibleCount(visibleCount + BATCH_SIZE);
  };

  const hasMore = allPatients.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.mobile.includes(searchQuery)
  ).length > displayedPatients.length;

  if (loading) return <DoctorLoader />;

  return (
    <main className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-center w-full">Search Patients</h1>
        <Button className="ml-auto" onClick={() => router.push("/")}>
          Return to Add Patient
        </Button>
      </div>

      <SearchBar onSearch={handleSearch} />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {displayedPatients.map((p) => (
          <PatientCard key={p._id} patient={p} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center">
          <Button onClick={handleLoadMore} className="mt-4">Load More</Button>
        </div>
      )}
    </main>
  );
}

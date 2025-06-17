"use client";

import { Input } from "./ui/input";

export default function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  return (
    <div className="w-full flex justify-center mt-6">
      <div className="flex w-full max-w-md items-center space-x-2">
        <Input
          type="text"
          placeholder="Search by name or mobile"
          onChange={(e) => onSearch(e.target.value)}
          className="rounded-xl border-2 border-teal-500 shadow-md focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-transparent transition duration-200"
        />
      </div>
    </div>
  );
}

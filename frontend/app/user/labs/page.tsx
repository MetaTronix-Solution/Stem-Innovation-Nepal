"use client";

import { useEffect, useMemo, useState } from "react";

import LabHero from "@/components/labs/LabHero";
import SearchBar from "@/components/labs/SearchBar";
import LabCard from "@/components/labs/LabCard";

import { getLabs } from "@/services/lab.service";

import { Lab } from "@/types/lab";

import { Loader2 } from "lucide-react";

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchLabs();
  }, []);

  async function fetchLabs() {
    try {
      setLoading(true);

      const data = await getLabs();

      setLabs(data.labs);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const filteredLabs = useMemo(() => {
    return labs.filter((lab) =>
      lab.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [labs, search]);

  return (
    <main className="container mx-auto px-6 py-12 space-y-12">

      <LabHero />

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : filteredLabs.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-16 text-center">

          <h2 className="text-2xl font-bold">
            No Laboratory Found
          </h2>

          <p className="mt-3 text-gray-500">
            Try searching with another keyword.
          </p>

        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">

          {filteredLabs.map((lab) => (
            <LabCard
              key={lab._id}
              lab={lab}
            />
          ))}

        </div>
      )}
    </main>
  );
}
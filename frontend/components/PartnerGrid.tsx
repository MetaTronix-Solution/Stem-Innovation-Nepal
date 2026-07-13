"use client";

import { useMemo, useState } from "react";
import { partnerSchools } from "@/lib/data";

type FilterKey = "All" | "School" | "College";

export default function PartnerGrid() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("All");

  const results = useMemo(() => {
    return partnerSchools.filter((p) => {
      const matchesFilter = filter === "All" || p.type === filter;
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [query, filter]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search partner institutions…"
            aria-label="Search partner institutions"
            className="w-full rounded-sm border border-charcoal/15 bg-white py-2.5 pl-4 pr-4 text-sm text-charcoal placeholder:text-slate/60 focus:border-teal"
          />
        </div>
        <div
          className="flex gap-2"
          role="group"
          aria-label="Filter by institution type"
        >
          {(["All", "School", "College"] as FilterKey[]).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              aria-pressed={filter === k}
              className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition ${
                filter === k
                  ? "bg-navy text-white"
                  : "bg-white text-slate hover:bg-navy/5 border border-charcoal/10"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-slate">
        Showing {results.length} of {partnerSchools.length} partner institutions
      </p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {results.map((p) => (
          <div
            key={p.name}
            className="flex flex-col items-center justify-center gap-3 rounded-sm border border-charcoal/10 bg-white px-4 py-8 text-center transition hover:border-teal hover:shadow-md"
          >
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full bg-navy/5 font-display text-sm font-semibold text-navy"
              aria-hidden="true"
            >
              {p.name
                .split(" ")
                .slice(0, 2)
                .map((w) => w[0])
                .join("")}
            </div>
            <p className="text-sm font-medium text-charcoal">{p.name}</p>
            <span className="eyebrow text-[10px] text-blue">{p.type}</span>
          </div>
        ))}
        {results.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-slate">
            No institutions match “{query}”. Try a different search.
          </p>
        )}
      </div>
    </div>
  );
}

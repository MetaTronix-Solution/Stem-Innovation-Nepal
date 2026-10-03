"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { getLabs } from "@/services/lab.service";
import { Lab } from "@/types/lab";

type SortOption = "featured" | "price-asc" | "price-desc" | "name";

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortOption>("featured");

  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getLabs();

      setLabs(response.labs || []);
    } catch (err) {
      console.error("Failed to fetch labs:", err);
      setError("We couldn't load the labs right now. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const visibleLabs = useMemo(() => {
    const q = query.trim().toLowerCase();

    const filtered = q
      ? labs.filter(
          (lab) =>
            lab.title?.toLowerCase().includes(q) ||
            lab.description?.toLowerCase().includes(q),
        )
      : labs;

    const sorted = [...filtered];

    if (sort === "price-asc") {
      sorted.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sort === "price-desc") {
      sorted.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sort === "name") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return sorted;
  }, [labs, query, sort]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue">
            Lab Setup
          </p>

          <h1 className="text-4xl font-bold tracking-tighttext-gray-900 md:text-5xl">
            Explore Our Labs
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate">
            Complete laboratory setups for schools and colleges, built to
            support hands-on STEM learning, robotics, and innovation.
          </p>
        </div>

        {/* Toolbar */}
        {!loading && !error && labs.length > 0 && (
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" />
                </svg>
              </span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search labs"
                aria-label="Search labs"
                className="w-full rounded-full border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm text-charcoal placeholder:text-gray-400 focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue"
              />
            </div>

            <div className="flex items-center justify-between gap-4 sm:justify-end">
              <p className="text-sm text-gray-500">
                {visibleLabs.length}{" "}
                {visibleLabs.length === 1 ? "lab" : "labs"}
              </p>

              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                aria-label="Sort labs"
                className="rounded-full border border-gray-200 bg-white px-4 py-3 text-sm text-charcoal focus:border-blue focus:outline-none focus:ring-2 focus:ring-blue"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: low to high</option>
                <option value="price-desc">Price: high to low</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-56 animate-pulse bg-gray-100" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-2/3 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
                  <div className="h-10 w-full animate-pulse rounded-full bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-8 text-center"
          >
            <h2 className="text-lg font-semibold text-red-700">
              Something went wrong
            </h2>
            <p className="mt-2 text-sm text-red-600">{error}</p>
            <button
              onClick={fetchLabs}
              className="mt-5 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty: no labs */}
        {!loading && !error && labs.length === 0 && (
          <div className="mx-auto max-w-lg rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-charcoal">
              No labs available
            </h2>
            <p className="mt-2 text-slate">
              Lab setups will appear here once they are added.
            </p>
          </div>
        )}

        {/* Empty: no search matches */}
        {!loading && !error && labs.length > 0 && visibleLabs.length === 0 && (
          <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-12 text-center">
            <h2 className="text-xl font-semibold text-charcoal">
              No labs match "{query}"
            </h2>
            <button
              onClick={() => setQuery("")}
              className="mt-4 text-sm font-semibold text-blue hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Labs grid */}
        {!loading && !error && visibleLabs.length > 0 && (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {visibleLabs.map((lab) => {
              const itemCount = Array.isArray(lab.labItems)
                ? lab.labItems.length
                : 0;

              return (
                <Link
                  key={lab._id}
                  href={`/user/labs/${lab._id}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue"
                >
                  {/* Image */}
                  <div className="relative h-56 w-full overflow-hidden bg-gray-100">
                    {lab.image ? (
                      <img
                        src={lab.image}
                        alt={lab.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-400">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-5-5L5 21" />
                        </svg>
                        <span className="text-sm">No image</span>
                      </div>
                    )}

                    {itemCount > 0 && (
                      <span className="absolute bottom-3 left-3 rounded-full bg-white px-3 py-1 text-xs font-semibold text-charcoal shadow-sm">
                        {itemCount} {itemCount === 1 ? "item" : "items"} included
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="line-clamp-1 text-xl font-bold text-charcoal">
                      {lab.title}
                    </h2>

                    <p className="mt-3 line-clamp-3 flex-1 text-sm leading-6 text-slate">
                      {lab.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                      <div>
                        <p className="text-xs text-gray-500">Lab price</p>
                        <p className="text-lg font-bold text-blue">
                          Rs. {Number(lab.price).toLocaleString()}
                        </p>
                      </div>

                      <span className="inline-flex items-center gap-1.5 rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors group-hover:bg-teal">
                        View details
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                          className="transition-transform group-hover:translate-x-0.5"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLabs } from "@/services/lab.service";
import { Lab } from "@/types/lab";

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLoading(true);

        const response = await getLabs();

        setLabs(response.labs || []);
      } catch (error) {
        console.error("Failed to fetch labs:", error);
        setError("Failed to load labs.");
      } finally {
        setLoading(false);
      }
    };

    fetchLabs();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-gray-500">Loading labs...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white px-6 py-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-32">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue">
            Lab Setup
          </p>

          <h1 className="text-4xl font-bold text-charcoal md:text-5xl">
            Explore Our Labs
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-slate">
            Discover complete laboratory setups designed for schools and
            colleges to support hands-on STEM learning, robotics, and
            innovation.
          </p>
        </div>

        {/* Empty State */}
        {labs.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-12 text-center">
            <h2 className="text-xl font-semibold text-charcoal">
              No labs available
            </h2>

            <p className="mt-2 text-slate">
              Lab setups will appear here once they are added.
            </p>
          </div>
        ) : (
          /* Labs Grid */
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {labs.map((lab) => (
              <div
                key={lab._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Image */}
                <div className="h-56 w-full overflow-hidden bg-gray-100">
                  {lab.image ? (
                    <img
                      src={lab.image}
                      alt={lab.title}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      No Image
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h2 className="text-xl font-bold text-charcoal">
                    {lab.title}
                  </h2>

                  <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate">
                    {lab.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Lab Price</p>

                      <p className="text-lg font-bold text-blue">
                        Rs. {lab.price.toLocaleString()}
                      </p>
                    </div>

                    <Link
                      href={`/user/labs/${lab._id}`}
                      className="rounded-full bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
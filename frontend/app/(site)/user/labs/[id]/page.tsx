"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getLab } from "@/services/lab.service";
import { Lab } from "@/types/lab";
import { LabItem } from "@/types/lab-item";

export default function LabDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [lab, setLab] = useState<Lab | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLab = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getLab(id);

        setLab(response.lab);
      } catch (error) {
        console.error("Failed to fetch lab:", error);
        setError("Failed to load lab details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLab();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 pb-20 pt-32">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-gray-500">
            Loading lab details...
          </p>
        </div>
      </main>
    );
  }

  if (error || !lab) {
    return (
      <main className="min-h-screen bg-white px-6 pb-20 pt-32">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/user/labs"
            className="mb-8 inline-block text-sm font-medium text-blue hover:underline"
          >
            ← Back to Labs
          </Link>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h1 className="text-xl font-semibold text-red-600">
              Lab Not Found
            </h1>

            <p className="mt-2 text-red-500">
              {error || "The requested lab could not be found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const labItems = Array.isArray(lab.labItems)
    ? lab.labItems.filter(
        (item): item is LabItem => typeof item !== "string"
      )
    : [];

  return (
    <main className="min-h-screen bg-white px-6 pb-20 pt-32">
      <div className="mx-auto max-w-6xl">
        {/* Back Button */}
        <Link
          href="/user/labs"
          className="mb-8 inline-flex items-center text-sm font-medium text-blue hover:underline"
        >
          ← Back to Labs
        </Link>

        {/* Lab Information */}
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Lab Image */}
          <div className="overflow-hidden rounded-3xl bg-gray-100">
            {lab.image ? (
              <img
                src={lab.image}
                alt={lab.title}
                className="h-[400px] w-full object-cover md:h-[500px]"
              />
            ) : (
              <div className="flex h-[400px] items-center justify-center text-gray-400 md:h-[500px]">
                No Image Available
              </div>
            )}
          </div>

          {/* Lab Content */}
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue">
              Lab Setup
            </p>

            <h1 className="text-4xl font-bold text-charcoal md:text-5xl">
              {lab.title}
            </h1>

            <p className="mt-6 text-base leading-7 text-slate">
              {lab.description}
            </p>

            {/* Price */}
            <div className="mt-8">
              <p className="text-sm text-gray-500">Lab Price</p>

              <p className="mt-1 text-3xl font-bold text-blue">
                Rs. {lab.price.toLocaleString()}
              </p>
            </div>

            {/* Add to Cart - later */}
            <button
              type="button"
              className="mt-8 w-full rounded-full bg-orange px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal sm:w-fit"
            >
              Add to Cart
            </button>
          </div>
        </div>

        {/* Included Lab Items */}
        <section className="mt-20">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue">
              What's Included
            </p>

            <h2 className="mt-2 text-3xl font-bold text-charcoal">
              Lab Items
            </h2>

            <p className="mt-3 text-slate">
              This lab setup includes the following items.
            </p>
          </div>

          {labItems.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-10 text-center">
              <p className="text-slate">
                No lab items are available for this setup.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {labItems.map((item) => (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  {/* Item Image */}
                  <div className="h-48 overflow-hidden bg-gray-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Item Information */}
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-charcoal">
                      {item.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate">
                      {item.description}
                    </p>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-lg font-bold text-blue">
                        Rs. {item.price.toLocaleString()}
                      </span>

                      <span className="text-xs text-gray-500">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
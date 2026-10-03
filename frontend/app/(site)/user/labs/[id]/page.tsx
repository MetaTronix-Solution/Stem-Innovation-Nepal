"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getLab } from "@/services/lab.service";
import { Lab } from "@/types/lab";
import { LabItem } from "@/types/lab-item";

const LOW_STOCK_THRESHOLD = 5;

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
      } catch (err) {
        console.error("Failed to fetch lab:", err);
        setError("Failed to load lab details.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchLab();
    }
  }, [id]);

  const labItems = useMemo(
    () =>
      lab && Array.isArray(lab.labItems)
        ? lab.labItems.filter(
            (item): item is LabItem => typeof item !== "string",
          )
        : [],
    [lab],
  );

  // Combined price of the items if bought one each, used to show savings
  const itemsTotal = useMemo(
    () => labItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [labItems],
  );

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <main className="min-h-screen bg-white px-6 pb-24 pt-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 h-5 w-32 animate-pulse rounded bg-gray-100" />
          <div className="grid gap-10 lg:grid-cols-2">
            <div className="h-[400px] animate-pulse rounded-3xl bg-gray-100 md:h-[500px]" />
            <div className="space-y-4 py-4">
              <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
              <div className="h-12 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
              <div className="mt-8 h-32 animate-pulse rounded-2xl bg-gray-100" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  /* ---------- Error / not found ---------- */
  if (error || !lab) {
    return (
      <main className="min-h-screen bg-white px-6 pb-24 pt-32">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/user/labs"
            className="mb-8 inline-flex items-center gap-1 text-sm font-medium text-blue hover:underline"
          >
            <BackIcon />
            Back to labs
          </Link>

          <div
            role="alert"
            className="mx-auto max-w-lg rounded-2xl border border-red-200 bg-red-50 p-10 text-center"
          >
            <h1 className="text-xl font-semibold text-red-700">
              Lab not found
            </h1>
            <p className="mt-2 text-sm text-red-600">
              {error || "The requested lab could not be found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const saving = itemsTotal - Number(lab.price || 0);

  return (
    <main className="min-h-screen bg-white px-6 pb-24 pt-32">
      <div className="mx-auto max-w-6xl">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mb-8 flex items-center gap-2 text-sm"
        >
          <Link
            href="/user/labs"
            className="inline-flex items-center gap-1 font-medium text-blue hover:underline"
          >
            <BackIcon />
            Labs
          </Link>
          <span className="text-gray-300">/</span>
          <span className="line-clamp-1 text-gray-500">{lab.title}</span>
        </nav>

        {/* Lab information */}
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Image */}
          <div className="overflow-hidden rounded-3xl bg-gray-100 shadow-sm">
            {lab.image ? (
              <img
                src={lab.image}
                alt={lab.title}
                className="h-[400px] w-full object-cover md:h-[500px]"
              />
            ) : (
              <div className="flex h-[400px] flex-col items-center justify-center gap-2 text-gray-400 md:h-[500px]">
                <svg
                  width="40"
                  height="40"
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
                <span>No image available</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue">
              Lab Setup
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-charcoal md:text-5xl">
              {lab.title}
            </h1>

            <p className="mt-6 whitespace-pre-line text-base leading-7 text-slate">
              {lab.description}
            </p>

            {/* Purchase card */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500">Lab price</p>
                  <p className="mt-1 text-3xl font-bold text-blue">
                    Rs. {Number(lab.price).toLocaleString()}
                  </p>
                </div>

                {labItems.length > 0 && (
                  <p className="text-sm text-gray-500">
                    Includes{" "}
                    <span className="font-semibold text-charcoal">
                      {labItems.length}{" "}
                      {labItems.length === 1 ? "item" : "items"}
                    </span>
                  </p>
                )}
              </div>

              {saving > 0 && (
                <p className="mt-4 rounded-lg bg-white px-4 py-3 text-sm text-green-700">
                  Save Rs. {saving.toLocaleString()} compared to buying the
                  items separately (Rs. {itemsTotal.toLocaleString()}).
                </p>
              )}

              {/* Add to Cart - later */}
              <button
                type="button"
                className="mt-6 w-full rounded-full bg-orange px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Included lab items */}
        <section className="mt-24">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue">
              What's Included
            </p>

            <h2 className="mt-2 text-3xl font-bold tracking-tight text-charcoal">
              Lab Items
            </h2>

            <p className="mt-3 text-slate">
              This lab setup includes the following items.
            </p>
          </div>

          {labItems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-12 text-center">
              <p className="text-slate">
                No lab items are available for this setup.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {labItems.map((item) => {
                const quantity = Number(item.quantity ?? 0);

                return (
                  <article
                    key={item._id}
                    className="flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-lg"
                  >
                    {/* Item image */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                          No image
                        </div>
                      )}

                      {quantity === 0 && (
                        <span className="absolute left-3 top-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">
                          Out of stock
                        </span>
                      )}
                    </div>

                    {/* Item information */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-lg font-bold text-charcoal">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate">
                        {item.description}
                      </p>

                      {item.specification?.trim() && (
                        <details className="group mt-4 rounded-lg border border-gray-200 bg-gray-50">
                          <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-2.5 text-sm font-medium text-charcoal">
                            Specifications
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
                              className="transition-transform group-open:rotate-180"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </summary>
                          <p className="whitespace-pre-line border-t border-gray-200 px-4 py-3 text-sm leading-6 text-slate">
                            {item.specification}
                          </p>
                        </details>
                      )}

                      <div className="mt-auto flex items-center justify-between pt-5">
                        <span className="text-lg font-bold text-blue">
                          Rs. {Number(item.price).toLocaleString()}
                        </span>

                        {quantity > 0 && (
                          <span
                            className={`text-xs font-medium ${
                              quantity <= LOW_STOCK_THRESHOLD
                                ? "text-amber-600"
                                : "text-gray-500"
                            }`}
                          >
                            {quantity <= LOW_STOCK_THRESHOLD
                              ? `Only ${quantity} left`
                              : `${quantity} in stock`}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function BackIcon() {
  return (
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
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
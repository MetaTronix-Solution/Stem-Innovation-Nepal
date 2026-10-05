"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { getLab } from "@/services/lab.service";
import { Lab } from "@/types/lab";
import { LabItem } from "@/types/lab-item";

const LOW_STOCK_THRESHOLD = 5;
const ADMIN_WHATSAPP_NUMBER = "9779812020752";

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

    if (id) fetchLab();
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

  // Combined price if each item were bought separately
  const itemsTotal = useMemo(
    () => labItems.reduce((sum, item) => sum + Number(item.price || 0), 0),
    [labItems],
  );

  const hasOutOfStock = useMemo(
    () => labItems.some((item) => Number(item.quantity ?? 0) === 0),
    [labItems],
  );

  const handleWhatsAppOrder = () => {
    if (!lab) return;

    const orderReference = `STEM-${Date.now().toString().slice(-6)}`;

    const includedItems =
      labItems.length > 0
        ? labItems
            .map(
              (item, index) =>
                `${index + 1}. ${item.title}\n   Price: Rs. ${Number(
                  item.price || 0,
                ).toLocaleString()}`,
            )
            .join("\n")
        : "No individual items listed";

    const message = `Hello Stem Innovation Nepal,

I am interested in ordering a lab setup.

Order Reference: ${orderReference}

LAB DETAILS
--------------------
Lab: ${lab.title}
Price: Rs. ${Number(lab.price || 0).toLocaleString()}

INCLUDED ITEMS
--------------------
${includedItems}

Please provide me with the availability, delivery details, and next steps for placing the order.

Thank you.
Stem Innovation Nepal`;

    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message,
    )}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

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
              <div className="mt-8 h-56 animate-pulse rounded-2xl bg-gray-100" />
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

  const labPrice = Number(lab.price || 0);
  const saving = itemsTotal - labPrice;
  const savingPercent =
    itemsTotal > 0 && saving > 0 ? Math.round((saving / itemsTotal) * 100) : 0;

  return (
    <main className="min-h-screen bg-white px-6 pb-32 pt-32 lg:pb-24">
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
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          {/* Image */}
          <div className="relative overflow-hidden rounded-3xl bg-gray-100 shadow-sm">
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

            {savingPercent > 0 && (
              <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-green-700 shadow-sm">
                Bundle saves {savingPercent}%
              </span>
            )}
          </div>

          {/* Content */}
          <div className="flex flex-col">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue">
              Lab Setup
            </p>

            <h1 className="text-4xl font-bold tracking-tight text-charcoal md:text-5xl">
              {lab.title}
            </h1>

            <p className="mt-6 whitespace-pre-line text-base leading-7 text-slate">
              {lab.description}
            </p>

            {/* Order card */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
              {/* Price */}
              <div className="p-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Lab price</p>
                    <div className="mt-1 flex flex-wrap items-baseline gap-x-3">
                      <p className="text-3xl font-bold text-blue">
                        Rs. {labPrice.toLocaleString()}
                      </p>
                      {saving > 0 && (
                        <p className="text-base text-gray-400 line-through">
                          Rs. {itemsTotal.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {labItems.length > 0 && (
                    <p className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-slate">
                      {labItems.length}{" "}
                      {labItems.length === 1 ? "item" : "items"} included
                    </p>
                  )}
                </div>

                {saving > 0 && (
                  <p className="mt-4 flex items-start gap-2 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
                    <CheckIcon className="mt-0.5 shrink-0" />
                    <span>
                      You save{" "}
                      <span className="font-semibold">
                        Rs. {saving.toLocaleString()}
                      </span>{" "}
                      compared to buying the items separately.
                    </span>
                  </p>
                )}

                {hasOutOfStock && (
                  <p
                    role="status"
                    className="mt-3 flex items-start gap-2 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800"
                  >
                    <InfoIcon className="mt-0.5 shrink-0" />
                    <span>
                      Some items are out of stock. We'll confirm availability
                      with you on WhatsApp.
                    </span>
                  </p>
                )}

                {/* Primary action */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="mt-6 flex w-full items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-[#1ebe5a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
                >
                  <WhatsAppIcon />
                  Order on WhatsApp
                </button>

                <p className="mt-3 text-center text-xs text-gray-500">
                  Opens WhatsApp with your order details already filled in.
                  No payment is needed right now.
                </p>
              </div>

              {/* How it works */}
              <div className="border-t border-gray-200 bg-gray-50 px-6 py-5">
                <p className="text-sm font-semibold text-charcoal">
                  How ordering works
                </p>
                <ol className="mt-3 space-y-3 text-sm text-slate">
                  <li className="flex gap-3">
                    <StepDot>1</StepDot>
                    <span>Send your order request on WhatsApp.</span>
                  </li>
                  <li className="flex gap-3">
                    <StepDot>2</StepDot>
                    <span>
                      Our team confirms availability, delivery and total cost.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <StepDot>3</StepDot>
                    <span>Pay and receive your lab setup.</span>
                  </li>
                </ol>
              </div>
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

      {/* Mobile sticky order bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white/95 px-4 py-3 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs text-gray-500">Lab price</p>
            <p className="truncate text-lg font-bold text-blue">
              Rs. {labPrice.toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            onClick={handleWhatsAppOrder}
            className="flex shrink-0 items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1ebe5a] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2"
          >
            <WhatsAppIcon size={18} />
            Order on WhatsApp
          </button>
        </div>
      </div>
    </main>
  );
}

/* ---------- Small helpers ---------- */

function StepDot({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue/10 text-xs font-semibold text-blue">
      {children}
    </span>
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

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

function InfoIcon({ className = "" }: { className?: string }) {
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
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.82c0 4.54-3.7 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.42h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

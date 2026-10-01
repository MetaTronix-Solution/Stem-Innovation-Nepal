"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { deleteLab, getLabs } from "@/services/lab.service";
import { Lab } from "@/types/lab";

export default function Labs() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Delete modal state
  const [labToDelete, setLabToDelete] = useState<Lab | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadLabs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLabs();
      setLabs(data.labs || []);
    } catch (err) {
      console.error("Failed to load labs:", err);
      setError("We couldn't load your labs. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLabs();
  }, []);

  const filteredLabs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return labs;
    return labs.filter(
      (lab) =>
        lab.title?.toLowerCase().includes(q) ||
        lab.description?.toLowerCase().includes(q),
    );
  }, [labs, query]);

  const confirmDelete = async () => {
    if (!labToDelete) return;

    try {
      setDeleting(true);
      await deleteLab(labToDelete._id);
      setLabs((previous) =>
        previous.filter((lab) => lab._id !== labToDelete._id),
      );
      setLabToDelete(null);
    } catch (err) {
      console.error("Delete lab failed:", err);
      setError("Couldn't delete the lab. Try again.");
      setLabToDelete(null);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Labs
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading your lab setups"
              : `${labs.length} ${labs.length === 1 ? "lab" : "labs"} available`}
          </p>
        </div>

        <Link
          href="/admin/labs/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <PlusIcon />
          Add lab
        </Link>
      </div>

      {/* Search */}
      {!loading && labs.length > 0 && (
        <div className="relative mb-6 max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search labs by title or description"
            className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      )}

      {/* Error banner */}
      {error && !loading && (
        <div
          role="alert"
          className="mb-6 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          <span>{error}</span>
          <button
            onClick={loadLabs}
            className="shrink-0 font-medium underline underline-offset-2 hover:text-red-900"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            >
              <div className="h-48 animate-pulse bg-slate-100" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-slate-100" />
                <div className="h-9 w-full animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty: no labs at all */}
      {!loading && !error && labs.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <FlaskIcon />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            No labs yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Add your first lab setup with its price and the items it includes.
          </p>
          <Link
            href="/admin/labs/create"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <PlusIcon />
            Add lab
          </Link>
        </div>
      )}

      {/* Empty: search has no matches */}
      {!loading && labs.length > 0 && filteredLabs.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
          <p className="font-medium text-slate-900">
            No labs match "{query}"
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Lab grid */}
      {!loading && filteredLabs.length > 0 && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredLabs.map((lab) => {
            const itemCount = Array.isArray(lab.labItems)
              ? lab.labItems.length
              : 0;

            return (
              <article
                key={lab._id}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  {lab.image ? (
                    <img
                      src={lab.image}
                      alt={lab.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-400">
                      <ImageIcon />
                      <span className="text-sm">No image</span>
                    </div>
                  )}

                  <span className="absolute right-3 top-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-slate-900 shadow-sm backdrop-blur">
                    Rs. {Number(lab.price).toLocaleString()}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="line-clamp-1 text-lg font-semibold text-slate-900">
                    {lab.title}
                  </h2>

                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
                    {lab.description}
                  </p>

                  <div className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    <FlaskIcon size={14} />
                    {itemCount} {itemCount === 1 ? "item" : "items"}
                  </div>

                  {/* Actions */}
                  <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                    <Link
                      href={`/admin/labs/edit/${lab._id}`}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-center text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => setLabToDelete(lab)}
                      className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Delete confirmation modal */}
      {labToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => !deleting && setLabToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="delete-title"
              className="text-lg font-semibold text-slate-900"
            >
              Delete this lab?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">
                {labToDelete.title}
              </span>{" "}
              will be permanently removed. This can't be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setLabToDelete(null)}
                disabled={deleting}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete lab"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small inline icons (no extra dependency) ---------- */

function PlusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function FlaskIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2h12.4a1.5 1.5 0 0 0 1.3-2L14 9V3" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}
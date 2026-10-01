"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { deleteLabItem, getLabItems } from "@/services/lab-item.service";
import { LabItem } from "@/types/lab-item";

export default function LabItemsPage() {
  const [items, setItems] = useState<LabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Delete modal state
  const [itemToDelete, setItemToDelete] = useState<LabItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLabItems();
      setItems(data.labItems || []);
    } catch (err) {
      console.error("Failed to load lab items:", err);
      setError("We couldn't load your lab items. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.title?.toLowerCase().includes(q));
  }, [items, query]);

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeleting(true);
      await deleteLabItem(itemToDelete._id);
      setItems((previous) =>
        previous.filter((item) => item._id !== itemToDelete._id),
      );
      setItemToDelete(null);
    } catch (err) {
      console.error("Delete lab item failed:", err);
      setError("Couldn't delete the lab item. Try again.");
      setItemToDelete(null);
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
            Lab items
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading your lab items"
              : `${items.length} ${items.length === 1 ? "item" : "items"} in stock records`}
          </p>
        </div>

        <Link
          href="/admin/lab-items/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <PlusIcon />
          Add lab item
        </Link>
      </div>

      {/* Search */}
      {!loading && items.length > 0 && (
        <div className="relative mb-6 max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lab items by title"
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
            onClick={loadItems}
            className="shrink-0 font-medium underline underline-offset-2 hover:text-red-900"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-4 border-b border-slate-100 p-4 last:border-b-0"
            >
              <div className="h-14 w-14 animate-pulse rounded-lg bg-slate-100" />
              <div className="h-4 w-1/3 animate-pulse rounded bg-slate-100" />
              <div className="ml-auto h-4 w-20 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty: no items at all */}
      {!loading && !error && items.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <BoxIcon />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            No lab items yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Add the equipment and materials you want to include in your labs.
          </p>
          <Link
            href="/admin/lab-items/create"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <PlusIcon />
            Add lab item
          </Link>
        </div>
      )}

      {/* Empty: search has no matches */}
      {!loading && items.length > 0 && filteredItems.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
          <p className="font-medium text-slate-900">
            No lab items match "{query}"
          </p>
          <button
            onClick={() => setQuery("")}
            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-700"
          >
            Clear search
          </button>
        </div>
      )}

      {/* Table */}
      {!loading && filteredItems.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-medium">Item</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Quantity</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredItems.map((item) => {
                  const quantity = Number(item.quantity ?? 0);

                  return (
                    <tr
                      key={item._id}
                      className="transition-colors hover:bg-slate-50/70"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-4">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-14 w-14 shrink-0 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                              <ImageIcon />
                            </div>
                          )}
                          <span className="font-medium text-slate-900">
                            {item.title}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-3 text-slate-700">
                        Rs. {Number(item.price).toLocaleString()}
                      </td>

                      <td className="px-5 py-3">
                        {quantity === 0 ? (
                          <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700">
                            Out of stock
                          </span>
                        ) : (
                          <span className="text-slate-700">{quantity}</span>
                        )}
                      </td>

                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/lab-items/edit/${item._id}`}
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                          >
                            Edit
                          </Link>

                          <button
                            onClick={() => setItemToDelete(item)}
                            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {itemToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => !deleting && setItemToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="delete-title"
              className="text-lg font-semibold text-slate-900"
            >
              Delete this lab item?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">
                {itemToDelete.title}
              </span>{" "}
              will be permanently removed. This can't be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setItemToDelete(null)}
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
                {deleting ? "Deleting..." : "Delete lab item"}
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

function BoxIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
      <path d="m3 8 9 5 9-5M12 13v8" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </svg>
  );
}
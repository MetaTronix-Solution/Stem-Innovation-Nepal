"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import {
  deleteLabCategory,
  getLabCategories,
} from "@/services/lab-category.service";
import { LabCategory } from "@/types/lab-category";

export default function LabCategoryPage() {
  const [categories, setCategories] = useState<LabCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  // Delete modal state
  const [categoryToDelete, setCategoryToDelete] = useState<LabCategory | null>(
    null,
  );
  const [deleting, setDeleting] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getLabCategories();
      setCategories(data.categories || []);
    } catch (err) {
      console.error("Failed to load categories:", err);
      setError("We couldn't load your categories. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter(
      (category) =>
        category.name?.toLowerCase().includes(q) ||
        category.description?.toLowerCase().includes(q),
    );
  }, [categories, query]);

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleting(true);
      await deleteLabCategory(categoryToDelete._id);
      setCategories((previous) =>
        previous.filter((category) => category._id !== categoryToDelete._id),
      );
      setCategoryToDelete(null);
    } catch (err) {
      console.error("Failed to delete category:", err);
      setError("Couldn't delete the category. Try again.");
      setCategoryToDelete(null);
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
            Lab categories
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {loading
              ? "Loading your categories"
              : `${categories.length} ${categories.length === 1 ? "category" : "categories"}`}
          </p>
        </div>

        <Link
          href="/admin/lab-category/create"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
        >
          <PlusIcon />
          Add category
        </Link>
      </div>

      {/* Search */}
      {!loading && categories.length > 0 && (
        <div className="relative mb-6 max-w-md">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <SearchIcon />
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories by name or description"
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
            onClick={loadCategories}
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
              <div className="h-4 w-1/4 animate-pulse rounded bg-slate-100" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
            </div>
          ))}
        </div>
      )}

      {/* Empty: no categories at all */}
      {!loading && !error && categories.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <TagIcon />
          </div>
          <h2 className="text-lg font-semibold text-slate-900">
            No categories yet
          </h2>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Create categories to group your lab items, like Electronics or
            Sensors.
          </p>
          <Link
            href="/admin/lab-category/create"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <PlusIcon />
            Add category
          </Link>
        </div>
      )}

      {/* Empty: search has no matches */}
      {!loading && categories.length > 0 && filteredCategories.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
          <p className="font-medium text-slate-900">
            No categories match "{query}"
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
      {!loading && filteredCategories.length > 0 && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Description</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCategories.map((category) => (
                  <tr
                    key={category._id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {category.name}
                    </td>

                    <td className="max-w-md px-5 py-4 text-slate-600">
                      {category.description ? (
                        <span className="line-clamp-2">
                          {category.description}
                        </span>
                      ) : (
                        <span className="text-slate-400">No description</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/lab-category/edit/${category._id}`}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => setCategoryToDelete(category)}
                          className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete confirmation modal */}
      {categoryToDelete && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4"
          onClick={() => !deleting && setCategoryToDelete(null)}
        >
          <div
            className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="delete-title"
              className="text-lg font-semibold text-slate-900"
            >
              Delete this category?
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              <span className="font-medium text-slate-700">
                {categoryToDelete.name}
              </span>{" "}
              will be permanently removed. This can't be undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setCategoryToDelete(null)}
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
                {deleting ? "Deleting..." : "Delete category"}
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

function TagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.5" />
    </svg>
  );
}
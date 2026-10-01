"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  getLabCategory,
  updateLabCategory,
} from "@/services/lab-category.service";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export default function EditLabCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; form?: string }>({});

  useEffect(() => {
    const loadCategory = async () => {
      try {
        const data = await getLabCategory(id);
        setName(data.category.name);
        setDescription(data.category.description || "");
      } catch (error) {
        console.error("Failed to load category:", error);
        setLoadError("We couldn't load this category. Go back and try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadCategory();
    }
  }, [id]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!name.trim()) {
      setErrors({ name: "Enter a category name." });
      return;
    }
    setErrors({});

    try {
      setSaving(true);
      await updateLabCategory(id, { name, description });
      router.push("/admin/lab-category");
    } catch (error) {
      console.error("Update category failed:", error);
      setErrors({ form: "Couldn't save your changes. Try again." });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="mx-auto max-w-2xl p-6 lg:p-8">
        <div className="mb-8 h-8 w-56 animate-pulse rounded bg-slate-100" />
        <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6">
          <div className="h-10 animate-pulse rounded bg-slate-100" />
          <div className="h-28 animate-pulse rounded bg-slate-100" />
        </div>
      </div>
    );
  }

  /* ---------- Load error ---------- */
  if (loadError) {
    return (
      <div className="mx-auto max-w-2xl p-6 lg:p-8">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <p>{loadError}</p>
          <Link
            href="/admin/lab-category"
            className="mt-3 inline-block font-medium underline underline-offset-2"
          >
            Back to lab categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/lab-category"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Lab categories
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Edit lab category
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the name and description of this category.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className={labelClass}>
                Category name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                aria-invalid={!!errors.name}
                className={`${inputClass} ${
                  errors.name ? "!border-red-400 focus:!ring-red-500/20" : ""
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* Form-level error */}
        {errors.form && (
          <div
            role="alert"
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {errors.form}
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/lab-category")}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getLab, updateLab } from "@/services/lab.service";
import { getLabItems } from "@/services/lab-item.service";
import { LabItem } from "@/types/lab-item";

export default function EditLabPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [items, setItems] = useState<LabItem[]>([]);
  const [itemQuery, setItemQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    items?: string;
    form?: string;
  }>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const [labResponse, itemsResponse] = await Promise.all([
          getLab(id),
          getLabItems(),
        ]);

        const lab = labResponse.lab;

        setTitle(lab.title);
        setDescription(lab.description);
        setPrice(String(lab.price));
        setCurrentImage(lab.image || "");

        const ids = Array.isArray(lab.labItems)
          ? lab.labItems.map((item) =>
              typeof item === "string" ? item : item._id,
            )
          : [];

        setSelectedItems(ids);
        setItems(itemsResponse.labItems || []);
      } catch (error) {
        console.error("Failed to load lab:", error);
        setLoadError("We couldn't load this lab. Go back and try again.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id]);

  // Create / clean up a preview URL for the newly chosen image
  useEffect(() => {
    if (!image) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImage(file);
  };

  const handleItemChange = (itemId: string) => {
    setErrors((prev) => ({ ...prev, items: undefined }));
    setSelectedItems((previous) =>
      previous.includes(itemId)
        ? previous.filter((existing) => existing !== itemId)
        : [...previous, itemId],
    );
  };

  const filteredItems = useMemo(() => {
    const q = itemQuery.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) => item.title?.toLowerCase().includes(q));
  }, [items, itemQuery]);

  const itemsTotal = useMemo(
    () =>
      items
        .filter((item) => selectedItems.includes(item._id))
        .reduce((sum, item) => sum + Number(item.price || 0), 0),
    [items, selectedItems],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: typeof errors = {};
    if (!title.trim()) nextErrors.title = "Enter a lab title.";
    if (selectedItems.length === 0)
      nextErrors.items = "Select at least one lab item.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);

      selectedItems.forEach((itemId) => {
        formData.append("labItems", itemId);
      });

      if (image) {
        formData.append("image", image);
      }

      await updateLab(id, formData);
      router.push("/admin/labs");
    } catch (error) {
      console.error("Update lab failed:", error);
      setErrors({ form: "Couldn't save your changes. Try again." });
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl p-6 lg:p-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-slate-100" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-6 lg:col-span-2">
            <div className="h-10 animate-pulse rounded bg-slate-100" />
            <div className="h-28 animate-pulse rounded bg-slate-100" />
            <div className="h-10 animate-pulse rounded bg-slate-100" />
          </div>
          <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </div>
    );
  }

  /* ---------- Load error ---------- */
  if (loadError) {
    return (
      <div className="mx-auto max-w-5xl p-6 lg:p-8">
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-800"
        >
          <p>{loadError}</p>
          <Link
            href="/admin/labs"
            className="mt-3 inline-block font-medium underline underline-offset-2"
          >
            Back to labs
          </Link>
        </div>
      </div>
    );
  }

  const previewSrc = imagePreview || currentImage;

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/labs"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Labs
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Edit lab
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Update the details, items, and image for this lab.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column: details + items */}
          <div className="space-y-6 lg:col-span-2">
            {/* Details */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Details
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Lab title
                  </label>
                  <input
                    id="title"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }}
                    aria-invalid={!!errors.title}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 ${
                      errors.title
                        ? "border-red-400 focus:ring-red-500/20"
                        : "border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20"
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    rows={4}
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                  >
                    Price
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-slate-500">
                      Rs.
                    </span>
                    <input
                      id="price"
                      type="number"
                      min="0"
                      value={price}
                      onChange={(event) => setPrice(event.target.value)}
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-11 pr-3.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Lab items */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Lab items
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedItems.length} selected
                    {selectedItems.length > 0 &&
                      ` · Rs. ${itemsTotal.toLocaleString()} combined`}
                  </p>
                </div>

                {items.length > 6 && (
                  <input
                    type="search"
                    value={itemQuery}
                    onChange={(e) => setItemQuery(e.target.value)}
                    placeholder="Search items"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 sm:w-52"
                  />
                )}
              </div>

              {errors.items && (
                <p className="mt-3 text-sm text-red-600">{errors.items}</p>
              )}

              {items.length === 0 ? (
                <p className="mt-4 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No lab items exist yet. Create some first, then add them here.
                </p>
              ) : filteredItems.length === 0 ? (
                <p className="mt-4 rounded-lg bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
                  No items match "{itemQuery}".
                </p>
              ) : (
                <div className="mt-4 grid max-h-96 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {filteredItems.map((item) => {
                    const checked = selectedItems.includes(item._id);

                    return (
                      <label
                        key={item._id}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3.5 py-3 transition-colors ${
                          checked
                            ? "border-indigo-500 bg-indigo-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => handleItemChange(item._id)}
                          className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                          {item.title}
                        </span>
                        <span className="shrink-0 text-sm text-slate-500">
                          Rs. {Number(item.price).toLocaleString()}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </section>
          </div>

          {/* Right column: image */}
          <aside className="lg:col-span-1">
            <section className="rounded-xl border border-slate-200 bg-white p-6 lg:sticky lg:top-6">
              <h2 className="text-base font-semibold text-slate-900">
                Image
              </h2>

              <div className="mt-4 overflow-hidden rounded-lg bg-slate-100">
                {previewSrc ? (
                  <img
                    src={previewSrc}
                    alt={title || "Lab image"}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full items-center justify-center text-sm text-slate-400">
                    No image
                  </div>
                )}
              </div>

              {imagePreview && (
                <p className="mt-2 text-xs text-slate-500">
                  New image selected. It replaces the current one when you save.
                </p>
              )}

              <label
                htmlFor="image"
                className="mt-4 flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500"
              >
                {previewSrc ? "Change image" : "Upload image"}
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>

              {image && (
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="mt-2 w-full text-center text-sm text-slate-500 hover:text-slate-900"
                >
                  Discard new image
                </button>
              )}
            </section>
          </aside>
        </div>

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
            onClick={() => router.push("/admin/labs")}
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
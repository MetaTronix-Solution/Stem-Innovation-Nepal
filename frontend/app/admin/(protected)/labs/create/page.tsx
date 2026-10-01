"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { createLab } from "@/services/lab.service";
import { getLabItems } from "@/services/lab-item.service";
import { LabItem } from "@/types/lab-item";

export default function CreateLabPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [items, setItems] = useState<LabItem[]>([]);
  const [itemQuery, setItemQuery] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    title?: string;
    items?: string;
    form?: string;
  }>({});

  const loadItems = async () => {
    try {
      setLoadingItems(true);
      setItemsError(null);
      const data = await getLabItems();
      setItems(data.labItems || []);
    } catch (error) {
      console.error("Failed to load lab items:", error);
      setItemsError("We couldn't load lab items.");
    } finally {
      setLoadingItems(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  // Create / clean up a preview URL for the chosen image
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

  const handleItemChange = (id: string) => {
    setErrors((prev) => ({ ...prev, items: undefined }));
    setSelectedItems((previous) =>
      previous.includes(id)
        ? previous.filter((itemId) => itemId !== id)
        : [...previous, id],
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
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);

      // Send lab item IDs. The backend should convert them into an array.
      selectedItems.forEach((itemId) => {
        formData.append("labItems", itemId);
      });

      if (image) {
        formData.append("image", image);
      }

      await createLab(formData);
      router.push("/admin/labs");
    } catch (error) {
      console.error("Create lab failed:", error);
      setErrors({ form: "Couldn't create the lab. Try again." });
    } finally {
      setLoading(false);
    }
  };

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
          Create lab
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Set up a new lab with its price, image, and the items it includes.
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
                    placeholder="Robotics Starter Lab"
                    aria-invalid={!!errors.title}
                    className={`w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
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
                    placeholder="What students or visitors can do in this lab"
                    className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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
                      placeholder="0"
                      className="w-full rounded-lg border border-slate-200 py-2.5 pl-11 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
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

              {loadingItems ? (
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-12 animate-pulse rounded-lg bg-slate-100"
                    />
                  ))}
                </div>
              ) : itemsError ? (
                <div
                  role="alert"
                  className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
                >
                  <span>{itemsError}</span>
                  <button
                    type="button"
                    onClick={loadItems}
                    className="shrink-0 font-medium underline underline-offset-2"
                  >
                    Try again
                  </button>
                </div>
              ) : items.length === 0 ? (
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
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt={title || "Lab image preview"}
                    className="aspect-square w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-square w-full flex-col items-center justify-center gap-2 text-slate-400">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <circle cx="9" cy="9" r="2" />
                      <path d="m21 15-5-5L5 21" />
                    </svg>
                    <span className="text-sm">No image yet</span>
                  </div>
                )}
              </div>

              <label
                htmlFor="image"
                className="mt-4 flex cursor-pointer items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500"
              >
                {image ? "Change image" : "Upload image"}
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
                  Remove image
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
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create lab"}
          </button>
        </div>
      </form>
    </div>
  );
}
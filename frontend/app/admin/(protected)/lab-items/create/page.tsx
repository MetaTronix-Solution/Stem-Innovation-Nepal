"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createLabItem } from "@/services/lab-item.service";
import { getLabCategories } from "@/services/lab-category.service";
import { LabCategory } from "@/types/lab-category";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20";

const labelClass = "mb-1.5 block text-sm font-medium text-slate-700";

export default function CreateLabItemPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [specification, setSpecification] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [categories, setCategories] = useState<LabCategory[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    title?: string;
    category?: string;
    form?: string;
  }>({});

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoriesError(null);
      const data = await getLabCategories();
      setCategories(data.categories || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategoriesError("We couldn't load categories.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
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

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const nextErrors: typeof errors = {};
    if (!title.trim()) nextErrors.title = "Enter a title.";
    if (!category) nextErrors.category = "Select a category.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("specification", specification);
      formData.append("price", price);
      formData.append("quantity", quantity);
      formData.append("category", category);

      if (image) {
        formData.append("image", image);
      }

      await createLabItem(formData);
      router.push("/admin/lab-items");
    } catch (error) {
      console.error("Create lab item failed:", error);
      setErrors({ form: "Couldn't create the lab item. Try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/lab-items"
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Lab items
        </Link>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Create lab item
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Add a piece of equipment or material you can include in labs.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left column */}
          <div className="space-y-6 lg:col-span-2">
            {/* Details */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Details
              </h2>

              <div className="mt-5 space-y-5">
                <div>
                  <label htmlFor="title" className={labelClass}>
                    Title
                  </label>
                  <input
                    id="title"
                    value={title}
                    onChange={(event) => {
                      setTitle(event.target.value);
                      setErrors((prev) => ({ ...prev, title: undefined }));
                    }}
                    placeholder="Arduino UNO R3"
                    aria-invalid={!!errors.title}
                    className={`${inputClass} ${
                      errors.title
                        ? "!border-red-400 focus:!ring-red-500/20"
                        : ""
                    }`}
                  />
                  {errors.title && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.title}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className={labelClass}>
                    Category
                  </label>

                  {loadingCategories ? (
                    <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
                  ) : categoriesError ? (
                    <div
                      role="alert"
                      className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-800"
                    >
                      <span>{categoriesError}</span>
                      <button
                        type="button"
                        onClick={loadCategories}
                        className="shrink-0 font-medium underline underline-offset-2"
                      >
                        Try again
                      </button>
                    </div>
                  ) : (
                    <select
                      id="category"
                      value={category}
                      onChange={(event) => {
                        setCategory(event.target.value);
                        setErrors((prev) => ({ ...prev, category: undefined }));
                      }}
                      aria-invalid={!!errors.category}
                      className={`${inputClass} bg-white ${
                        errors.category
                          ? "!border-red-400 focus:!ring-red-500/20"
                          : ""
                      }`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.name}
                        </option>
                      ))}
                    </select>
                  )}

                  {errors.category && (
                    <p className="mt-1.5 text-sm text-red-600">
                      {errors.category}
                    </p>
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
                    placeholder="What this item is and what it's used for"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="specification" className={labelClass}>
                    Specification
                  </label>
                  <textarea
                    id="specification"
                    value={specification}
                    onChange={(event) => setSpecification(event.target.value)}
                    rows={4}
                    placeholder="Technical details such as dimensions, voltage, or model"
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* Pricing and stock */}
            <section className="rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="text-base font-semibold text-slate-900">
                Pricing and stock
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="price" className={labelClass}>
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
                      className={`${inputClass} !pl-11`}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="quantity" className={labelClass}>
                    Quantity
                  </label>
                  <input
                    id="quantity"
                    type="number"
                    min="0"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              </div>
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
                    alt={title || "Lab item image preview"}
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
            onClick={() => router.push("/admin/lab-items")}
            className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create lab item"}
          </button>
        </div>
      </form>
    </div>
  );
}
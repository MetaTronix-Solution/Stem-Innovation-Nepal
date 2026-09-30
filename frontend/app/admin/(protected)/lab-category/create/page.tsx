"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import {
  createLabCategory,
} from "@/services/lab-category.service";

export default function CreateLabCategoryPage() {

  const router = useRouter();

  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  const handleSubmit = async (
    event: FormEvent,
  ) => {

    event.preventDefault();

    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    try {

      setLoading(true);

      await createLabCategory({
        name,
        description,
      });

      router.push(
        "/admin/lab-category",
      );

    } catch (error) {

      console.error(
        "Create category failed:",
        error,
      );

      alert(
        "Failed to create category",
      );

    } finally {

      setLoading(false);

    }
  };


  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Create Lab Category
      </h1>


      <form
        onSubmit={handleSubmit}
        className="max-w-xl bg-white p-6 rounded-lg shadow"
      >

        <div className="mb-4">

          <label className="block mb-2 font-medium">
            Category Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(event) =>
              setName(
                event.target.value,
              )
            }
            placeholder="Enter category name"
            className="w-full border rounded-lg px-4 py-2"
          />

        </div>


        <div className="mb-6">

          <label className="block mb-2 font-medium">
            Description
          </label>

          <textarea
            value={description}
            onChange={(event) =>
              setDescription(
                event.target.value,
              )
            }
            rows={4}
            placeholder="Enter description"
            className="w-full border rounded-lg px-4 py-2"
          />

        </div>


        <div className="flex gap-3">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/lab-category",
              )
            }
            className="border px-4 py-2 rounded-lg"
          >
            Cancel
          </button>


          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {loading
              ? "Creating..."
              : "Create Category"}
          </button>

        </div>

      </form>

    </div>
  );
}
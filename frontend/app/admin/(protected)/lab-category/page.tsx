"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  deleteLabCategory,
  getLabCategories,
} from "@/services/lab-category.service";

import { LabCategory } from "@/types/lab-category";

export default function LabCategoryPage() {
  const [categories, setCategories] =
    useState<LabCategory[]>([]);

  const [loading, setLoading] =
    useState(true);

  const loadCategories = async () => {
    try {
      const data =
        await getLabCategories();

      setCategories(
        data.categories || [],
      );
    } catch (error) {
      console.error(
        "Failed to load categories:",
        error,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (
    id: string,
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this category?",
      );

    if (!confirmed) return;

    try {
      await deleteLabCategory(id);

      setCategories(
        (previous) =>
          previous.filter(
            (category) =>
              category._id !== id,
          ),
      );
    } catch (error) {
      console.error(
        "Failed to delete category:",
        error,
      );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold">
            Lab Categories
          </h1>

          <p className="text-gray-500">
            Manage laboratory categories
          </p>
        </div>

        <Link
          href="/admin/lab-category/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Category
        </Link>

      </div>


      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>
              <th className="text-left p-4">
                Name
              </th>

              <th className="text-left p-4">
                Description
              </th>

              <th className="text-left p-4">
                Actions
              </th>
            </tr>

          </thead>


          <tbody>

            {categories.length === 0 ? (

              <tr>
                <td
                  colSpan={3}
                  className="p-6 text-center text-gray-500"
                >
                  No categories found
                </td>
              </tr>

            ) : (

              categories.map(
                (category) => (

                  <tr
                    key={category._id}
                    className="border-t"
                  >

                    <td className="p-4 font-medium">
                      {category.name}
                    </td>

                    <td className="p-4">
                      {category.description ||
                        "-"}
                    </td>

                    <td className="p-4">

                      <div className="flex gap-2">

                        <Link
                          href={`/admin/lab-category/edit/${category._id}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(
                              category._id,
                            )
                          }
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>

                ),
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
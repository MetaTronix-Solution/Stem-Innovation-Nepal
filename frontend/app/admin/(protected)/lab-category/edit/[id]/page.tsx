"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  getLabCategory,
  updateLabCategory,
} from "@/services/lab-category.service";


export default function EditLabCategoryPage() {

  const router = useRouter();

  const params = useParams();

  const id = params.id as string;


  const [name, setName] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  useEffect(() => {

    const loadCategory =
      async () => {

        try {

          const data =
            await getLabCategory(id);

          setName(
            data.category.name,
          );

          setDescription(
            data.category.description ||
              "",
          );

        } catch (error) {

          console.error(
            "Failed to load category:",
            error,
          );

        } finally {

          setLoading(false);

        }
      };


    if (id) {
      loadCategory();
    }

  }, [id]);


  const handleSubmit = async (
    event: FormEvent,
  ) => {

    event.preventDefault();

    if (!name.trim()) {
      alert(
        "Category name is required",
      );
      return;
    }


    try {

      setSaving(true);

      await updateLabCategory(
        id,
        {
          name,
          description,
        },
      );

      router.push(
        "/admin/lab-category",
      );

    } catch (error) {

      console.error(
        "Update category failed:",
        error,
      );

      alert(
        "Failed to update category",
      );

    } finally {

      setSaving(false);

    }
  };


  if (loading) {

    return (
      <div className="p-6">
        Loading category...
      </div>
    );

  }


  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Edit Lab Category
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
            disabled={saving}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {saving
              ? "Updating..."
              : "Update Category"}
          </button>

        </div>

      </form>

    </div>
  );
}
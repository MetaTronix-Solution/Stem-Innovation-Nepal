"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  getLab,
  updateLab,
} from "@/services/lab.service";

import {
  getLabItems,
} from "@/services/lab-item.service";

import {
  LabItem,
} from "@/types/lab-item";


export default function EditLabPage() {

  const router = useRouter();

  const params = useParams();

  const id = params.id as string;


  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [selectedItems, setSelectedItems] =
    useState<string[]>([]);

  const [image, setImage] =
    useState<File | null>(null);

  const [currentImage, setCurrentImage] =
    useState("");


  const [items, setItems] =
    useState<LabItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  useEffect(() => {

    const loadData =
      async () => {

        try {

          const [
            labResponse,
            itemsResponse,
          ] = await Promise.all([
            getLab(id),
            getLabItems(),
          ]);


          const lab =
            labResponse.lab;


          setTitle(
            lab.title,
          );

          setDescription(
            lab.description,
          );

          setPrice(
            String(lab.price),
          );

          setCurrentImage(
            lab.image || "",
          );


          const ids =
            Array.isArray(
              lab.labItems,
            )
              ? lab.labItems.map(
                  (item) =>
                    typeof item ===
                    "string"
                      ? item
                      : item._id,
                )
              : [];


          setSelectedItems(
            ids,
          );


          setItems(
            itemsResponse.labItems ||
              [],
          );

        } catch (error) {

          console.error(
            "Failed to load lab:",
            error,
          );

        } finally {

          setLoading(false);

        }

      };


    if (id) {
      loadData();
    }

  }, [id]);


  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {

    const file =
      event.target.files?.[0];

    if (file) {
      setImage(file);
    }

  };


  const handleItemChange = (
    itemId: string,
  ) => {

    setSelectedItems(
      (previous) => {

        if (
          previous.includes(itemId)
        ) {

          return previous.filter(
            (id) =>
              id !== itemId,
          );

        }

        return [
          ...previous,
          itemId,
        ];

      },
    );

  };


  const handleSubmit = async (
    event: FormEvent,
  ) => {

    event.preventDefault();


    if (!title.trim()) {

      alert(
        "Lab title is required",
      );

      return;

    }


    if (
      selectedItems.length === 0
    ) {

      alert(
        "Please select at least one lab item",
      );

      return;

    }


    try {

      setSaving(true);


      const formData =
        new FormData();


      formData.append(
        "title",
        title,
      );

      formData.append(
        "description",
        description,
      );

      formData.append(
        "price",
        price,
      );

      selectedItems.forEach((itemId) => {
      formData.append("labItems", itemId);
      });


      if (image) {

        formData.append(
          "image",
          image,
        );

      }


      await updateLab(
        id,
        formData,
      );


      router.push(
        "/admin/labs",
      );

    } catch (error) {

      console.error(
        "Update lab failed:",
        error,
      );

      alert(
        "Failed to update lab",
      );

    } finally {

      setSaving(false);

    }

  };


  if (loading) {

    return (
      <div className="p-6">
        Loading lab...
      </div>
    );

  }


  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Edit Lab
      </h1>


      <form
        onSubmit={handleSubmit}
        className="max-w-3xl bg-white p-6 rounded-lg shadow"
      >

        <div className="mb-4">

          <label className="block mb-2">
            Lab Title
          </label>

          <input
            value={title}
            onChange={(event) =>
              setTitle(
                event.target.value,
              )
            }
            className="w-full border rounded-lg px-4 py-2"
          />

        </div>


        <div className="mb-4">

          <label className="block mb-2">
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


        <div className="mb-4">

          <label className="block mb-2">
            Price
          </label>

          <input
            type="number"
            value={price}
            onChange={(event) =>
              setPrice(
                event.target.value,
              )
            }
            className="w-full border rounded-lg px-4 py-2"
          />

        </div>


        <div className="mb-6">

          <label className="block mb-3 font-medium">
            Lab Items
          </label>


          <div className="border rounded-lg p-4 space-y-3">

            {items.map(
              (item) => (

                <label
                  key={item._id}
                  className="flex items-center gap-3 cursor-pointer"
                >

                  <input
                    type="checkbox"
                    checked={selectedItems.includes(
                      item._id,
                    )}
                    onChange={() =>
                      handleItemChange(
                        item._id,
                      )
                    }
                  />

                  <span>
                    {item.title}
                  </span>

                  <span className="text-gray-500">
                    Rs. {item.price}
                  </span>

                </label>

              ),
            )}

          </div>

        </div>


        {currentImage && (

          <div className="mb-4">

            <p className="font-medium mb-2">
              Current Image
            </p>

            <img
              src={currentImage}
              alt={title}
              className="w-40 h-40 object-cover rounded"
            />

          </div>

        )}


        <div className="mb-6">

          <label className="block mb-2">
            Change Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={
              handleImageChange
            }
          />

        </div>


        <div className="flex gap-3">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/labs",
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
              : "Update Lab"}
          </button>

        </div>

      </form>

    </div>
  );
}
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
  getLabItem,
  updateLabItem,
} from "@/services/lab-item.service";

import {
  getLabCategories,
} from "@/services/lab-category.service";

import {
  LabCategory,
} from "@/types/lab-category";


export default function EditLabItemPage() {

  const router = useRouter();

  const params = useParams();

  const id = params.id as string;


  const [title, setTitle] =
    useState("");

  const [description, setDescription] =
    useState("");

  const [specification, setSpecification] =
    useState("");

  const [price, setPrice] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [image, setImage] =
    useState<File | null>(null);

  const [currentImage, setCurrentImage] =
    useState("");


  const [categories, setCategories] =
    useState<LabCategory[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);


  useEffect(() => {

    const loadData =
      async () => {

        try {

          const [
            itemResponse,
            categoryResponse,
          ] = await Promise.all([
            getLabItem(id),
            getLabCategories(),
          ]);


          const item =
            itemResponse.labItem;


          setTitle(item.title);

          setDescription(
            item.description,
          );

          setSpecification(
            item.specification,
          );

          setPrice(
            String(item.price),
          );

          setQuantity(
            String(item.quantity),
          );


          if (
            typeof item.category ===
            "string"
          ) {

            setCategory(
              item.category,
            );

          } else {

            setCategory(
              item.category._id,
            );

          }


          setCurrentImage(
            item.image || "",
          );


          setCategories(
            categoryResponse.categories ||
              [],
          );

        } catch (error) {

          console.error(
            "Failed to load lab item:",
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


  const handleSubmit = async (
    event: FormEvent,
  ) => {

    event.preventDefault();


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
        "specification",
        specification,
      );

      formData.append(
        "price",
        price,
      );

      formData.append(
        "quantity",
        quantity,
      );

      formData.append(
        "category",
        category,
      );


      if (image) {

        formData.append(
          "image",
          image,
        );

      }


      await updateLabItem(
        id,
        formData,
      );


      router.push(
        "/admin/lab-items",
      );

    } catch (error) {

      console.error(
        "Update lab item failed:",
        error,
      );

      alert(
        "Failed to update lab item",
      );

    } finally {

      setSaving(false);

    }

  };


  if (loading) {

    return (
      <div className="p-6">
        Loading lab item...
      </div>
    );

  }


  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Edit Lab Item
      </h1>


      <form
        onSubmit={handleSubmit}
        className="max-w-2xl bg-white p-6 rounded-lg shadow"
      >

        <div className="mb-4">

          <label className="block mb-2">
            Title
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
            Specification
          </label>

          <textarea
            value={specification}
            onChange={(event) =>
              setSpecification(
                event.target.value,
              )
            }
            rows={4}
            className="w-full border rounded-lg px-4 py-2"
          />

        </div>


        <div className="grid grid-cols-2 gap-4 mb-4">

          <div>

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


          <div>

            <label className="block mb-2">
              Quantity
            </label>

            <input
              type="number"
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  event.target.value,
                )
              }
              className="w-full border rounded-lg px-4 py-2"
            />

          </div>

        </div>


        <div className="mb-4">

          <label className="block mb-2">
            Category
          </label>

          <select
            value={category}
            onChange={(event) =>
              setCategory(
                event.target.value,
              )
            }
            className="w-full border rounded-lg px-4 py-2"
          >

            <option value="">
              Select Category
            </option>

            {categories.map(
              (item) => (

                <option
                  key={item._id}
                  value={item._id}
                >
                  {item.name}
                </option>

              ),
            )}

          </select>

        </div>


        {currentImage && (

          <div className="mb-4">

            <p className="mb-2 font-medium">
              Current Image
            </p>

            <img
              src={currentImage}
              alt={title}
              className="w-32 h-32 object-cover rounded"
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
                "/admin/lab-items",
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
              : "Update Lab Item"}
          </button>

        </div>

      </form>

    </div>
  );
}
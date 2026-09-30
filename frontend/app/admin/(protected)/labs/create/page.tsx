"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import {
  createLab,
} from "@/services/lab.service";

import {
  getLabItems,
} from "@/services/lab-item.service";

import {
  LabItem,
} from "@/types/lab-item";


export default function CreateLabPage() {

  const router = useRouter();


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


  const [items, setItems] =
    useState<LabItem[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [loadingItems, setLoadingItems] =
    useState(true);


  useEffect(() => {

    const loadItems =
      async () => {

        try {

          const data =
            await getLabItems();

          setItems(
            data.labItems || [],
          );

        } catch (error) {

          console.error(
            "Failed to load lab items:",
            error,
          );

        } finally {

          setLoadingItems(false);

        }

      };

    loadItems();

  }, []);


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
    id: string,
  ) => {

    setSelectedItems(
      (previous) => {

        if (
          previous.includes(id)
        ) {

          return previous.filter(
            (itemId) =>
              itemId !== id,
          );

        }

        return [
          ...previous,
          id,
        ];

      },
    );

  };


  const handleSubmit = async (
    event: FormEvent,
  ) => {

    event.preventDefault();


    if (!title.trim()) {
      alert("Lab title is required");
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

      setLoading(true);


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


      /*
       * Send lab item IDs.
       *
       * Your backend should convert
       * this value into an array.
       */
      selectedItems.forEach((itemId) => {
  formData.append("labItems", itemId);
});

      if (image) {

        formData.append(
          "image",
          image,
        );

      }


      await createLab(
        formData,
      );


      router.push(
        "/admin/labs",
      );

    } catch (error) {

      console.error(
        "Create lab failed:",
        error,
      );

      alert(
        "Failed to create lab",
      );

    } finally {

      setLoading(false);

    }

  };


  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Create Lab
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
            placeholder="Robotics Starter Lab"
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
            Select Lab Items
          </label>


          {loadingItems ? (

            <p>
              Loading lab items...
            </p>

          ) : (

            <div className="border rounded-lg p-4 space-y-3">

              {items.length === 0 ? (

                <p className="text-gray-500">
                  No lab items available.
                </p>

              ) : (

                items.map(
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
                )

              )}

            </div>

          )}

        </div>


        <div className="mb-6">

          <label className="block mb-2">
            Lab Image
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
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            {loading
              ? "Creating..."
              : "Create Lab"}
          </button>

        </div>

      </form>

    </div>
  );
}
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  deleteLabItem,
  getLabItems,
} from "@/services/lab-item.service";

import { LabItem } from "@/types/lab-item";


export default function LabItemsPage() {

  const [items, setItems] =
    useState<LabItem[]>([]);

  const [loading, setLoading] =
    useState(true);


  const loadItems = async () => {

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

      setLoading(false);

    }
  };


  useEffect(() => {
    loadItems();
  }, []);


  const handleDelete = async (
    id: string,
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this lab item?",
      );

    if (!confirmed) return;


    try {

      await deleteLabItem(id);

      setItems(
        (previous) =>
          previous.filter(
            (item) =>
              item._id !== id,
          ),
      );

    } catch (error) {

      console.error(
        "Delete lab item failed:",
        error,
      );

    }
  };


  if (loading) {

    return (
      <div className="p-6">
        Loading lab items...
      </div>
    );

  }


  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-2xl font-bold">
            Lab Items
          </h1>

          <p className="text-gray-500">
            Manage laboratory items
          </p>

        </div>


        <Link
          href="/admin/lab-items/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Lab Item
        </Link>

      </div>


      <div className="bg-white rounded-lg shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100">

            <tr>

              <th className="p-4 text-left">
                Image
              </th>

              <th className="p-4 text-left">
                Title
              </th>

              <th className="p-4 text-left">
                Price
              </th>

              <th className="p-4 text-left">
                Quantity
              </th>

              <th className="p-4 text-left">
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {items.map(
              (item) => (

                <tr
                  key={item._id}
                  className="border-t"
                >

                  <td className="p-4">

                    {item.image ? (

                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                      />

                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                        No Image
                      </div>
                    )}

                  </td>


                  <td className="p-4 font-medium">
                    {item.title}
                  </td>


                  <td className="p-4">
                    Rs. {item.price}
                  </td>


                  <td className="p-4">
                    {item.quantity}
                  </td>


                  <td className="p-4">

                    <div className="flex gap-2">

                      <Link
                        href={`/admin/lab-items/edit/${item._id}`}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() =>
                          handleDelete(
                            item._id,
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
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}
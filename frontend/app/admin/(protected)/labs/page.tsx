"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  deleteLab,
  getLabs,
} from "@/services/lab.service";

import { Lab } from "@/types/lab";


export default function LabsPage() {

  const [labs, setLabs] =
    useState<Lab[]>([]);

  const [loading, setLoading] =
    useState(true);


  const loadLabs = async () => {

    try {

      const data =
        await getLabs();

      setLabs(
        data.labs || [],
      );

    } catch (error) {

      console.error(
        "Failed to load labs:",
        error,
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadLabs();
  }, []);


  const handleDelete = async (
    id: string,
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this lab?",
      );

    if (!confirmed) return;


    try {

      await deleteLab(id);

      setLabs(
        (previous) =>
          previous.filter(
            (lab) =>
              lab._id !== id,
          ),
      );

    } catch (error) {

      console.error(
        "Delete lab failed:",
        error,
      );

    }
  };


  if (loading) {

    return (
      <div className="p-6">
        Loading labs...
      </div>
    );

  }


  return (
    <div className="p-6">

      <div className="flex justify-between items-center mb-6">

        <div>

          <h1 className="text-2xl font-bold">
            Labs
          </h1>

          <p className="text-gray-500">
            Manage laboratory setups
          </p>

        </div>


        <Link
          href="/admin/labs/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add Lab
        </Link>

      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {labs.map(
          (lab) => (

            <div
              key={lab._id}
              className="bg-white rounded-xl shadow overflow-hidden"
            >

              {lab.image ? (

                <img
                  src={lab.image}
                  alt={lab.title}
                  className="w-full h-48 object-cover"
                />

              ) : (

                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  No Image
                </div>

              )}


              <div className="p-5">

                <h2 className="text-xl font-semibold">
                  {lab.title}
                </h2>


                <p className="text-gray-500 mt-2">
                  {lab.description}
                </p>


                <p className="font-semibold mt-3">
                  Rs. {lab.price}
                </p>


                <p className="text-sm text-gray-500 mt-2">

                  Lab Items:{" "}

                  {Array.isArray(
                    lab.labItems,
                  )
                    ? lab.labItems.length
                    : 0}

                </p>


                <div className="flex gap-2 mt-4">

                  <Link
                    href={`/admin/labs/edit/${lab._id}`}
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </Link>


                  <button
                    onClick={() =>
                      handleDelete(
                        lab._id,
                      )
                    }
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>

                </div>

              </div>

            </div>

          ),
        )}

      </div>

    </div>
  );
}
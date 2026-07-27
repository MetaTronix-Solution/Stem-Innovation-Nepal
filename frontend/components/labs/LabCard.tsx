"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Props {
  lab: any;
}

export default function LabCard({ lab }: Props) {
  return (
    <Card className="overflow-hidden rounded-2xl shadow-sm hover:shadow-xl transition duration-300">

      <img
        src={`${API_URL}${lab.image}`}
        alt={lab.title}
        className="h-60 w-full object-cover"
      />

      <div className="p-6 space-y-4">

        <h2 className="text-2xl font-bold">
          {lab.title}
        </h2>

        <p className="text-gray-600 line-clamp-3">
          {lab.description}
        </p>

        <div className="flex items-center justify-between">

          <div>

            <p className="text-sm text-gray-500">
              Price
            </p>

            <h3 className="text-2xl font-bold text-blue-700">
              NPR {lab.price.toLocaleString()}
            </h3>

          </div>

          <div className="text-right">

            <p className="text-sm text-gray-500">
              Included
            </p>

            <h3 className="font-semibold">
              {lab.labItems.length} Items
            </h3>

          </div>

        </div>

        <div className="flex gap-3">

          <Button asChild className="flex-1">
            <Link href={`/labs/${lab._id}`}>
              View Details
            </Link>
          </Button>

          <Button
            variant="outline"
            className="flex-1"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add
          </Button>

        </div>

      </div>

    </Card>
  );
}
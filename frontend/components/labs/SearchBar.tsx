"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative">

      <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />

      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search laboratory..."
        className="pl-12 h-12 rounded-xl"
      />

    </div>
  );
}
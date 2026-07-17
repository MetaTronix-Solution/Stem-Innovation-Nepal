"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Trash2, ImageOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GalleryImage = { id: string; url: string; caption: string };

// TODO: replace with images fetched from your backend once it exists
const initialImages: GalleryImage[] = [
  { id: "1", url: "/Logo.jpeg", caption: "Robotics workshop, Kathmandu" },
];

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [caption, setCaption] = useState("");

  function handleAdd() {
    if (!url.trim()) return;
    // TODO: replace with a real file upload to your backend/storage once it exists
    setImages((prev) => [{ id: crypto.randomUUID(), url, caption }, ...prev]);
    setUrl("");
    setCaption("");
    setOpen(false);
  }

  function handleDelete(id: string) {
    setImages((prev) => prev.filter((img) => img.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
          <p className="text-muted-foreground text-sm">
            Manage the photos shown on the public gallery page.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              Add image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a gallery image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="url">Image URL</Label>
                <Input
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="/images/workshop-1.jpg"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="caption">Caption</Label>
                <Input
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. IoT workshop at XYZ School"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Add</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative rounded-xl overflow-hidden border border-border aspect-square bg-muted"
          >
            <Image
              src={img.url}
              alt={img.caption || "Gallery image"}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
              <span className="text-white text-xs truncate">{img.caption}</span>
              <Button
                variant="destructive"
                size="icon"
                className="h-7 w-7 shrink-0"
                onClick={() => handleDelete(img.id)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full flex flex-col items-center gap-2 text-muted-foreground py-12">
            <ImageOff className="h-8 w-8" />
            <p className="text-sm">No images yet. Add your first one.</p>
          </div>
        )}
      </div>
    </div>
  );
}

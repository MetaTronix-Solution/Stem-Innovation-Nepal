"use client";

import { useEffect, useState } from "react";
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
import api from "@/lib/axios";

interface GalleryImage {
  _id: string;
  image: string;
  caption: string;
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [open, setOpen] = useState(false);

  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    try {
      const res = await api.get("/gallery");

      if (res.data.success) {
        setImages(res.data.gallery);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleAdd() {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();

    formData.append("image", file);
    formData.append("caption", caption);

    try {
      setLoading(true);

      // withCredentials and baseURL already come from the shared `api` instance,
      // only the content-type header needs to be overridden here.
      await api.post("/gallery", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchGallery();

      setCaption("");
      setFile(null);
      setPreview("");
      setOpen(false);
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmDelete = confirm("Delete this image?");

    if (!confirmDelete) return;

    try {
      await api.delete(`/gallery/${id}`);

      fetchGallery();
    } catch (err) {
      console.log(err);
      alert("Delete failed");
    }
  }

  // Revoke the object URL when it's replaced or the component unmounts,
  // otherwise each selected file leaks a blob URL.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gallery</h1>
          <p className="text-muted-foreground">
            Upload and manage gallery images.
          </p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Gallery Image</DialogTitle>
            </DialogHeader>

            <div className="space-y-5">
              <div>
                <Label>Choose Image</Label>

                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selected = e.target.files?.[0];

                    if (!selected) return;

                    setFile(selected);
                    setPreview(URL.createObjectURL(selected));
                  }}
                />
              </div>

              {preview && (
                <div className="relative h-56 rounded-xl overflow-hidden border">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div>
                <Label>Caption</Label>

                <Input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Robotics Workshop"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>

              <Button onClick={handleAdd} disabled={loading}>
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <ImageOff className="h-12 w-12 text-muted-foreground mb-3" />
          <p>No gallery images found.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => (
            <div
              key={img._id}
              className="group overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <div className="relative aspect-square">
                <Image
  src={`${process.env.NEXT_PUBLIC_API_URL}${img.image}`}
  alt={img.caption}
  fill
  unoptimized
  className="object-cover transition duration-300 group-hover:scale-105"
/>
              </div>

              <div className="flex items-center justify-between p-3">
                <p className="truncate text-sm font-medium">{img.caption}</p>

                <Button
                  size="icon"
                  variant="destructive"
                  onClick={() => handleDelete(img._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
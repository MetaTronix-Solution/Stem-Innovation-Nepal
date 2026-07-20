"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, ImageOff, Loader2, UploadCloud } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

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
  const [fetching, setFetching] = useState(true);

  const [open, setOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // Image queued for deletion — drives the confirmation dialog. Null = closed.
  const [pendingDelete, setPendingDelete] = useState<GalleryImage | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    try {
      setFetching(true);
      const res = await api.get("/gallery");

      if (res.data.success) {
        setImages(res.data.gallery);
      }
    } catch (err) {
      console.log(err);
      toast.error("Couldn't load the gallery", {
        description: "Check your connection and try again.",
      });
    } finally {
      setFetching(false);
    }
  }

  function handleFileSelect(selected: File | null) {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  async function handleAdd() {
    if (!file) {
      toast.error("Choose an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    try {
      setLoading(true);

      await api.post("/gallery", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchGallery();

      toast.success("Image uploaded");

      setCaption("");
      setFile(null);
      setPreview("");
      setOpen(false);
    } catch (err) {
      console.log(err);
      toast.error("Upload failed", {
        description: "The image couldn't be uploaded. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const { _id, caption: deletedCaption } = pendingDelete;

    try {
      setDeletingId(_id);

      await api.delete(`/gallery/${_id}`);

      setImages((prev) => prev.filter((img) => img._id !== _id));
      toast.success(`"${deletedCaption || "Image"}" deleted`);
    } catch (err) {
      console.log(err);
      toast.error("Delete failed", {
        description: "The image couldn't be removed. Please try again.",
      });
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
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
          <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
          <p className="text-muted-foreground mt-1">
            Upload and manage gallery images.
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(next) => {
            setOpen(next);
            if (!next) {
              setFile(null);
              setPreview("");
              setCaption("");
            }
          }}
        >
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add gallery image</DialogTitle>
              <DialogDescription>
                Upload a photo and give it a short caption.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <div>
                <Label className="mb-2 block">Image</Label>

                <label
                  htmlFor="gallery-file"
                  className="group relative flex h-56 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/30 transition-colors hover:border-muted-foreground/50 hover:bg-muted/50"
                >
                  {preview ? (
                    <Image
                      src={preview}
                      alt="Selected preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 px-4 text-center">
                      <UploadCloud className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm font-medium">
                        Click to choose an image
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG or JPG, up to a few MB
                      </p>
                    </div>
                  )}

                  <Input
                    id="gallery-file"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
                  />
                </label>
              </div>

              <div>
                <Label htmlFor="gallery-caption" className="mb-2 block">
                  Caption
                </Label>
                <Input
                  id="gallery-caption"
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
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading
                  </>
                ) : (
                  "Upload"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {fetching ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-xl bg-muted"
            />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-24 text-center">
          <ImageOff className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="font-medium">No images yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Upload your first photo to start building the gallery.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => {
            const isDeleting = deletingId === img._id;

            return (
              <div
                key={img._id}
                className="group relative aspect-square overflow-hidden rounded-xl border bg-muted shadow-sm transition-shadow hover:shadow-md"
              >
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${img.image}`}
                  alt={img.caption}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Bottom gradient + caption, always legible over any photo */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3 pt-8">
                  <p className="truncate text-sm font-medium text-white">
                    {img.caption || "Untitled"}
                  </p>
                </div>

                {/* Delete button — quiet by default, appears on hover, stays
                    visible while its own delete request is in flight */}
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={() => setPendingDelete(img)}
                  disabled={isDeleting}
                  className={`absolute top-2 right-2 h-8 w-8 border bg-white/90 text-destructive opacity-0 shadow-sm backdrop-blur transition-opacity duration-200 hover:bg-white hover:text-destructive group-hover:opacity-100 ${
                    isDeleting ? "opacity-100" : ""
                  }`}
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            );
          })}
        </div>
      )}

      <AlertDialog
        open={!!pendingDelete}
        onOpenChange={(next) => !next && setPendingDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete?.caption
                ? `"${pendingDelete.caption}" will be permanently removed from the gallery.`
                : "This image will be permanently removed from the gallery."}{" "}
              This can't be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
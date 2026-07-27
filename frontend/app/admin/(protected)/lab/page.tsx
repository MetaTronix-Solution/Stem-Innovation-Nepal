"use client";

import { useEffect, useState } from "react";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  getLabs,
  getLabItems,
  createLab,
  updateLab,
  deleteLab,
} from "@/services/lab.service";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LabItem {
  _id: string;
  title: string;
}

interface Lab {
  _id: string;
  title: string;
  description: string;
  price: number;
  image: string;
  labItems: LabItem[];
}

export default function LabPage() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [items, setItems] = useState<LabItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [open, setOpen] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const [imageFile, setImageFile] = useState<File | null>(null);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const labRes = await getLabs();
      const itemRes = await getLabItems();

      setLabs(labRes.labs);
      setItems(itemRes.items);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);

    setTitle("");
    setDescription("");
    setPrice("");

    setImageFile(null);

    setSelectedItems([]);
  }

  function toggleItem(id: string) {
    setSelectedItems((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]
    );
  }

  function openEdit(lab: Lab) {
    setEditingId(lab._id);

    setTitle(lab.title);
    setDescription(lab.description);
    setPrice(String(lab.price));

    setSelectedItems(lab.labItems.map((i) => i._id));

    setImageFile(null);

    setOpen(true);
  }

  async function handleSubmit() {
    try {
      setSubmitting(true);

      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      selectedItems.forEach((id) => {
        formData.append("labItems", id);
      });

      if (editingId) {
        await updateLab(editingId, formData);
        toast.success("Lab updated successfully");
      } else {
        await createLab(formData);
        toast.success("Lab created successfully");
      }

      resetForm();

      setOpen(false);

      loadData();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteLab(id);

      setLabs((prev) => prev.filter((lab) => lab._id !== id));

      toast.success("Lab deleted successfully");
    } catch {
      toast.error("Failed to delete lab");
    }
  }

  return (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">Labs</h1>
        <p className="text-muted-foreground text-sm">
          Manage lab setups and their lab items.
        </p>
      </div>

      <Dialog
        open={open}
        onOpenChange={(value) => {
          setOpen(value);

          if (!value) {
            resetForm();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button onClick={resetForm}>
            <Plus className="mr-2 h-4 w-4" />
            New Lab
          </Button>
        </DialogTrigger>

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Lab" : "Create Lab"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5">

            <div className="space-y-2">
              <Label>Title</Label>

              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Robotics Starter Kit"
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>

              <Textarea
                rows={4}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Price</Label>

              <Input
                type="number"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label>
                Image
                {editingId &&
                  " (Leave empty to keep current image)"}
              </Label>

              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setImageFile(
                    e.target.files?.[0] ?? null
                  )
                }
              />
            </div>

            <div className="space-y-3">
              <Label>Select Lab Items</Label>

              <div className="grid grid-cols-2 gap-3 rounded-md border p-4 max-h-64 overflow-y-auto">

                {items.map((item) => (
                  <label
                    key={item._id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(
                        item._id
                      )}
                      onChange={() =>
                        toggleItem(item._id)
                      }
                    />

                    <span className="text-sm">
                      {item.title}
                    </span>
                  </label>
                ))}

                {items.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No Lab Items Found
                  </p>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {editingId
                ? "Update Lab"
                : "Create Lab"}
            </Button>

          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>

        {loading ? (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    ) : (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {labs.map((lab) => (
          <Card
  key={lab._id}
  className="overflow-hidden rounded-2xl border bg-white shadow-sm hover:shadow-xl transition-all duration-300 py-0"
>

            <div className="relative">
  <img
    src={`${API_URL}${lab.image}`}
    alt={lab.title}
    className="h-60 w-full object-cover"
  />

  <Badge className="absolute left-4 top-4 bg-white text-black shadow">
    Lab Setup
  </Badge>
</div>

            <CardHeader className="space-y-4">

  <div>
    <CardTitle className="text-2xl font-bold">
      {lab.title}
    </CardTitle>

    <CardDescription className="mt-2 text-[15px] leading-6">
      {lab.description}
    </CardDescription>
  </div>

  <div className="rounded-xl border bg-slate-50 p-4">

    <p className="text-xs uppercase tracking-widest text-gray-500">
      Total Price
    </p>

    <h2 className="mt-1 text-3xl font-bold text-blue-600">
      NPR {lab.price.toLocaleString()}
    </h2>

  </div>

</CardHeader>

            <CardContent className="space-y-4">

              <div>
                <p className="text-sm font-semibold mb-2">
                  Lab Items
                </p>

                <div className="flex flex-wrap gap-2">
                  {lab.labItems.length > 0 ? (
                    lab.labItems.map((item) => (
                      <Badge
                        key={item._id}
                        variant="secondary"
                      >
                        {item.title}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No Lab Items
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end mb-3 gap-2">

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => openEdit(lab)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => handleDelete(lab._id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>

              </div>

            </CardContent>
          </Card>
        ))}

        {labs.length === 0 && (
          <div className="col-span-full text-center py-20 text-muted-foreground">
            No Labs Found
          </div>
        )}
      </div>
    )}
  </div>
);
}
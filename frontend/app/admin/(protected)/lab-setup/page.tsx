"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { labItemService } from "@/services/lab-item.service";
import { LabItem } from "@/types/lab-item";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function LabSetupPage() {
  const [items, setItems] = useState<LabItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [specification, setSpecification] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState(""); // ObjectId string — swap for a Select once LabCategory endpoint exists
  const [imageFile, setImageFile] = useState<File | null>(null);

  const formValid =
    title.trim().length > 0 &&
    description.trim().length > 0 &&
    specification.trim().length > 0 &&
    price !== "" &&
    Number(price) >= 0 &&
    quantity !== "" &&
    Number(quantity) >= 0 &&
    category.trim().length > 0 &&
    (editingId ? true : !!imageFile);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const data = await labItemService.getAll();
      setItems(data);
    } catch (err) {
      toast.error("Failed to load lab items");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setSpecification("");
    setPrice("");
    setQuantity("");
    setCategory("");
    setImageFile(null);
  }

  function openEdit(item: LabItem) {
    setEditingId(item._id);
    setTitle(item.title);
    setDescription(item.description);
    setSpecification(item.specification);
    setPrice(String(item.price));
    setQuantity(String(item.quantity));
    setCategory(
      typeof item.category === "string" ? item.category : item.category._id,
    );
    setImageFile(null);
    setOpen(true);
  }

  async function handleSubmit() {
    if (!formValid) return;

    try {
      setSubmitting(true);
      if (editingId) {
        await labItemService.update(editingId, {
          title,
          description,
          specification,
          price: Number(price),
          quantity: Number(quantity),
          category,
          ...(imageFile ? { image: imageFile } : {}),
        });
        toast.success("Item updated");
      } else {
        await labItemService.create({
          title,
          description,
          specification,
          price: Number(price),
          quantity: Number(quantity),
          category,
          image: imageFile as File,
        });
        toast.success("Item added");
      }
      resetForm();
      setOpen(false);
      loadData();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await labItemService.remove(id);
      setItems((prev) => prev.filter((i) => i._id !== id));
      toast.success("Item deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete item");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Lab Setup</h1>
          <p className="text-muted-foreground text-sm">
            Manage lab kit items, quantities, and pricing.
          </p>
        </div>

        <Dialog
          open={open}
          onOpenChange={(v) => {
            setOpen(v);
            if (!v) resetForm();
          }}
        >
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4" />
              New item
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit lab item" : "New lab item"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Arduino Uno Starter Kit"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short description shown to customers..."
                  rows={3}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="specification">Specification</Label>
                <Textarea
                  id="specification"
                  value={specification}
                  onChange={(e) => setSpecification(e.target.value)}
                  placeholder="Technical specs, dimensions, contents..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="price">Price (NPR)</Label>
                  <Input
                    id="price"
                    type="number"
                    min={0}
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="quantity">Quantity in stock</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min={0}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category">Category ID</Label>
                <Input
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Paste LabCategory ObjectId (temporary until dropdown is wired)"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="image">
                  Image {editingId && "(leave empty to keep current image)"}
                </Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !formValid}
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingId ? "Save changes" : "Add item"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm text-center py-12">
          Loading items...
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {items.map((item) => (
            <Card key={item._id} className="overflow-hidden py-0 gap-0">
              <img
                src={`${API_URL}${item.image}`}
                alt={item.title}
                className="h-32 w-full object-cover"
              />
              <CardHeader className="p-4 gap-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="text-xs">
                    Qty: {item.quantity}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    NPR {item.price}
                  </Badge>
                </div>
                <CardTitle className="text-sm leading-snug line-clamp-2">
                  {item.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-xs">
                  {item.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end gap-1 p-2 pt-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(item)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(item._id)}
                >
                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {items.length === 0 && (
            <p className="text-muted-foreground text-sm col-span-full text-center py-12">
              No items yet. Click &quot;New item&quot; to add your first one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

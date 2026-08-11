"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Newspaper,
  Type,
  AlignLeft,
  Image as ImageIcon,
  Upload,
  Eye,
} from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { blogService } from "@/services/blog.service";
import { Blog } from "@/types/blog";
import { toast } from "sonner";

const TITLE_MIN = 5;
const TITLE_MAX = 150;
const CONTENT_MIN = 20;

export default function BlogPage() {
  const [posts, setPosts] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const titleValid =
    title.trim().length >= TITLE_MIN && title.trim().length <= TITLE_MAX;
  const contentValid = content.trim().length >= CONTENT_MIN;
  const imageValid = editingId ? true : !!imageFile;
  const formValid = titleValid && contentValid && imageValid;

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    try {
      setLoading(true);
      const data = await blogService.getAllAdmin();
      setPosts(data);
    } catch (err) {
      toast.error("Failed to load blog posts");
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setEditingId(null);
    setTitle("");
    setContent("");
    setPublished(true);
    setImageFile(null);
  }

  function openEdit(post: Blog) {
    setEditingId(post._id);
    setTitle(post.title);
    setContent(post.content);
    setPublished(post.published);
    setImageFile(null);
    setOpen(true);
  }

  async function handleSubmit() {
    if (!formValid) return;

    try {
      setSubmitting(true);
      if (editingId) {
        await blogService.update(editingId, {
          title,
          content,
          published,
          ...(imageFile ? { image: imageFile } : {}),
        });
        toast.success("Post updated");
      } else {
        await blogService.create({
          title,
          content,
          published,
          image: imageFile as File,
        });
        toast.success("Post published");
      }
      resetForm();
      setOpen(false);
      loadPosts();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await blogService.remove(id);
      setPosts((prev) => prev.filter((p) => p._id !== id));
      toast.success("Post deleted");
    } catch (err: any) {
      toast.error(err.message || "Failed to delete post");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Blog</h1>
          <p className="text-muted-foreground text-sm">
            Write and manage posts shown on the public site.
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
              New post
            </Button>
          </DialogTrigger>

          {/*
            FIX: the dialog itself is now capped to the viewport height and
            laid out as a column (max-h-[85vh] flex flex-col). The header and
            footer stay fixed; only the middle section scrolls
            (overflow-y-auto min-h-0). Without min-h-0 a flex child won't
            shrink below its content size, which is why the scrollbar wasn't
            appearing before even though overflow-y-auto was theoretically
            possible to add.
          */}
          <DialogContent className="flex max-h-[85vh] flex-col gap-0 overflow-hidden rounded-xl p-0 sm:max-w-lg">
            <DialogHeader className="shrink-0 space-y-1 border-b bg-background px-6 py-5">
              <DialogTitle className="text-lg">
                {editingId ? "Edit blog post" : "New blog post"}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                {editingId
                  ? "Update the post and save your changes."
                  : "Fill in the details below to publish a new post."}
              </p>
            </DialogHeader>

            <div className="min-h-0 flex-1 space-y-6 overflow-y-auto bg-background px-6 py-5">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="title" className="flex items-center gap-1.5">
                    <Type className="h-3.5 w-3.5 text-muted-foreground" />
                    Title
                  </Label>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums ${
                      title.length > 0 && !titleValid
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {title.trim().length}/{TITLE_MAX}
                  </span>
                </div>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Our Robotics Workshop in Pokhara"
                  maxLength={TITLE_MAX}
                  className="h-10"
                />
                {title.length > 0 && !titleValid && (
                  <p className="text-xs text-destructive">
                    Title must be at least {TITLE_MIN} characters
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="content"
                    className="flex items-center gap-1.5"
                  >
                    <AlignLeft className="h-3.5 w-3.5 text-muted-foreground" />
                    Content
                  </Label>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums ${
                      content.length > 0 && !contentValid
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {content.trim().length} / min {CONTENT_MIN}
                  </span>
                </div>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the post content..."
                  rows={6}
                  className="max-h-64 resize-y"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="image" className="flex items-center gap-1.5">
                  <ImageIcon className="h-3.5 w-3.5 text-muted-foreground" />
                  Image
                  {editingId && (
                    <span className="font-normal text-muted-foreground">
                      (leave empty to keep current image)
                    </span>
                  )}
                </Label>
                <label
                  htmlFor="image"
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border border-dashed px-4 py-3 text-sm transition-colors hover:border-foreground/30 hover:bg-accent ${
                    imageFile ? "border-input bg-accent/40" : "border-input"
                  }`}
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${
                      imageFile
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {imageFile ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">
                      {imageFile ? imageFile.name : "Choose an image"}
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      {imageFile
                        ? `${(imageFile.size / 1024 / 1024).toFixed(1)} MB · click to replace`
                        : "PNG or JPG, click to browse"}
                    </span>
                  </span>
                </label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                />
                {!editingId && !imageFile && (
                  <p className="text-xs text-muted-foreground">
                    An image is required for new posts
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3.5">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      published
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Eye className="h-4 w-4" />
                  </span>
                  <div>
                    <Label htmlFor="published">Published</Label>
                    <p className="text-xs text-muted-foreground">
                      Visible on the public site immediately
                    </p>
                  </div>
                </div>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
                />
              </div>
            </div>

            <DialogFooter className="shrink-0 flex-row items-center justify-between gap-3 border-t bg-background px-6 py-4 sm:justify-between sm:space-x-0">
              <p className="hidden text-xs text-muted-foreground sm:block">
                {formValid ? (
                  <span className="inline-flex items-center gap-1.5 text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Ready to {editingId ? "save" : "publish"}
                  </span>
                ) : (
                  "Fill in title, content, and an image to continue"
                )}
              </p>
              <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
                <Button
                  variant="outline"
                  className="h-10"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || !formValid}
                  className="h-10 min-w-[7.5rem] disabled:bg-muted disabled:text-muted-foreground disabled:opacity-100"
                >
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Save changes" : "Publish"}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading posts...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post._id}
              className="group overflow-hidden py-0 transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative h-40 w-full overflow-hidden bg-muted">
                {post.imageUrl ? (
                  <img
                    src={post.imageUrl}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Newspaper className="h-8 w-8 text-muted-foreground" />
                  </div>
                )}
                {!post.published && (
                  <Badge
                    variant="outline"
                    className="absolute right-2 top-2 border-0 bg-background/90 backdrop-blur-sm"
                  >
                    Draft
                  </Badge>
                )}
              </div>
              <CardHeader className="pt-4">
                <Badge
                  variant="secondary"
                  className="mb-1 w-fit font-normal text-muted-foreground"
                >
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Badge>
                <CardTitle className="text-base leading-snug">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.content}
                </CardDescription>
                <p className="mt-1 text-xs text-muted-foreground">
                  By {post.author}
                </p>
              </CardHeader>
              <CardContent className="flex justify-end gap-1 pb-4 pt-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => openEdit(post)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => handleDelete(post._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {posts.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 py-16 text-center">
              <Newspaper className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No posts yet. Click &quot;New post&quot; to publish your first
                one.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
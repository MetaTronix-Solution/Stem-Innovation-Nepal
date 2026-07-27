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
import { Switch } from "@/components/ui/switch";
import { blogService } from "@/services/blog.service";
import { Blog } from "@/types/blog";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit blog post" : "New blog post"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Our Robotics Workshop in Pokhara"
                  maxLength={TITLE_MAX}
                />
                <p
                  className={`text-xs ${
                    title.length > 0 && !titleValid
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {title.trim().length}/{TITLE_MAX} characters (min {TITLE_MIN})
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write the post content..."
                  rows={6}
                />
                <p
                  className={`text-xs ${
                    content.length > 0 && !contentValid
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {content.trim().length} characters (min {CONTENT_MIN})
                </p>
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
                {!editingId && !imageFile && (
                  <p className="text-xs text-muted-foreground">
                    An image is required for new posts
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <Label htmlFor="published">Published</Label>
                  <p className="text-xs text-muted-foreground">
                    Visible on the public site immediately
                  </p>
                </div>
                <Switch
                  id="published"
                  checked={published}
                  onCheckedChange={setPublished}
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
                {editingId ? "Save changes" : "Publish"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <p className="text-muted-foreground text-sm text-center py-12">
          Loading posts...
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Card key={post._id} className="overflow-hidden">
              {post.imageUrl && (
                <img
                  src={`${API_URL}${post.imageUrl}`}
                  alt={post.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <CardHeader>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary" className="w-fit">
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </Badge>
                  {!post.published && (
                    <Badge variant="outline" className="w-fit">
                      Draft
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-base leading-snug">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.content}
                </CardDescription>
                <p className="text-xs text-muted-foreground mt-1">
                  By {post.author}
                </p>
              </CardHeader>
              <CardContent className="flex justify-end gap-2 pt-0">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => openEdit(post)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(post._id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardContent>
            </Card>
          ))}
          {posts.length === 0 && (
            <p className="text-muted-foreground text-sm col-span-full text-center py-12">
              No posts yet. Click &quot;New post&quot; to publish your first
              one.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
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

type BlogPost = { id: string; title: string; excerpt: string; date: string };

// TODO: replace with posts fetched from your backend once it exists
const initialPosts: BlogPost[] = [
  {
    id: "1",
    title: "5 Schools Complete Our IoT Robotics Bootcamp",
    excerpt:
      "Students across Kathmandu built their first working robots this month.",
    date: "Jun 12, 2026",
  },
  {
    id: "2",
    title: "Partnering With Local Colleges for 2026",
    excerpt:
      "We're expanding our college workshop program to 4 new institutions.",
    date: "May 28, 2026",
  },
];

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");

  function handleAdd() {
    if (!title.trim() || !excerpt.trim()) return;
    // TODO: replace with a POST request to your backend once it exists
    setPosts((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        excerpt,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
      },
      ...prev,
    ]);
    setTitle("");
    setExcerpt("");
    setOpen(false);
  }

  function handleDelete(id: string) {
    // TODO: replace with a DELETE request to your backend once it exists
    setPosts((prev) => prev.filter((p) => p.id !== id));
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              New post
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New blog post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Our Robotics Workshop in Pokhara"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="excerpt">Content</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Write the post content..."
                  rows={6}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAdd}>Publish</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <Badge variant="secondary" className="w-fit mb-1">
                {post.date}
              </Badge>
              <CardTitle className="text-base leading-snug">
                {post.title}
              </CardTitle>
              <CardDescription className="line-clamp-3">
                {post.excerpt}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end gap-2 pt-0">
              <Button variant="ghost" size="icon">
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(post.id)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
        {posts.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-full text-center py-12">
            No posts yet. Click &quot;New post&quot; to publish your first one.
          </p>
        )}
      </div>
    </div>
  );
}

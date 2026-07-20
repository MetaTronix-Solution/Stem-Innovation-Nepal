import Link from "next/link";
import { notFound } from "next/navigation";
import { blogService } from "@/services/blog.service";

export const revalidate = 60;

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await blogService.getOne(id);

  if (!post) {
    notFound();
  }

  return (
    <article className="bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-blue)] hover:underline"
        >
          ← Back to blog
        </Link>

        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--color-charcoal)] leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-[color:var(--color-slate)]">
            <span>{post.author}</span>
            <span aria-hidden>·</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden">
          <img
            src={`${API_URL}${post.imageUrl}`}
            alt={post.title}
            className="w-full object-cover"
          />
        </div>

        <div className="prose max-w-none text-[color:var(--color-charcoal)] whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>

        <div className="pt-6 border-t border-[color:var(--color-light-gray)]">
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--color-blue)] hover:underline"
          >
            ← Back to blog
          </Link>
        </div>
      </div>
    </article>
  );
}

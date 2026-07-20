import Link from "next/link";
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

export default async function BlogPage() {
  const posts = await blogService.getAll();

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 space-y-10">
        <div className="space-y-2">
          <p className="text-sm font-semibold tracking-wide uppercase text-[color:var(--color-blue)]">
            From the field
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-[color:var(--color-charcoal)]">
            Stories from Stem Innovation Nepal
          </h1>
          <p className="text-[color:var(--color-slate)] max-w-2xl">
            Workshops, partnerships, and milestones from classrooms across
            Nepal.
          </p>
        </div>

        {posts.length === 0 && (
          <p className="text-[color:var(--color-slate)] text-center py-20">
            No posts published yet — check back soon.
          </p>
        )}

        {posts.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <Link
                key={post._id}
                href={`/blog/${post._id}`}
                className="group rounded-xl overflow-hidden border border-[color:var(--color-light-gray)] hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={`${API_URL}${post.imageUrl}`}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {i === 0 && (
                    <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-[color:var(--color-navy)] px-3 py-1 text-xs font-medium text-white">
                      Latest
                    </span>
                  )}
                </div>
                <div className="p-5 space-y-2 flex-1 flex flex-col">
                  <span className="text-xs text-[color:var(--color-slate)]">
                    {formatDate(post.createdAt)}
                  </span>
                  <h4 className="font-semibold text-[color:var(--color-charcoal)] leading-snug line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-sm text-[color:var(--color-slate)] line-clamp-2 flex-1">
                    {post.content}
                  </p>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-[color:var(--color-slate)]">
                      By {post.author}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[color:var(--color-blue)] opacity-0 group-hover:opacity-100 transition-opacity">
                      Read
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

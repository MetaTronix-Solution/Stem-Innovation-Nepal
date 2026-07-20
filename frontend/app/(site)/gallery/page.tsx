"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { getGalleryItems } from "@/lib/gallery";
import { GalleryItem } from "@/types/gallery";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Cycle through a few aspect ratios so the masonry grid doesn't look
// uniform — real workshop photos aren't all the same shape.
const ASPECT_PATTERN = [4 / 5, 4 / 3, 1, 3 / 4, 4 / 3, 4 / 5];

export default function GalleryLightbox() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    getGalleryItems()
      .then(setItems)
      .catch(() =>
        setError(
          "The gallery didn't load. Check your connection and try again."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <GallerySkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-gray-300 py-24 text-center">
        <p className="max-w-sm text-gray-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-navy/90"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-gray-300 py-24 text-center">
        <CameraIcon className="h-10 w-10 text-gray-300" />
        <p className="text-lg font-semibold text-navy">No photos yet</p>
        <p className="max-w-sm text-gray-500">
          Workshop photos will show up here as soon as they&apos;re added.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-6">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-navy">{items.length}</span>{" "}
          {items.length === 1 ? "photo" : "photos"} from our workshops
        </p>
      </div>

      <div className="columns-1 gap-6 [column-fill:_balance] sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <button
            key={item._id}
            onClick={() => setActiveIndex(index)}
            style={{ aspectRatio: ASPECT_PATTERN[index % ASPECT_PATTERN.length] }}
            className="group relative mb-6 block w-full overflow-hidden rounded-2xl bg-gray-100 shadow-sm ring-1 ring-black/5 transition duration-300 hover:shadow-lg hover:ring-black/10"
          >
            <Image
              src={`${API_URL}${item.image}`}
              alt={item.caption || "Workshop photo"}
              fill
              priority={index === 0}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition duration-500 ease-out group-hover:scale-[1.04]"
            />

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/0 to-navy/0 opacity-0 transition duration-300 group-hover:opacity-100" />

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 items-end justify-between gap-3 p-4 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              {item.caption ? (
                <p className="text-left text-sm font-medium leading-snug text-white">
                  {item.caption}
                </p>
              ) : (
                <span />
              )}
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
                <ExpandIcon className="h-4 w-4 text-white" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <Lightbox
          items={items}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </>
  );
}

function Lightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const item = items[activeIndex];
  const filmstripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((activeIndex + 1) % items.length);
      if (e.key === "ArrowLeft")
        onNavigate((activeIndex - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, items.length, onClose, onNavigate]);

  useEffect(() => {
    const active = filmstripRef.current?.querySelector<HTMLElement>(
      `[data-index="${activeIndex}"]`
    );
    active?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [activeIndex]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-navy/97 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-6 py-5"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal">
          Photo {activeIndex + 1} of {items.length}
        </p>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
          aria-label="Close"
        >
          <CloseIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Main image area */}
      <div className="relative flex flex-1 items-center justify-center px-4 sm:px-16">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((activeIndex - 1 + items.length) % items.length);
          }}
          className="absolute left-2 z-10 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:left-6"
          aria-label="Previous photo"
        >
          <ChevronIcon className="h-5 w-5 rotate-180" />
        </button>

        <div
          className="relative h-full max-h-[70vh] w-full max-w-4xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={`${API_URL}${item.image}`}
            alt={item.caption || "Workshop photo"}
            fill
            sizes="90vw"
            className="object-contain"
            priority
          />
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onNavigate((activeIndex + 1) % items.length);
          }}
          className="absolute right-2 z-10 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20 sm:right-6"
          aria-label="Next photo"
        >
          <ChevronIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Caption */}
      {item.caption && (
        <p
          className="mx-auto max-w-xl px-6 pb-4 text-center text-sm text-white/80"
          onClick={(e) => e.stopPropagation()}
        >
          {item.caption}
        </p>
      )}

      {/* Filmstrip */}
      <div
        ref={filmstripRef}
        onClick={(e) => e.stopPropagation()}
        className="flex gap-2 overflow-x-auto px-6 pb-6 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((thumb, i) => (
          <button
            key={thumb._id}
            data-index={i}
            onClick={() => onNavigate(i)}
            className={`relative h-14 w-20 flex-none overflow-hidden rounded-lg ring-2 transition ${
              i === activeIndex
                ? "ring-teal opacity-100"
                : "ring-transparent opacity-40 hover:opacity-70"
            }`}
          >
            <Image
              src={`${API_URL}${thumb.image}`}
              alt=""
              fill
              sizes="80px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

function GallerySkeleton() {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {ASPECT_PATTERN.map((ratio, i) => (
        <div
          key={i}
          style={{ aspectRatio: ratio }}
          className="mb-6 animate-pulse rounded-2xl bg-gray-200"
        />
      ))}
    </div>
  );
}

function CameraIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 9a2 2 0 0 1 2-2h.93a2 2 0 0 0 1.664-.89l.812-1.22A2 2 0 0 1 10.07 4h3.86a2 2 0 0 1 1.664.89l.812 1.22A2 2 0 0 0 18.07 7H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"
      />
      <circle cx="12" cy="13" r="3.5" strokeWidth={1.5} />
    </svg>
  );
}

function ExpandIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 3H5a2 2 0 0 0-2 2v4m18 0V5a2 2 0 0 0-2-2h-4m0 18h4a2 2 0 0 0 2-2v-4M3 15v4a2 2 0 0 0 2 2h4"
      />
    </svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

function ChevronIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m9 18 6-6-6-6" />
    </svg>
  );
}
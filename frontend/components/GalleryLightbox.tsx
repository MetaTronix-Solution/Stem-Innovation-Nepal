"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { galleryItems } from "@/lib/data";

export default function GalleryLightbox() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = () => setActiveIndex(null);
  const next = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % galleryItems.length));
  const prev = () =>
    setActiveIndex((i) =>
      i === null ? null : (i - 1 + galleryItems.length) % galleryItems.length,
    );

  useEffect(() => {
    if (activeIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeIndex]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {galleryItems.map((item, i) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-[4/3] overflow-hidden rounded-sm border border-charcoal/10"
          >
            <Image
              src={item.image}
              alt={item.caption}
              fill
              sizes="(max-width: 640px) 50vw, 33vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-navy/0 p-3 opacity-0 transition group-hover:bg-navy/40 group-hover:opacity-100">
              <span className="text-left text-xs font-medium text-white">
                {item.caption}
              </span>
            </div>
          </button>
        ))}
      </div>

      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Gallery image viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep/95 p-4 md:p-10"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close viewer"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white hover:border-teal"
          >
            ✕
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white hover:border-teal md:left-8"
          >
            ‹
          </button>

          <div
            className="relative aspect-[4/3] w-full max-w-3xl overflow-hidden rounded-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryItems[activeIndex].image}
              alt={galleryItems[activeIndex].caption}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <p className="absolute inset-x-0 bottom-0 bg-navy-deep/80 px-4 py-3 text-sm text-white">
              {galleryItems[activeIndex].caption}
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white hover:border-teal md:right-8"
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}

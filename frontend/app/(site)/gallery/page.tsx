import type { Metadata } from "next";
import GalleryLightbox from "@/components/GalleryLightbox";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos from Stem Innovation Nepal's IoT and Robotics workshops, school visits, and competitions.",
  alternates: {
    canonical: "/gallery",
  },
};

export default function GalleryPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            Gallery
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight lg:text-6xl">
            Workshops in Progress
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Take a look inside our IoT and Robotics workshops. These photos
            showcase students learning through hands-on projects, collaborative
            activities, and real-world STEM experiences across our partner
            schools and colleges.
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <GalleryLightbox />
        </div>
      </section>
    </>
  );
}

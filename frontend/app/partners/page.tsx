import type { Metadata } from "next";
import PartnerGrid from "@/components/PartnerGrid";

export const metadata: Metadata = {
  title: "Our Partners",
  description:
    "The 30+ schools and 10+ colleges across Kathmandu that partner with Stem Innovation Nepal for IoT and Robotics training.",
  alternates: {
    canonical: "/partners",
  },
};

export default function PartnersPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            Our Partners
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight lg:text-6xl">
            30+ schools, 10+ colleges,
            <br />
            one training network
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Every institution below has partnered with Stem Innovation Nepal to
            deliver hands on IoT and Robotics education from single day
            workshops to full semester STEM programs.
          </p>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="bg-light-gray py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <PartnerGrid />
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import { achievements, stats } from "@/lib/data";

export const metadata: Metadata = {
  title: "Achievements",
  description:
    "Milestones from Stem Innovation Nepal's IoT and Robotics workshops across Kathmandu.",
  alternates: {
    canonical: "/achievements",
  },
};

export default function AchievementsPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            Achievements
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight lg:text-6xl">
            Milestones on the Network
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Over the years, Stem Innovation Nepal has collaborated with schools,
            colleges, and educators to inspire thousands of students through
            practical IoT and Robotics education.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-gray-200 bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-3 lg:px-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-light-gray p-8 text-center shadow-sm"
            >
              <h2 className="text-5xl font-bold text-navy">
                {stat.value}
                <span className="text-teal">{stat.suffix}</span>
              </h2>

              <p className="mt-3 text-lg text-slate">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="bg-light-gray py-24">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
              Timeline
            </p>

            <h2 className="mt-4 text-4xl font-bold text-charcoal">
              Our Journey
            </h2>
          </div>

          <div className="relative">
            <div className="absolute left-3 top-0 h-full w-0.5 bg-gray-300" />

            <ol className="space-y-12">
              {achievements.map((item) => (
                <li key={item.title} className="relative flex gap-6">
                  <div className="relative z-10 mt-2 h-6 w-6 rounded-full border-4 border-orange bg-white" />

                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">
                      {item.year}
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold text-charcoal">
                      {item.title}
                    </h3>

                    <p className="mt-3 leading-8 text-slate">
                      {item.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}

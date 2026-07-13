import type { Metadata } from "next";
import Link from "next/link";
import CircuitDivider from "@/components/CircuitDivider";
import { programs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Explore Stem Innovation Nepal's IoT and Robotics training programs — curriculum, age groups, duration, and format.",
  alternates: {
    canonical: "/programs",
  },
};

export default function ProgramsPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            Programs
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight lg:text-6xl">
            Two core programs, built for the lab bench
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Both programs are delivered on-site, in project-based modules, with
            take-home reference material for students and teachers.
          </p>
        </div>
      </section>

      {/* PROGRAMS */}
      {programs.map((program, i) => (
        <section
          key={program.slug}
          id={program.slug}
          className={`scroll-mt-24 py-24 ${
            i % 2 === 0 ? "bg-white" : "bg-light-gray"
          }`}
        >
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:px-8">
            {/* LEFT CONTENT */}
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
                Module {String(i + 1).padStart(2, "0")}
              </p>

              <h2 className="mt-4 text-4xl font-bold text-charcoal">
                {program.title}
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate">
                {program.description}
              </p>

              {/* INFO CARDS */}
              <dl className="mt-10 grid gap-5 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
                    Age Group
                  </dt>

                  <dd className="mt-3 font-medium text-charcoal">
                    {program.ageGroup}
                  </dd>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
                    Duration
                  </dt>

                  <dd className="mt-3 font-medium text-charcoal">
                    {program.duration}
                  </dd>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
                    Format
                  </dt>

                  <dd className="mt-3 font-medium text-charcoal">
                    {program.format}
                  </dd>
                </div>
              </dl>

              <Link
                href="/contact"
                className="mt-10 inline-flex rounded-full bg-orange px-8 py-4 font-semibold text-white transition duration-300 hover:bg-teal"
              >
                Book This Program
              </Link>
            </div>

            {/* RIGHT CARD */}
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <div className="rounded-xl border border-slate-700 bg-navy p-10 text-white">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
                  What Students Cover
                </p>

                <ul className="mt-8 space-y-5">
                  {program.topics.map((topic, index) => (
                    <li key={topic} className="flex items-start gap-4">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/20 font-semibold text-teal">
                        {index + 1}
                      </span>

                      <span className="leading-7 text-white/85">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
      ))}

      <CircuitDivider className="bg-light-gray py-3" />

      {/* CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-charcoal">
            Not sure which program fits your students?
          </h2>

          <p className="max-w-2xl text-lg leading-8 text-slate">
            Our team can help you choose the right STEM program based on your
            students' age group, learning objectives, and available schedule.
          </p>

          <Link
            href="/contact"
            className="rounded-full bg-orange px-8 py-4 font-semibold text-white transition duration-300 hover:bg-teal"
          >
            Talk to Our Team
          </Link>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { services, whyChooseUs } from "@/lib/data";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore STEAM Innovation Nepal's programs — STEAM education, app & web development, IoT & robotics, smart hospitality, and digital fabrication training.",
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
            Our Services
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight lg:text-6xl">
            Five programs, one goal: future-ready students
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/75">
            Every program is delivered on-site, in project based modules, with
            take home reference material for students and teachers.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      {services.map((service, i) => (
        <section
          key={service.slug}
          id={service.slug}
          className={`scroll-mt-24 py-24 ${
            i % 2 === 0 ? "bg-white" : "bg-light-gray"
          }`}
        >
          <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:px-8">
            {/* LEFT CONTENT */}
            <div className={i % 2 === 1 ? "lg:order-2" : ""}>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
                Service {String(i + 1).padStart(2, "0")}
              </p>

              <h2 className="mt-4 text-4xl font-bold text-charcoal">
                {service.title}
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate">
                {service.description}
              </p>

              {service.note && (
                <p className="mt-4 text-lg leading-8 text-slate">
                  {service.note}
                </p>
              )}

              {/* TIERS (STEAM Education only) */}
              {service.tiers && (
                <div className="mt-10 space-y-8">
                  {service.tiers.map((tier) => (
                    <div
                      key={tier.label}
                      className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal">
                        {tier.label}
                      </p>

                      <ul className="mt-4 flex flex-wrap gap-2">
                        {tier.topics.map((topic) => (
                          <li
                            key={topic}
                            className="rounded-full bg-navy/5 px-3 py-1.5 text-sm font-medium text-navy"
                          >
                            {topic}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT CARD — plain topics list (skip if tiers already shown above) */}
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              {service.topics && (
                <div className="rounded-xl border border-slate-700 bg-navy p-10 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
                    What Students Cover
                  </p>

                  <ul className="mt-8 space-y-5">
                    {service.topics.map((topic, index) => (
                      <li key={topic} className="flex items-start gap-4">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal/20 font-semibold text-teal">
                          {index + 1}
                        </span>

                        <span className="leading-7 text-white/85">
                          {topic}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      ))}

      {/* WHY CHOOSE US */}
      <section className="bg-navy py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            Why Choose Us
          </p>

          <h2 className="mt-4 max-w-2xl text-4xl font-bold leading-tight">
            Why Choose STEAM Innovation Nepal?
          </h2>

          <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {whyChooseUs.map((item) => (
              <li
                key={item}
                className="flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal/20 text-teal">
                  ✓
                </span>
                <span className="leading-7 text-white/85">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-24">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-6 text-center lg:px-8">
          <h2 className="text-4xl font-bold text-charcoal">
            Not sure which program fits your students?
          </h2>

          <p className="max-w-2xl text-lg leading-8 text-slate">
            Our team can help you choose the right STEAM program based on
            your students&apos; age group, learning objectives, and available
            schedule.
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
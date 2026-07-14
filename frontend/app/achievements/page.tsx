import Link from "next/link";
import {
  School,
  GraduationCap,
  Users,
  Trophy,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

const stats = [
  {
    icon: School,
    value: "30+",
    label: "Partner Schools",
  },
  {
    icon: GraduationCap,
    value: "10+",
    label: "College Workshops",
  },
  {
    icon: Users,
    value: "5000+",
    label: "Students Trained",
  },
  {
    icon: Trophy,
    value: "100+",
    label: "STEM Workshops",
  },
];

const milestones = [
  "Delivered 10+ college-level IoT workshops across Nepal.",
  "Partnered with more than 30 schools and educational institutions.",
  "Introduced students to hands-on Robotics and IoT technologies.",
  "Conducted project-based STEM learning programs.",
  "Inspired innovation through practical technology education.",
  "Continued expanding STEM education to new institutions every year.",
];

const institutions = [
  "Partner School",
  "Engineering College",
  "STEM Academy",
  "Innovation Campus",
  "Technical Institute",
  "Community School",
];

export default function Achievements() {
  return (
    <section className="bg-light-gray py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-orange/10 px-5 py-2 text-sm font-semibold text-orange">
            Our Achievements
          </span>

          <h2 className="mt-6 text-4xl font-bold text-charcoal lg:text-5xl">
              Making an Impact Through
              <span className="mt-3 block text-orange">
                STEM Education
              </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate">
            Over the years, Stem Innovation Nepal has partnered with schools
            and colleges across Nepal to deliver practical IoT and Robotics
            education that inspires creativity, innovation, and real-world
            problem solving.
          </p>

        </div>

        {/* Statistics */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                className="rounded-3xl bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange/10">
                  <Icon className="h-8 w-8 text-orange" />
                </div>

                <h3 className="mt-6 text-4xl font-bold text-navy">
                  {item.value}
                </h3>

                <p className="mt-2 text-slate">
                  {item.label}
                </p>
              </div>
            );
          })}

        </div>

        {/* Milestones */}
        <div className="mt-24 grid gap-16 lg:grid-cols-2">

          <div>

            <h3 className="text-3xl font-bold text-charcoal">
              Key Milestones
            </h3>

            <p className="mt-4 leading-8 text-slate">
              Every workshop, every partnership, and every student trained
              represents another step toward building Nepal's future
              innovators.
            </p>

            <div className="mt-10 space-y-6">

              {milestones.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4"
                >
                  <div className="rounded-full bg-teal/10 p-2">
                    <CheckCircle className="h-6 w-6 text-teal" />
                  </div>

                  <p className="leading-7 text-slate">
                    {item}
                  </p>
                </div>
              ))}

            </div>

          </div>

          {/* Featured Institutions */}
          <div>

            <h3 className="text-3xl font-bold text-charcoal">
              Institutions We've Worked With
            </h3>

            <p className="mt-4 leading-8 text-slate">
              We proudly collaborate with schools and colleges throughout
              Nepal to bring practical STEM education into classrooms.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-5">

              {institutions.map((item, index) => (
                <div
                  key={index}
                  className="flex h-28 items-center justify-center rounded-2xl border border-gray-200 bg-white text-center font-semibold text-charcoal shadow-sm"
                >
                  {item}
                </div>
              ))}

            </div>

          </div>

        </div>

        {/* CTA */}
        <div className="mt-24 rounded-3xl bg-navy px-8 py-16 text-center text-white">

          <h3 className="text-4xl font-bold">
            Be Our Next Success Story
          </h3>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
            Join the growing network of schools and colleges empowering
            students through hands-on IoT, Robotics, and STEM education.
          </p>

          <Link
            href="/contact"
            className="mt-10 inline-flex items-center gap-2 rounded-xl bg-orange px-8 py-4 font-semibold text-white transition hover:bg-teal"
          >
            Book a Workshop
            <ArrowRight size={20} />
          </Link>

        </div>

      </div>
    </section>
  );
}
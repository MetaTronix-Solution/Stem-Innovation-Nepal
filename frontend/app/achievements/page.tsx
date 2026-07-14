import Link from "next/link";
import {
  School,
  GraduationCap,
  Users,
  Trophy,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { achievements } from "@/lib/data";

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
            <span className="mt-3 block text-orange">STEM Education</span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate">
            Over the years, Stem Innovation Nepal has partnered with schools and
            colleges across Nepal to deliver practical IoT and Robotics
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

                <p className="mt-2 text-slate">{item.label}</p>
              </div>
            );
          })}
        </div>

        {/* Timeline */}
        <div className="mt-24">
          <div className="mx-auto max-w-3xl">
            <div className="mb-16 text-center">
              <h3 className="text-3xl font-bold text-charcoal md:text-4xl">
                Our Journey
              </h3>

              <p className="mt-4 leading-8 text-slate">
                Every partnership, workshop, and milestone represents another
                step toward empowering students through practical STEM
                education.
              </p>
            </div>

            <div className="relative">
              {/* Vertical Line */}
              <div className="absolute left-3 top-2 bottom-2 w-px bg-gray-300" />

              <div className="space-y-12">
                {achievements.map((item) => (
                  <div key={item.title} className="relative flex gap-6">
                    {/* Circle */}
                    <div className="relative z-10 mt-1 h-6 w-6 rounded-full border-2 border-orange bg-white" />

                    {/* Content */}
                    <div className="pb-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-teal">
                        {item.year}
                      </p>

                      <h4 className="mt-2 text-2xl font-bold text-charcoal">
                        {item.title}
                      </h4>

                      <p className="mt-3 max-w-2xl leading-8 text-slate">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

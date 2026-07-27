import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Stem Innovation Nepal's story, mission, and CEO Siddhartha Yadav's vision for STEM education in Nepal.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
            About Us
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight lg:text-6xl">
            Building Nepal&apos;s next generation of engineers,
            <br />
            one workshop at a time
          </h1>
        </div>
      </section>

      {/* STORY */}
      <section className="bg-white py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.4fr_0.8fr] lg:px-8">
          {/* LEFT */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
              Our Story
            </p>

            <h2 className="mt-4 text-4xl font-bold leading-tight text-charcoal">
              From classroom idea to a 30+ school network
            </h2>

            <div className="mt-8 space-y-7 text-lg leading-9 text-slate">
              <p>
                Stem Innovation Nepal is a Kathmandu based education technology
                company that delivers hands on IoT and Robotics training to
                school and college students across Nepal. We partner directly
                with academic institutions to bring practical, project based
                STEM learning into classrooms helping students build real world
                technical skills beyond the standard curriculum.
              </p>

              <p>
                What started as a handful of in classroom sensor demonstrations
                has grown into a network of 30+ partner schools and 10+ colleges
                across Kathmandu, each running IoT or Robotics modules designed
                around what students can actually build with their hands.
              </p>

              <p>
                We work closely with teachers and academic coordinators at every
                stage from scheduling and space planning to curriculum handoff
                so every workshop integrates smoothly into a school or
                college&apos;s academic calendar.
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            <div className="border border-gray-200 bg-light-gray p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
                Our Mission
              </p>

              <p className="mt-5 leading-8 text-charcoal">
                To make hands on IoT and Robotics education accessible to every
                school and college in Nepal equipping students with the
                practical technical skills a technology driven future demands.
              </p>
            </div>

            <div className="border border-gray-200 bg-light-gray p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
                Who We Work With
              </p>

              <ul className="mt-5  space-y-3 leading-7 text-slate">
                <li>
                  School and college administrators evaluating STEM partners
                </li>
                <li>Teachers and academic coordinators</li>
                <li>
                  Parents and students interested in IoT & Robotics programs
                </li>
                <li>Corporate sponsors and NGO partners</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CEO */}
      <section className="bg-light-gray py-24">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <div className="flex flex-col items-center lg:items-start">
            <div className="relative h-32 w-32 overflow-hidden rounded-full sm:h-40 sm:w-40 lg:h-44 lg:w-44">
              <Image
                src="/images/ceo.jpeg"
                alt="Siddhartha Kumar Yadav, CEO of STEAM Innovation Nepal"
                fill
                className="object-cover object-top"
                sizes="(min-width: 1024px) 176px, (min-width: 640px) 160px, 128px"
                priority
              />
            </div>

            <h3 className="mt-6 text-3xl font-semibold text-charcoal">
              Siddhartha Kumar Yadav
            </h3>

            <p className="mt-2 text-blue">Chief Executive Officer (CEO)</p>
          </div>

          <div className="border border-gray-200 bg-white p-10 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-teal">
              A Message From Our CEO
            </p>

            <blockquote className="mt-6 space-y-6 text-xl leading-10 text-charcoal">
              <p className="font-semibold not-italic text-charcoal">
                Welcome to STEAM Innovation Nepal.
              </p>

              <p>
                At STEAM Innovation Nepal, we believe that education should
                inspire curiosity, creativity, and innovation. Our mission is
                to empower learners with the knowledge and practical skills
                needed to succeed in the digital era. By integrating Science,
                Technology, Engineering, Arts, and Mathematics (STEAM) with
                emerging technologies such as Artificial Intelligence, IoT,
                Robotics, Coding, 3D Printing, and Digital Fabrication, we
                prepare students to become future innovators and
                problem-solvers.
              </p>

              <p>
                We are committed to transforming education through
                project-based learning, modern STEAM laboratories,
                industry-relevant training, and strong partnerships with
                schools, universities, government agencies, and
                organizations. Our goal is not only to teach technology but
                also to cultivate critical thinking, creativity,
                collaboration, and an entrepreneurial mindset.
              </p>

              <p>
                As we continue to grow, our vision is to establish Nepal as a
                regional leader in STEAM education and innovation, creating
                opportunities for young people to compete and collaborate on
                a global stage.
              </p>

              <p>
                Thank you for visiting STEAM Innovation Nepal. We invite you
                to join us in shaping the future of education through
                innovation and technology.
              </p>
            </blockquote>

            <div className="mt-8 not-italic text-charcoal">
              <p className="text-lg">Sincerely,</p>
              <p className="mt-1 text-lg font-semibold">
                Siddhartha Kumar Yadav
              </p>
              <p className="text-blue">Chief Executive Officer (CEO)</p>
              <p className="text-slate">STEAM Innovation Nepal</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
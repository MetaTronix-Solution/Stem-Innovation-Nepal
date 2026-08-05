import Image from "next/image";

const teamMembers = [
  {
    name: "Mr. Raju Shrestha",
    role: "Advisor",
    image: "/images/teams/raju.png",
    bio: "CEO of Nepatronix Engineering Solution since 2021 and a seasoned tech entrepreneur. Co-author of STEAM Starter, he advises on innovation, entrepreneurship, and educational transformation.",
  },
  {
    name: "Er. Siddhartha Yadav",
    role: "Chief Executive Officer (CEO)",
    image: "/images/teams/ceo.jpeg",
    bio: "Leads STEAM Innovation Nepal's mission to transform education through STEAM integration and emerging technologies. Co-author of STEAM Starter, Nepal's first comprehensive STEAM education book, with expertise spanning AI, IoT, robotics, and digital fabrication.",
  },
  {
    name: "Mr. Ronit Shristav",
    role: "Chief Technology Officer (CTO)",
    image: "/images/teams/ronit.jpeg",
    bio: "Leads software development and digital innovation with over six years of experience building scalable, user-centric applications, including INNOVATOR and Bishawas.",
  },

  {
    name: "Sunil Rana Magar",
    role: "Robotics & AI Trainer",
    image: "/images/teams/sunil.png",
    bio: "An Electronics and Communication Engineer passionate about robotics, IoT and STEM education. Designs electronic systems and IoT solutions using Arduino and ESP32, and loves teaching students through hands-on activities.",
  },
  {
    name: "Er. Krishna Rawal",
    role: "STEAM Education & Technology Specialist",
    image: "/images/teams/krishnaRawal.jpeg",
    bio: "Electronics and Communication Engineer with over three years of experience training students in robotics, IoT, AI, and embedded systems through hands-on, project-based learning.",
  },
  {
    name: "Mr. Milan Pokharel",
    role: "Lead IoT & Robotics Engineer",
    image: "/images/teams/milan.png",
    bio: "Brings over three years of experience in IoT, robotics, and embedded systems, with expertise in drone technology and RC aircraft development, including work on the DUDU Ride app.",
  },
  {
    name: "Er. Yuvraj Sahi",
    role: "Robotics & AI Trainer",
    image: "/images/teams/yubraj.jpeg",
    bio: "Passionate about robotics, STEM education, and mentoring students through project-based learning.",
  },
  {
    name: "Er. Rusha Dahal",
    role: "STEAM Educator",
    image: "/images/teams/rusha.jpeg",
    bio: "STEAM Educator with over two years of experience delivering hands-on learning, curriculum development, and project mentoring for students.",
  },
  {
    name: "Er. Chandani Jha",
    role: "STEAM Educator",
    image: "/images/teams/chandani.jpeg",
    bio: "STEAM Educator focused on project-based learning across science, technology, engineering, arts, and mathematics, with hands-on curriculum delivery.",
  },
  {
    name: "Sima",
    role: "STEM Educator",
    image: "/images/teams/sima.jpeg",
    bio: "Guiding students in programming, electronics and technology innovation through hands-on workshops.",
  },
];

export default function TeamSection() {
 return (
    <section className="bg-light-gray py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-orange/10 px-5 py-2 text-sm font-semibold text-orange">
            Our Team
          </span>

          <h2 className="mt-6 text-4xl font-bold text-charcoal lg:text-5xl">
            Meet the People Behind
            <span className="mt-3 block text-orange">
              Stem Innovation Nepal
            </span>
          </h2>
          <p className="mt-8 text-lg leading-8 text-slate">
            Our dedicated educators, engineers, and mentors work together
            to inspire the next generation of innovators through hands-on
            STEM, IoT and Robotics education.
          </p>

        </div>

        {/* Team Grid */}

        <div className="mt-20 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">

          {teamMembers.map((member) => (
            <div
              key={member.name + member.role}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-charcoal/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal/5">

                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top grayscale transition-all duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0"
                />

                {/* subtle gradient so the name reads well even on light photo backgrounds */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-charcoal/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              </div>

              <div className="flex flex-1 flex-col p-6">

                <h3 className="text-xl font-bold leading-snug text-charcoal">
                  {member.name}
                </h3>

                <p className="mt-1 text-sm font-semibold uppercase tracking-wide text-orange">
                  {member.role}
                </p>

                <span className="mt-3 mb-4 block h-0.5 w-8 rounded-full bg-orange/40" />

                <p className="line-clamp-4 text-sm leading-relaxed text-slate">
                  {member.bio}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
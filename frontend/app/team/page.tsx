import Image from "next/image";

const teamMembers = [
  {
    name: "Siddhartha Yadav",
    role: "Chief Executive Officer",
    image: "/team/placeholder.jpg",
    bio: "Leading Stem Innovation Nepal with a vision to empower students through practical STEM, IoT and Robotics education across Nepal.",
  },
  {
    name: "Trainer Name",
    role: "Robotics Trainer",
    image: "/team/placeholder.jpg",
    bio: "Passionate about Robotics, STEM education, and mentoring students through project-based learning.",
  },
  {
    name: "Trainer Name",
    role: "IoT Instructor",
    image: "/team/placeholder.jpg",
    bio: "Helping students build innovative IoT projects while encouraging creativity and real-world problem solving.",
  },
  {
    name: "Trainer Name",
    role: "STEM Mentor",
    image: "/team/placeholder.jpg",
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

        <div className="mt-20 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {teamMembers.map((member) => (
            <div
              key={member.name + member.role}
              className="overflow-hidden rounded-3xl bg-white shadow-lg transition duration-300 hover:-translate-y-2"
            >
              <div className="relative h-72 w-full">

                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />

              </div>

              <div className="p-6">

                <h3 className="text-2xl font-bold text-charcoal">
                  {member.name}
                </h3>

                <p className="mt-2 font-semibold text-orange">
                  {member.role}
                </p>

                <p className="mt-4 leading-7 text-slate">
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
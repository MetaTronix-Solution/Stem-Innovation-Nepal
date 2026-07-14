import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Clock,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

const quickLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about" },
  { name: "Programs", href: "/programs" },
  { name: "Partners", href: "/partners" },
  { name: "Achievements", href: "/achievements" },
  { name: "Team", href: "/team" },
  { name: "Contact", href: "/contact" },
];

const courses = [
  { name: "IoT Training", href: "/programs" },
  { name: "Robotics Education", href: "/programs" },
  { name: "STEM Workshops", href: "/programs" },
  { name: "Arduino Programming", href: "/programs" },
  { name: "Drone Workshops", href: "/programs" },
  { name: "Student Projects", href: "/programs" },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-navy text-gray-300">
      {/* Top Section */}
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {/* Company */}
        <div>
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-14 w-14 overflow-hidden rounded-xl">
              <Image
                src="/Logo.jpeg"
                alt="Stem Innovation Nepal"
                fill
                className="object-cover"
              />
            </div>

            <div>
              <h2 className="text-lg font-bold text-white">
                Stem Innovation Nepal
              </h2>

              <p className="text-xs text-gray-400">
                IoT & Robotics Education
              </p>
            </div>
          </Link>

          <p className="mt-6 leading-7">
            Empowering Nepal's future innovators through practical STEM,
            Robotics and IoT education that prepares students for tomorrow's
            technology.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-start gap-3">
              <MapPin
                className="mt-1 text-orange"
                size={18}
              />

              <p>
                Kupondol, Kathmandu
                <br />
                Nepal
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Clock
                className="mt-1 text-orange"
                size={18}
              />

              <p>
                Sunday - Friday
                <br />
                9:00 AM - 6:00 PM
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Mail
                className="text-orange"
                size={18}
              />

              <a
                href="mailto:info@steminnovationnepal.com"
                className="transition hover:text-orange"
              >
                info@steminnovationnepal.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Phone
                className="text-orange"
                size={18}
              />

              <a
                href="tel:+9779800000000"
                className="transition hover:text-orange"
              >
                +977 9800000000
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="mb-6 text-lg font-semibold text-white">
            Quick Links
          </h2>

          <div className="flex flex-col gap-3">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition hover:text-orange"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Programs */}
        <div>
          <h2 className="mb-6 text-lg font-semibold text-white">
            Programs
          </h2>

          <div className="flex flex-col gap-3">
            {courses.map((course) => (
              <Link
                key={course.name}
                href={course.href}
                className="transition hover:text-orange"
              >
                {course.name}
              </Link>
            ))}

            <Link
              href="/programs"
              className="mt-3 inline-flex items-center gap-2 font-medium text-orange hover:text-teal"
            >
              View All Programs

              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Social */}
        <div>
          <h2 className="mb-6 text-lg font-semibold text-white">
            Connect With Us
          </h2>

          <p>
            Stay updated with our latest workshops, robotics projects and
            STEM activities.
          </p>

          <div className="mt-6 flex gap-4">
            <a
              href="#"
              aria-label="Facebook"
              className="rounded-full bg-white/10 p-3 transition hover:bg-orange hover:text-white"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              aria-label="Instagram"
              className="rounded-full bg-white/10 p-3 transition hover:bg-orange hover:text-white"
            >
              <FaInstagram />
            </a>

            <a
              href="#"
              aria-label="LinkedIn"
              className="rounded-full bg-white/10 p-3 transition hover:bg-orange hover:text-white"
            >
              <FaLinkedinIn />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="rounded-full bg-white/10 p-3 transition hover:bg-orange hover:text-white"
            >
              <FaYoutube />
            </a>
          </div>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-orange px-6 py-3 font-semibold text-white transition hover:bg-teal"
          >
            Contact Us

            <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm md:flex-row lg:px-8">
          <p>
            © {new Date().getFullYear()} Stem Innovation Nepal. All Rights
            Reserved.
          </p>

          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-orange"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="hover:text-orange"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/cookies"
              className="hover:text-orange"
            >
              Cookie Policy
            </Link>
          </div>


        </div>
      </div>
    </footer>
  );
}
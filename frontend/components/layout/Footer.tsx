import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden px-6 md:px-16 lg:px-24 xl:px-32 w-full text-sm text-slate-500 bg-white pt-10">

      {/* Background SVG */}
      <svg
        className="hidden md:block absolute -bottom-30 -left-80 opacity-5 w-full h-full pointer-events-none"
        width="68"
        height="26"
        viewBox="0 0 68 26"
        fill="none"
      >
        <path
          d="M16.141 0C13.4854 0 10.9387 1.04871 9.06091 2.91543L2.93268 9.00761C1.05492 10.8743 0 13.4061 0 16.0461C0 21.5435 4.48289 26 10.0128 26C12.6684 26 15.2152 24.9512 17.0929 23.0845L33.6827 6.59239C34.5795 5.70086 35.7958 5.2 37.0641 5.2"
          fill="#364153"
        />
      </svg>


      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">


        {/* Company */}
        <div>

          <Link href="/" className="flex items-center gap-3">

            <div className="h-12 w-12 flex items-center justify-center rounded-lg bg-orange text-white text-xl font-bold">
              S
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Stem Innovation Nepal
              </h2>

              <p className="text-xs">
                IoT & Robotics Education
              </p>
            </div>

          </Link>


          <p className="mt-6 leading-7">
            Empowering Nepal's future innovators through hands-on IoT,
            Robotics, STEM education and real-world technology projects.
          </p>


          {/* Social Icons */}
          <div className="flex gap-3 mt-6">

            <a
              href="#"
              className="p-3 rounded-full bg-gray-100 hover:bg-orange hover:text-white transition"
            >
              <FaFacebookF />
            </a>

            <a
              href="#"
              className="p-3 rounded-full bg-gray-100 hover:bg-orange hover:text-white transition"
            >
              <FaInstagram />
            </a>


            <a
              href="#"
              className="p-3 rounded-full bg-gray-100 hover:bg-orange hover:text-white transition"
            >
              <FaLinkedinIn />
            </a>


            <a
              href="#"
              className="p-3 rounded-full bg-gray-100 hover:bg-orange hover:text-white transition"
            >
              <FaYoutube />
            </a>

          </div>

        </div>



        {/* Company Links */}
        <div className="lg:flex lg:justify-center">

          <div className="flex flex-col space-y-3">

            <h2 className="font-semibold mb-5 text-gray-800">
              Company
            </h2>


            <Link href="/about" className="hover:text-orange transition">
              About Us
            </Link>

            <Link href="/programs" className="hover:text-orange transition">
              Programs
            </Link>

            <Link href="/partners" className="hover:text-orange transition">
              Our Partners
            </Link>

            <Link href="/contact" className="hover:text-orange transition">
              Contact Us
            </Link>


          </div>

        </div>




        {/* Programs */}
        <div>

          <h2 className="font-semibold mb-5 text-gray-800">
            Our Programs
          </h2>


          <div className="flex flex-col space-y-3">

            <Link
              href="/programs/iot"
              className="hover:text-orange transition"
            >
              IoT Training
            </Link>


            <Link
              href="/programs/robotics"
              className="hover:text-orange transition"
            >
              Robotics Education
            </Link>


            <Link
              href="/programs/stem"
              className="hover:text-orange transition"
            >
              STEM Workshops
            </Link>


            <Link
              href="/programs/project"
              className="hover:text-orange transition"
            >
              Student Projects
            </Link>

          </div>

        </div>




        {/* Newsletter */}
        <div>

          <h2 className="font-semibold mb-5 text-gray-800">
            Stay Connected
          </h2>


          <div className="space-y-6 max-w-sm">

            <p>
              Get updates about our latest STEM programs,
              workshops and technology events.
            </p>


            <div className="flex">

              <input
                type="email"
                placeholder="Enter your email"
                className="rounded-l-md bg-gray-100 outline-none w-full h-11 px-3"
              />


              <button
                className="bg-orange px-5 h-11 text-white rounded-r-md hover:opacity-90 transition"
              >
                Subscribe
              </button>


            </div>


          </div>

        </div>


      </div>




      {/* Bottom Footer */}

      <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-5 border-t mt-10 border-slate-200">


        <p>
          © {new Date().getFullYear()} Stem Innovation Nepal.
          All Rights Reserved.
        </p>



        <div className="flex gap-5">

          <Link href="/" className="hover:text-orange">
            Privacy Policy
          </Link>


          <Link href="/" className="hover:text-orange">
            Terms of Service
          </Link>


          <Link href="/" className="hover:text-orange">
            Cookie Policy
          </Link>

        </div>


      </div>


    </footer>
  );
}
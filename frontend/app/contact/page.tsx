"use client";

import { FormEvent, useState } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useRouter } from "next/navigation";





export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <>

    <section id="contact" className="bg-light-gray py-20">
        <div className="mx-auto mb-8 max-w-7xl px-6 lg:px-8">

    </div>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2">


          {/* LEFT SIDE */}
          <div>
            <span className="rounded-full bg-orange/10 px-4 py-2 text-sm font-semibold text-orange">
              Contact Us
            </span>

            <h2 className="mt-6 text-4xl font-bold text-charcoal">
              Bring IoT & Robotics Training to Your School
            </h2>

            <p className="mt-4 leading-8 text-slate">
              Reach out to discuss workshops, long-term partnerships,
              robotics training, IoT training, or STEM education programs
              for your school or college.
            </p>

            <div className="mt-10 space-y-8">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-teal/10 p-3">
                  <Phone className="h-6 w-6 text-teal" />
                </div>

                <div>
                  <h4 className="font-semibold text-charcoal">
                    Phone
                  </h4>

                  <p className="text-slate">
                    +977 XX-XXXXXXX
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-teal/10 p-3">
                  <Mail className="h-6 w-6 text-teal" />
                </div>

                <div>
                  <h4 className="font-semibold text-charcoal">
                    Email
                  </h4>

                  <p className="text-slate">
                    info@steminnovationnepal.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-teal/10 p-3">
                  <MapPin className="h-6 w-6 text-teal" />
                </div>

                <div>
                  <h4 className="font-semibold text-charcoal">
                    Office
                  </h4>

                  <p className="text-slate">
                    Kathmandu, Nepal
                  </p>
                </div>
              </div>
            </div>

            {/* SOCIAL */}

            <div className="mt-10 flex gap-4">
              <a
                href="#"
                className="rounded-full bg-navy p-3 text-white transition hover:bg-blue"
              >
                <FaFacebookF size={20} />
              </a>

              <a
                href="#"
                className="rounded-full bg-navy p-3 text-white transition hover:bg-blue"
              >
                <FaInstagram size={20} />
              </a>

              <a
                href="#"
                className="rounded-full bg-navy p-3 text-white transition hover:bg-blue"
              >
                <FaLinkedinIn size={20} />
              </a>
            </div>

            {/* MAP */}

            <div className="mt-10 overflow-hidden rounded-2xl shadow-lg">
              <iframe
                title="Kathmandu Map"
                src="https://www.google.com/maps?q=Kathmandu,Nepal&output=embed"
                className="h-80 w-full"
                loading="lazy"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="rounded-3xl bg-white p-8 shadow-xl">
            <h3 className="mb-8 text-3xl font-bold text-charcoal">
              Send an Inquiry
            </h3>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-2 block font-medium text-charcoal">
                    Name
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="Your Full Name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue"
                  />
                </div>

                <div>
                  <label className="mb-2 block font-medium text-charcoal">
                    Email / Phone
                  </label>

                  <input
                    type="text"
                    required
                    placeholder="How should we reach you?"
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block font-medium text-charcoal">
                  School / Organization
                </label>

                <input
                  type="text"
                  placeholder="Institution Name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue"
                />
              </div>

              <div>
                <label className="mb-2 block font-medium text-charcoal">
                  Message
                </label>

                <textarea
                  rows={6}
                  required
                  placeholder="Tell us about your training needs..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none transition focus:border-blue"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-orange py-4 font-semibold text-white transition hover:bg-teal"
              >
                Contact Our Team
              </button>

              {submitted && (
                <p className="text-center font-medium text-teal">
                  Thank you! Your message has been submitted successfully.
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
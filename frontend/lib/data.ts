export const siteConfig = {
  name: "Stem Innovation Nepal",
  tagline: "Empowering Nepal's Future Innovators Through IoT & Robotics",
  description:
    "Stem Innovation Nepal partners with schools and colleges across Kathmandu to deliver hands-on IoT and Robotics training that prepares students for a technology-driven future.",
  url: "https://www.example.com", // Replace with your actual site URL
  email: "hello@steminnovationnepal.com.np",
  phone: "+977-1-4XXXXXX",
  address: "Kathmandu, Bagmati Province, Nepal",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/programs", label: "Programs" },
  { href: "/partners", label: "Our Partners" },
  { href: "/achievements", label: "Achievements" },
  { href: "/team", label: "Team" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
];

export const stats = [
  { value: 30, suffix: "+", label: "Partner schools in Kathmandu" },
  { value: 10, suffix: "+", label: "Colleges IoT workshops" },
  { value: 2, suffix: "", label: "Core programs: IoT & Robotics" },
];

export const programs = [
  {
    slug: "iot",
    title: "IoT Training",
    short: "Sensors, microcontrollers, and connected devices.",
    description:
      "Students learn to wire, program, and deploy connected devices from reading a sensor for the first time to shipping a working prototype that reports live data.",
    ageGroup: "Grades 8–12 & first/second year college",
    duration: "6–10 week module, workshop or semester format",
    format: "Hands on lab sessions, in-school or on-campus",
    topics: [
      "Sensors & actuators (temperature, motion, light, gas)",
      "Microcontrollers: Arduino & ESP32",
      "Wi-Fi connectivity and cloud dashboards",
      "Real-world project builds: smart irrigation, air-quality monitors, home automation",
    ],
  },
  {
    slug: "robotics",
    title: "Robotics Training",
    short: "Robot design, programming, and competition prep.",
    description:
      "From chassis design to autonomous navigation, students build robots by hand and then teach them to think culminating in inter school competitions.",
    ageGroup: "Grades 6–12 & first/second year college",
    duration: "6–10 week module, workshop or semester format",
    format: "Hands on lab sessions with take home kits",
    topics: [
      "Robot design & mechanical assembly",
      "Programming logic & control systems",
      "Sensors, motors, and feedback loops",
      "Competition-ready builds and team challenges",
    ],
  },
];

export const partnerSchools = [
  { name: "Rato Bangala School", type: "School" },
  { name: "Kathmandu Model Secondary School", type: "School" },
  { name: "Ullens School", type: "School" },
  { name: "Gems International School", type: "School" },
  { name: "Little Angels' School", type: "School" },
  { name: "Malpi International School", type: "School" },
  { name: "Bal Mandir Higher Secondary", type: "School" },
  { name: "Trinity International School", type: "School" },
  { name: "Global Vision School", type: "School" },
  { name: "Sagarmatha Secondary School", type: "School" },
  { name: "St. Xavier's School, Jawalakhel", type: "School" },
  { name: "Deerwalk Institute of Technology", type: "College" },
  { name: "Kathmandu University", type: "College" },
  { name: "Pulchowk Campus, IOE", type: "College" },
  { name: "Patan Multiple Campus", type: "College" },
  { name: "Islington College", type: "College" },
];

export const testimonials = [
  {
    quote:
      "Our students built and demoed a working sensor project within three sessions. The trainers made complex ideas genuinely approachable.",
    name: "Academic Coordinator",
    org: "Partner School, Kathmandu",
  },
  {
    quote:
      "The robotics workshop gave our first-year students a reason to stay after class. Attendance for the optional sessions was near perfect.",
    name: "Department Head",
    org: "Partner College, Kathmandu",
  },
  {
    quote:
      "Parents noticed the difference immediately kids were coming home explaining circuits instead of just grades.",
    name: "Principal",
    org: "Partner School, Kathmandu",
  },
];

export const team = [
  {
    name: "Siddhartha Yadav",
    role: "Chief Executive Officer (CEO)",
    bio: "Leads Stem Innovation Nepal's partnerships and curriculum direction, working directly with schools and colleges to bring project-based STEM learning into Nepali classrooms.",
    lead: true,
  },
  {
    name: "IoT Program Lead",
    role: "Senior Trainer, IoT",
    bio: "Designs and delivers the IoT curriculum, from first-sensor labs to connected-device capstone projects.",
    lead: false,
  },
  {
    name: "Robotics Program Lead",
    role: "Senior Trainer, Robotics",
    bio: "Runs robotics labs and competition prep, mentoring student teams from chassis design through autonomous control.",
    lead: false,
  },
  {
    name: "Workshop Coordinator",
    role: "Partnerships & Logistics",
    bio: "Coordinates scheduling and on site logistics across 30+ partner schools and 10+ partner colleges.",
    lead: false,
  },
];

export const achievements = [
  {
    year: "2024",
    title: "Program Launch",
    description:
      "Stem Innovation Nepal begins delivering IoT and Robotics workshops to its first partner schools in Kathmandu.",
  },
  {
    year: "2024",
    title: "10 Schools Reached",
    description:
      "First ten school partnerships established, with in-classroom IoT sensor labs and beginner robotics kits.",
  },
  {
    year: "2025",
    title: "College Workshops Begin",
    description:
      "Programs expand into higher education, delivering IoT workshops across the first wave of partner colleges.",
  },
  {
    year: "2025",
    title: "30+ School Network",
    description:
      "Partner network grows past 30 schools across Kathmandu, alongside continued college-level workshops.",
  },
  {
    year: "2026",
    title: "10+ Colleges & Growing",
    description:
      "IoT workshops now delivered across 10+ colleges, with robotics competitions in planning for partner schools.",
  },
];

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

export type Partner = {
  name: string;
  type: "School" | "College";
  logo: string;
};

export const partnerSchools: Partner[] = [
  // Schools
  { name: "Siddhartha Vidyapith", type: "School", logo: "/images/siddharth.png" },
  { name: "Marvellous E.B.S", type: "School", logo: "/images/marvellous.png" },
  { name: "Rainbow E. Secondary School", type: "School", logo: "/images/rainbow.png" },
  { name: "Candid Career Secondary School", type: "School", logo: "/images/candid.png" },
  { name: "Jugal School", type: "School", logo: "/images/jugal.png" },
  { name: "Mega Public School", type: "School", logo: "/images/mega.png" },
  { name: "Rajan Memorial International School", type: "School", logo: "/images/rajan.png" },
  { name: "Prasiddha Model School", type: "School", logo: "/images/prasiddha.png" },
  { name: "North Valley English Secondary School", type: "School", logo: "/images/northvalley.png" },
  { name: "Jeevan Jyoti E.B.S", type: "School", logo: "/images/jeevan.png" },
  { name: "Pragati Adarsha English School", type: "School", logo: "/images/pragati.png" },
  { name: "Paradise School, Sanepa", type: "School", logo: "/images/paradise.png" },
  { name: "Tri-Star English Secondary School", type: "School", logo: "/images/triStar.png" },
  { name: "Himchuli Academy", type: "School", logo: "/images/himchuli.png" },
  { name: "Nirmal Jyoti English School", type: "School", logo: "/images/nirmalJyoti.png" },
  { name: "Mitra Pathasala", type: "School", logo: "/images/mitraPathsala.png" },
  { name: "Maitri School", type: "School", logo: "/images/maitri.png" },
  { name: "NCCS School", type: "School", logo: "/images/nccs.png" },
  { name: "Akshar Academy", type: "School", logo: "/images/akshar.png" },

  // Colleges
  { name: "Aryan School of Engineering and Management", type: "College", logo: "/images/aryan.png" },
  { name: "Nist College, Lainchaur", type: "College", logo: "/images/nist.png" },
  { name: "Universal College, Maitidevi", type: "College", logo: "/images/universal.png" },
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

export const galleryItems = [
  {
    id: "g1",
    image: "/images/g1.svg",
    caption: "IoT sensor lab, partner school workshop",
    category: "IoT",
  },
  {
    id: "g2",
    image: "/images/g2.svg",
    caption: "Robotics kit assembly, college workshop",
    category: "Robotics",
  },
  {
    id: "g3",
    image: "/images/g3.svg",
    caption: "Students demoing a connected-device prototype",
    category: "IoT",
  },
  {
    id: "g4",
    image: "/images/g4.svg",
    caption: "Robot navigation trial run",
    category: "Robotics",
  },
  {
    id: "g5",
    image: "/images/g5.svg",
    caption: "Trainer walkthrough, microcontroller wiring",
    category: "IoT",
  },
  {
    id: "g6",
    image: "/images/g6.svg",
    caption: "Inter-school robotics challenge",
    category: "Robotics",
  },
  {
    id: "g7",
    image: "/images/g7.svg",
    caption: "Campus visit and program briefing",
    category: "Visit",
  },
  {
    id: "g8",
    image: "/images/g8.svg",
    caption: "Students presenting final projects",
    category: "IoT",
  },
  {
    id: "g9",
    image: "/images/g9.svg",
    caption: "Robotics team, competition day",
    category: "Robotics",
  },
];

// NOTE FOR DEVELOPER: swap these placeholder SVGs in /public/images for real
// workshop photos from the client, then update the `image` paths above.
// Video embeds (e.g. YouTube) can be added per-item with an optional
// `video` field (embed URL) — render an <iframe> in place of the image
// when present.


export const services = [
  {
    slug: "steam-education",
    title: "STEAM Education (K–12)",
    description:
      "We offer a comprehensive STEAM curriculum aligned with international educational practices and adapted to local learning needs. Our programs emphasize experiential learning through real-world projects, design thinking, and interdisciplinary education.",
    tiers: [
      {
        label: "Class 1–4: Foundation STEAM",
        topics: [
          "Creative problem-solving",
          "Basic robotics",
          "Computational thinking",
          "Visual programming",
          "Science experiments",
          "Engineering design challenges",
        ],
      },
      {
        label: "Class 5–10: Intermediate STEAM",
        topics: [
          "IoT fundamentals",
          "Robotics and automation",
          "Python programming",
          "Artificial Intelligence fundamentals",
          "3D design and printing",
          "Electronics and embedded systems",
          "Project-based innovation",
        ],
      },
      {
        label: "Class 11–12: Advanced STEAM",
        topics: [
          "Advanced IoT systems",
          "Embedded systems",
          "Artificial Intelligence and Machine Learning",
          "Product development",
          "Engineering design",
          "Research and innovation projects",
          "Industry-oriented capstone projects",
        ],
      },
    ],
  },
  {
    slug: "app-web-development",
    title: "App and Web Development Training",
    description:
      "Our software development programs equip learners with practical skills to design, develop, and deploy modern digital applications.",
    topics: [
      "Website Development",
      "Frontend Development",
      "Backend Development",
      "Mobile App Development",
      "UI/UX Design Fundamentals",
      "Database Management",
      "API Integration",
      "Deployment and Cloud Fundamentals",
    ],
  },
  {
    slug: "iot-robotics",
    title: "IoT and Robotics Training",
    description:
      "Our IoT and Robotics programs provide hands-on experience in designing intelligent systems using modern hardware and software platforms.",
    topics: [
      "Arduino Programming",
      "ESP32 Development",
      "Raspberry Pi Applications",
      "Embedded Systems",
      "Robotics Design",
      "Sensors and Actuators",
      "Wireless Communication",
      "Automation Systems",
      "Smart Home Solutions",
      "Industrial IoT",
      "AI-enabled Robotics",
    ],
    note: "Participants build real-world projects that strengthen their engineering, programming, and innovation skills.",
  },
  {
    slug: "smart-hospitality",
    title: "Smart Hospitality Training",
    description:
      "Designed specifically for Hotel Management (HM) students, this program introduces emerging technologies transforming the hospitality industry.",
    topics: [
      "Smart Hotel Technologies",
      "IoT in Hospitality",
      "Hotel Automation Systems",
      "AI Applications in Hospitality",
      "Digital Guest Experience",
      "Smart Room Management",
      "Contactless Technologies",
      "Hospitality Innovation",
      "Future Hospitality Trends",
    ],
    note: "The program prepares students to meet the evolving demands of the global hospitality sector through technology-driven solutions.",
  },
  {
    slug: "digital-fabrication",
    title: "Digital Fabrication & Innovation Lab",
    description:
      "We provide practical training using modern fabrication technologies that transform ideas into functional prototypes.",
    topics: [
      "3D Printing",
      "3D Modeling and CAD Design",
      "Laser Cutting and Engraving",
      "Rapid Prototyping",
      "Product Design",
      "Prototype Development",
      "Digital Manufacturing",
      "Maker Education",
    ],
  },
];

export const whyChooseUs = [
  "Project-Based Learning Approach",
  "Industry-Relevant Curriculum",
  "Experienced Trainers and Mentors",
  "Hands-On Practical Sessions",
  "Modern Laboratory and Equipment",
  "Innovation and Entrepreneurship Focus",
  "Future-Ready Digital Skills",
  "Customized Training for Schools, Colleges, and Organizations",
  "Research and Product Development Support",
];
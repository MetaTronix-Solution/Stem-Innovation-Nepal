import HeroCanvas from "@/components/ThreeJs";

export default function Hero() {
  return (
    <main className="min-h-full">
      <section className="relative flex h-[110vh] items-center justify-center overflow-hidden bg-navy">
        {/* Background animation — sits behind, lowest z-index, first in DOM */}
        <HeroCanvas className="absolute inset-0 z-0" />

        {/* Foreground content — sits above the canvas */}
        <div className="relative z-10 pointer-events-none text-center">
          <h1 className="text-5xl font-bold text-white">
            STEM Innovation Nepal
          </h1>

          <p className="mt-4 text-lg text-gray-300">
            Empowering students through IoT & Robotics Education
          </p>

          {/* If you add buttons/links, re-enable pointer events on them: */}
          {/* <button className="pointer-events-auto mt-6 ...">Get Started</button> */}
        </div>
      </section>
    </main>
  );
}

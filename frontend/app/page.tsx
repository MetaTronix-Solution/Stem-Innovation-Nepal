import Hero from "@/components/home/Hero";
import Achievements from "./achievements/page";
import TeamSection from "./team/page";



export default function Home() {
  return (
    <>
    <main>
      <Hero />
      <Achievements />
      <TeamSection />
    </main>
    </>
  )
}
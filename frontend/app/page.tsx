import Hero from "@/components/home/Hero";
import Navbar from "@/components/layout/Navbar";
import Contact from "./contact/page";


export default function Home() {
  return (
    <>
    <Navbar />
    <main>
      <Hero />
      <Contact />
    </main>


    </>
  )
}
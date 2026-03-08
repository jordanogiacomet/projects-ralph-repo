import Hero from "@/components/Hero";
import About from "@/components/About";
import Process from "@/components/Process";
import Skills from "@/components/Skills";
import Projects from "@/components/Projects";
import SocialPosts from "@/components/SocialPosts";
import Experience from "@/components/Experience";
import Certifications from "@/components/Certifications";

import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Process />
      <Skills />
      <Projects />
      <SocialPosts />
      <Experience />
      <Certifications />
      <FAQ />
      <Contact />
    </>
  );
}

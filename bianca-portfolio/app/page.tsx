import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import About from "@/components/About";

const Process = dynamic(() => import("@/components/Process"));
const Skills = dynamic(() => import("@/components/Skills"));
const Projects = dynamic(() => import("@/components/Projects"));
const SocialPosts = dynamic(() => import("@/components/SocialPosts"));
const Experience = dynamic(() => import("@/components/Experience"));
const Certifications = dynamic(() => import("@/components/Certifications"));
const FAQ = dynamic(() => import("@/components/FAQ"));
const Contact = dynamic(() => import("@/components/Contact"));

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

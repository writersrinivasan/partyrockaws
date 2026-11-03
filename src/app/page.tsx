import { Assistant } from "@/components/Assistant";
import { Infographics } from "@/components/Infographics";
import { Footer, Hero, Innovate, Models, Nav, Verdict } from "@/components/Sections";
import { Workflow } from "@/components/Workflow";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Models />
        <Innovate />
        <Workflow />
        <Infographics />
        <Verdict />
        <Assistant />
      </main>
      <Footer />
    </>
  );
}

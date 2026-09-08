import { Hero } from "@/components/Hero";
import { Problem } from "@/components/Problem";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { WhyUs } from "@/components/WhyUs";
import { Pricing } from "@/components/Pricing";
import { Faq } from "@/components/Faq";
import { GetStarted } from "@/components/GetStarted";

export default function Home() {
  return (
    <>
      <Hero />
      <Problem />
      <HowItWorks />
      <Features />
      <WhyUs />
      <Pricing />
      <Faq />
      <GetStarted />
    </>
  );
}

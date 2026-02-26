import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import HowItWorksHero from "../components/howitworks/HowItWorksHero";
import StepsSection from "../components/howitworks/StepsSection";

export default function HowItWorks() {
  return (
    <>
      <Navbar />
      <HowItWorksHero />
      <StepsSection />
      <Footer />
    </>
  );
}
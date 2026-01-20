import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import WhySaarathi from "../components/WhySaarathi";
import WhoIsSaarathiFor from "../components/WhoIsSaarathiFor";
import WhatYouGet from "../components/WhatYouGet";
import StudentLetter from "../components/StudentLetter";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <WhySaarathi />
      <WhoIsSaarathiFor />
      <WhatYouGet />
      <StudentLetter />
      <FinalCTA />
      <Footer />
    </>
  );
}

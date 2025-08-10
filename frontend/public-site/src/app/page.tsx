import Navbar from "@/components/navbar";
import Hero from "@/components/hero";
import Countdown from "@/components/Countdown";
import StatsCounter from "@/components/StatsCounter";
import RecentSermons from "@/components/RecentSermons";
import ChurchTV from "@/components/ChurchTv"
import AboutUs from "@/components/AboutUs"
import Testimonials from "@/components/Testimonials"
import CalloutBanner from "@/components/CalloutBanner"
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
      <Countdown />
      <StatsCounter />
      <RecentSermons />
      <ChurchTV />
      <AboutUs />
      <Testimonials />
      <CalloutBanner />
      <Footer />
    </>
  );
}

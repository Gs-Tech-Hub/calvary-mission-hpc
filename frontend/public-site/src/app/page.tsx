import Hero from "@/components/heros";
import Countdown from "@/components/Countdown";
// import StatsCounter from "@/components/StatsCounter";
import RecentSermons from "@/components/RecentSermons";
// import ChurchTV from "@/components/ChurchTv"
// import AboutUs from "@/components/AboutUs"
// import Testimonials from "@/components/Testimonials"
import CalloutBanner from "@/components/CalloutBanner"
import Footer from "@/components/footer"
import { org } from "@/lib/org";
import Script from "next/script";

export default function HomePage() {
  return (
    <>
      <Script
        id="ld-json-org"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: org.name,
            url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            logo: org.logo,
            email: org.email,
            telephone: org.phone,
            address: {
              "@type": "PostalAddress",
              streetAddress: org.address,
              addressCountry: "NG",
            },
            sameAs: [
              org.socials.facebook,
              org.socials.instagram,
              org.socials.youtube,
            ].filter(Boolean),
          }),
        }}
      />
      <Hero />
      <Countdown />
      {/* <StatsCounter /> */}
      <RecentSermons />
      {/* <ChurchTV /> */}
      {/* <AboutUs /> */}
      {/* <Testimonials /> */}
      <CalloutBanner />
      <Footer />
    </>
  );
}

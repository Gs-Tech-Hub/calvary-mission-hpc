import Navbar from "@/components/navbar";
import SermonsEventsPage from "@/app/sermons/sermon";
import Footer from "@/components/footer"

export default function HomePage() {
  return (
    <>
      <Navbar />
      <SermonsEventsPage />
      <Footer />
    </>
  );
}
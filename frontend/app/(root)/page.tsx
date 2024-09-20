import Hero from "@/components/Hero";
import Navbar from "@/components/MyNavbar";
import Footer from "@/components/Footer";
import Feature from "@/components/Feature";
import Team from "@/components/Team";

export default function Home() {
  return (
      <div>
        <Navbar/>
        <Hero/>
        <Feature/>
        <Team/>
        <Footer/>
      </div>
  );
}

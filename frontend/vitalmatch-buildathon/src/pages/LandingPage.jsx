import Header from "../components/Header";
import FeaturesSection from "../components/FeaturesSection";
import MissionSection from "../components/MissionSection";
import BuildingTrust from "../components/BuildingTrust";
import FAQs from "../components/FAQs";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

function LandingPage() {
  return (
        <div className="bg-[#07052C]">
            <div className="text-white lg:min-h-screen min-h-1/2 w-full overflow-x-hidden">
                <Header />
                <HeroSection />
            </div>
        <FeaturesSection />
        <MissionSection />
        <BuildingTrust />
        <FAQs />
        <Footer />
    </div>
  );
}

export default LandingPage;
import Header from "../components/Header";
import FeaturesSection from "../components/FeaturesSection";
import MissionSection from "../components/MissionSection";
import BuildingTrust from "../components/BuildingTrust";
import FAQs from "../components/FAQs";
import Footer from "../components/Footer";

function LandingPage() {
  return (
        <div className="bg-[#07052C]">
            <div className="text-white lg:min-h-screen min-h-1/2 w-full overflow-x-hidden">
            <Header />

            <main className="flex flex-col-reverse md:flex-row items-center mt-20 justify-between px-6 md:px-12 py-24 md:py-20">
                
                {/* Left Column: Text Content */}
                <div className="md:w-3/5 z-10 relative text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.15] tracking-tight mb-6 uppercase text-white shadow-sm">
                        Every second counts.<br />
                        Connect the right donors to patients who need them most.
                    </h1>
                    
                    <p className="text-white text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
                        VitalMatch is a hospital verified '2blood matching platform that connects the right donors to the right patient intelligently and real time. No delays, no guesswork. Just fast trusted blood access when lives depend on it.
                    </p>
                    
                    <button className="px-10 py-4 text-lg font-semibold text-white bg-[#3B82F6] hover:bg-blue-600 rounded-full shadow-lg shadow-blue-500/30 transition-all hover:scale-105">
                        Get Started
                    </button>
                </div>

                <div className="md:w-2/5 mt-0 md:mt-0 relative flex justify-center items-center">
                <div className="relative w-full max-w-100 aspect-square">
                    <svg 
                    viewBox="0 0 200 200" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-2xl"
                    >
                    {/* Top Left Drop/Pin */}
                    <g transform="translate(10, -10) rotate(-15 50 50)">
                        <path 
                            d="M50 10C27.9086 10 10 27.9086 10 50C10 75 50 120 50 120C50 120 90 75 90 50C90 27.9086 72.0914 10 50 10Z" 
                            fill="#e60023"
                        />
                        <path 
                            d="M50 10C27.9086 10 10 27.9086 10 50C10 75 50 120 50 120C50 120 50 75 50 50C50 27.9086 72.0914 10 50 10Z" 
                            fill="#c0001a" 
                            opacity="0.3"
                        />
                    </g>

                    {/* Top Right Drop/Pin */}
                    <g transform="translate(90, 0) rotate(15 50 50)">
                        <path 
                            d="M50 10C27.9086 10 10 27.9086 10 50C10 75 50 120 50 120C50 120 90 75 90 50C90 27.9086 72.0914 10 50 10Z" 
                            fill="#e60023"
                        />
                        <path 
                            d="M50 10C27.9086 10 10 27.9086 10 50C10 75 50 120 50 120C50 120 50 75 50 50C50 27.9086 72.0914 10 50 10Z" 
                            fill="#c0001a" 
                            opacity="0.3"
                        />
                    </g>

                    {/* Bottom Center Drop/Pin (Overlapping) */}
                    <g transform="translate(45, 60) scale(1.1)">
                        <path 
                            d="M50 10C27.9086 10 10 27.9086 10 50C10 75 50 120 50 120C50 120 90 75 90 50C90 27.9086 72.0914 10 50 10Z" 
                            fill="#f00020"
                        />
                        {/* 3D shading effect on the right side of the pin */}
                        <path 
                            d="M50 10C27.9086 10 10 27.9086 10 50C10 75 50 120 50 120C50 120 90 75 90 50C90 27.9086 72.0914 10 50 10Z" 
                            fill="#a30015" 
                            clipPath="polygon(50% 0, 100% 0, 100% 100%, 80% 100%)"
                            opacity="0.4"
                        />
                    </g>
                    </svg>
                </div>
                </div>
            </main>
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
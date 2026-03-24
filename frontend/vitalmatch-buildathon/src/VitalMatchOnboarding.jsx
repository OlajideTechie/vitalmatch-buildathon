import { Link } from "react-router-dom";
import { Hospital, Droplet } from "lucide-react";
import VitalMatchLogo from "./assets/vitalmatch-logo.png";
import { useState } from "react";

function VitalMatchOnboarding() {
  const [selectedPath, setSelectedPath] = useState('hospital');

  return (
    <div className="flex min-h-screen w-full font-sans">
          <div className="hidden lg:flex w-[40%] bg-[#07052C] p-12 flex-col justify-between text-white">
            <div>
              <div className="cursor-pointer flex items-center mb-6">
                <img src={VitalMatchLogo} alt="vitalmatch-logo" className="h-14 w-20" />
              </div>
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Let's Get You<br />Started!
              </h1>
              <p className="text-gray-300 text-sm leading-relaxed max-w-md">
                Join thousands of hospitals and donors making blood access faster, safer, and more transparent. Whether you’re a hospital looking to save critical time in emergencies or a blood donor ready to make real difference, VitalMatch makes it simple to start saving lives today.
              </p>
            </div>
          </div>

          {/* Right Pane - Form */}
          <div className="w-full lg:w-[60%] md:p-12 p-10 flex flex-col justify-between bg-white">
            <div>
              <h2 className="text-[2rem] font-bold text-[#0A0A0A] mb-4 tracking-tight">
                Choose Your Path Below!
              </h2>
              <p className="text-[#434248] text-[15px] leading-relaxed">
                Just smart technology connecting the right people at the right time. Your journey to making an impact starts with a single click. Choose your path below and be part of the solution.
              </p>
            </div>

              {/* Cards Container */}
            <div className="space-y-5">
            
                <Link
                  to="/hospital-register"
                  onMouseOver={() => setSelectedPath('hospital')}
                  className={`w-full text-left flex items-center p-5 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                    selectedPath === 'hospital'
                      ? 'border-blue-400 bg-white shadow-sm'
                      : 'border-transparent bg-[#f8fafc] hover:bg-slate-100'
                  }`}
                >
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm shrink-0">
                    {/* Lucide Hospital Icon */}
                    <Hospital className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                  </div>
                  <button className="ml-5 text-left">
                    <h3 className="text-lg font-bold text-[#1C1C1C]">Hospital Portal</h3>
                    <p className="text-sm text-[#1C1C1C] font-medium mt-0.5">For verified healthcare facilities</p>
                  </button>
                </Link>

                {/* Become a Donor Card */}
                <Link
                  to="/donor-register"
                  onMouseOver={() => setSelectedPath('donor')}
                  className={`w-full text-left flex items-center p-5 rounded-xl border-2 transition-all duration-200 focus:outline-none ${
                    selectedPath === 'donor'
                      ? 'border-[#648db5] bg-white shadow-sm'
                      : 'border-transparent bg-[#f8fafc] hover:bg-slate-100'
                  }`}
                >
                  <div className="bg-white p-3 rounded-lg border border-gray-100 shadow-sm shrink-0">
                    {/* Lucide Droplet Icon */}
                    <Droplet className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
                  </div>
                  <button className="ml-5 text-left">
                    <h3 className="text-lg font-bold text-[#1C1C1C]">Become a Donor</h3>
                    <p className="text-sm text-[#1C1C1C] font-medium mt-0.5">For anyone ready to save lives</p>
                  </button>
                </Link>
            </div>
            <div className="text-sm font-medium">
              <p className="mb-2 text-[#1C1C1C]">
                Already have an account? <Link to="/login" className="text-[#3B82F6] hover:underline">Sign in</Link>
              </p>
              <a href="#" className="text-[#3B82F6] hover:underline">Need Help</a>
            </div>
        </div>
    </div>
  );
};

export default VitalMatchOnboarding;
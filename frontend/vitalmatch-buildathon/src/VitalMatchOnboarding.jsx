import { Link } from "react-router-dom";
import { Hospital, Droplet } from "lucide-react";
import { useState } from "react";

function VitalMatchOnboarding() {
  const [selectedPath, setSelectedPath] = useState('donor');

  return (
    <div className="flex min-h-screen w-full font-sans">
      <div className="hidden lg:flex w-1/2 bg-[#0A0A1F] p-12 flex-col justify-between text-white">
        <div>
          <div className="text-[#C84A4A] font-bold text-lg mb-20">
            VitalMatch
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Let's Get You<br />Started!
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md">
            Join thousands of hospitals and donors making blood access faster, safer, and more transparent. Whether you're a hospital looking to save critical time in emergencies or a blood donor ready to make real difference, BloodConnect makes it simple to start saving lives today
          </p>
        </div>
        
        <div className="text-sm font-medium">
          <p className="mb-2">
            Already have an account? <a href="#" className="text-[#C84A4A] hover:underline">Sign in</a>
          </p>
          <a href="#" className="text-[#C84A4A] hover:underline">Need Help</a>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-[2rem] font-bold text-gray-900 mb-4 tracking-tight">
            Choose Your Path Below!
          </h2>
          <p className="text-gray-500 text-[15px] leading-relaxed mb-10">
            Just smart technology connecting the right people at the right time. Your journey to making an impact starts with a single click. Choose your path below and be part of the solution.
          </p>

          {/* Cards Container */}
          <div className="space-y-5">
            
            <Link
              to="/hospital-register"
              onClick={() => setSelectedPath('hospital')}
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
              <button className="ml-5">
                <h3 className="text-lg font-bold text-gray-900">Hospital Portal</h3>
                <p className="text-sm text-gray-500 font-medium mt-0.5">For verified healthcare facilities</p>
              </button>
            </Link>

            {/* Become a Donor Card */}
            <Link
              to="/donor-register"
              onClick={() => setSelectedPath('donor')}
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
              <button className="ml-5">
                <h3 className="text-lg font-bold text-gray-900">Become a Donor</h3>
                <p className="text-sm text-gray-500 font-medium mt-0.5">For anyone ready to save lives</p>
              </button>
            </Link>
          </div>
        </div>

        
        {/* <div className="mt-16 md:absolute md:bottom-12 md:right-16 flex flex-col items-start md:items-start text-[14px]">
          <p className="text-gray-800 font-medium mb-2">
            Already have an account? <a href="#" className="text-[#5b80a5] hover:underline hover:text-blue-700 ml-1">Sign in</a>
          </p>
          <a href="#" className="text-[#5b80a5] hover:underline hover:text-blue-700 font-medium">Need Help</a>
        </div> */}
        </div>
    </div>
  );
};

export default VitalMatchOnboarding;
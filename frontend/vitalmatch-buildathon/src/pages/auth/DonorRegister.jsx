import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

function DonorRegister() {
  const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');

  const bloodGroups = ['A+', 'O+', 'B+', 'O-', 'A-', 'AB', 'B-'];

  return (
    <div className="flex min-h-screen w-full font-sans">
      {/* Left Pane - Branding & Info */}
      <div className="hidden lg:flex w-1/2 bg-[#0A0A1F] p-12 flex-col justify-between text-white">
        <div>
          <div className="text-[#C84A4A] font-bold text-lg mb-20">
            VitalMatch
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Let's Get You<br />Started!
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md">
            Join thousands of hospitals and donors making blood access faster, safer, and more transparent. Whether you're a hospital looking to save critical time in emergencies or a blood donor ready to make real difference, VitalMatch makes it simple to start saving lives today
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
        <div className="text-[#C84A4A] font-bold text-lg mb-10 md:hidden">
            BloodConnect
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete your profile</h2>
          <p className="text-gray-500 text-sm mb-8">
            Let's finish setting up your donor account. This information helps us send you the right requests at the right time.
          </p>

          <form className="space-y-4 relative">
            {/* Standard Text Input */}
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full border border-gray-200 rounded-lg p-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />

            {/* Native Select disguised as input */}
            <div className="relative">
              <select 
                className="w-full border border-gray-200 rounded-lg p-3.5 text-sm text-gray-400 appearance-none focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
                defaultValue=""
              >
                <option value="" disabled>Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Custom Dropdown (Blood Group - matching screenshot) */}
            {/* Custom Dropdown (Blood Group) */}
            <div className="relative">
                <div 
                onClick={() => setIsBloodGroupOpen(!isBloodGroupOpen)}
                className="w-full border border-gray-200 rounded-lg p-3.5 text-sm text-gray-400 flex justify-between items-center cursor-pointer bg-white"
                >
                <span className={selectedBloodGroup ? "text-gray-700" : ""}>
                    {selectedBloodGroup || 'Blood Group'}
                </span>
                {isBloodGroupOpen ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
                </div>

                {isBloodGroupOpen && (
                <div className="absolute left-0 right-0 top-[110%] bg-[#F7F9FC] rounded-2xl shadow-xl z-10 py-2 border border-gray-50 max-h-48 overflow-y-auto">
                    {bloodGroups.map((group) => (
                    <div 
                        key={group}
                        onClick={(prev) => {
                        setSelectedBloodGroup(group);
                        setIsBloodGroupOpen(!prev);
                        }}
                        className="px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-200 cursor-pointer transition-colors mx-2 rounded-lg"
                    >
                        {group}
                    </div>
                    ))}
                </div>
                )}
            </div>

            {/* Remaining Inputs */}
            <div className="relative">
              <select 
                className="w-full border border-gray-200 rounded-lg p-3.5 text-sm text-gray-400 appearance-none focus:outline-none focus:ring-1 focus:ring-gray-300 bg-white"
                defaultValue=""
              >
                <option value="" disabled>Have You Ever Donated?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            <input 
              type="text" 
              placeholder="State" 
              className="w-full border border-gray-200 rounded-lg p-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />

            <input 
              type="text" 
              placeholder="Address" 
              className="w-full border border-gray-200 rounded-lg p-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />

            {/* Submit Button */}
            <div className="pt-4">
              <button 
                type="button" 
                className="w-full bg-[#E6E8EB] text-gray-800 font-semibold rounded-full py-4 mt-2 hover:bg-gray-300 transition-colors"
              >
                Continue
              </button>
            </div>
            <div className="text-sm font-medium mt-2 md:hidden">
                <p className="mb-2">
                    Already have an account? <a href="#" className="text-[#C84A4A] hover:underline">Sign in</a>
                </p>
                <a href="#" className="text-[#C84A4A] hover:underline">Need Help</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DonorRegister;
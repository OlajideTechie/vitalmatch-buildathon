import { 
  FilePlus2, 
  Target, 
  ShieldCheck, 
  UserPlus, 
  Bell, 
  Activity 
} from 'lucide-react';

function MissionSection() {
  return (
    <div className="p-6 flex items-center justify-center font-sans">
      {/* Main Container */}
      <div className="max-w-6xl w-full bg-[#121137] rounded-3xl p-10 md:p-10">
        
        {/* Header Section */}
        <div className="mb-14 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-wide">
            Two Journeys, ONE MISSION - SAVING LIVES
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Whether you're a hospital in urgent need or a donor ready to help, VitalMatch removes the guesswork from blood matching. Our intelligent platform handles the complexity—proximity, compatibility, availability—so you can focus on what matters: saving lives.
          </p>
        </div>

        {/* Two Column Grid */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-20">
          
          {/* Left Column - For Hospital */}
          <div className="space-y-8">
            <span className="inline-block px-5 py-2 bg-[#fbd5d5] text-red-900 text-sm font-bold uppercase tracking-wider rounded-md mb-4">
              For Hospital
            </span>

            <FeatureItem 
              icon={<FilePlus2 className="w-6 h-6 text-red-500" />}
              title="Create a Blood Request"
              description="Hospital creates a verified request with blood type, units needed, and urgency level. The system immediately begins searching for compatible donors."
            />
            
            <FeatureItem 
              icon={<Target className="w-6 h-6 text-red-500" />}
              title="Get Instant Matches"
              description="Our smart algorithm finds compatible, nearby, and available donors in seconds. View details distance, availability, and compatibility."
            />
            
            <FeatureItem 
              icon={<ShieldCheck className="w-6 h-6 text-red-500" />}
              title="Connect & Save Lives"
              description="Matched donors receive instant notifications. When they accept, you get their contact details to coordinate the donation."
            />
          </div>

          {/* Right Column - For Donor */}
          <div className="space-y-8">
            <span className="inline-block px-5 py-2 bg-[#bbf7d0] text-green-900 text-sm font-bold uppercase tracking-wider rounded-md mb-4">
              For Donor
            </span>

            <FeatureItem 
              icon={<UserPlus className="w-6 h-6 text-emerald-400" />}
              title="Sign up & stay ready"
              description="Register with blood type and location. Update availability anytime to control when you receive requests."
            />
            
            <FeatureItem 
              icon={<Bell className="w-6 h-6 text-emerald-400" />}
              title="Receive Match Alerts"
              description="Get instant notifications when nearby hospitals need your blood type. See distance, urgency, hospital details."
            />
            
            <FeatureItem 
              icon={<Activity className="w-6 h-6 text-emerald-400" />}
              title="Accept & Save Lives"
              description="Choose to accept or decline. Accept, and the hospital contacts you directly. You are in full control."
            />
          </div>

        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, description }) => {
  return (
    <div className="flex gap-4 items-start">
      <div className="mt-1 shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2 tracking-wide">
          {title}
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed pr-4">
          {description}
        </p>
      </div>
    </div>
  );
};

export default MissionSection;
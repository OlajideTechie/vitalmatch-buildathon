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
    <div id="how-it-works" className="p-6 flex items-center justify-center font-sans">
      {/* Main Container */}
      <div className="max-w-6xl w-full bg-[#121137] rounded-3xl p-10 md:p-10">
        
        {/* Header Section */}
        <div className="mb-14 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 uppercase tracking-wide">
            Two Journeys, ONE MISSION - SAVING LIVES
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            VitalMatch makes it easy for hospitals to get help and for donors to respond quickly.
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
              description="Enter key details and submit in seconds."
            />
            
            <FeatureItem 
              icon={<Target className="w-6 h-6 text-red-500" />}
              title="Get Instant Matches"
              description="The system finds nearby and reliable donors fast."
            />
            
            <FeatureItem 
              icon={<ShieldCheck className="w-6 h-6 text-red-500" />}
              title="Connect & Save Lives"
              description="Once a donor accepts, you move forward immediately."
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
              description="Register and update your availability anytime."
            />
            
            <FeatureItem 
              icon={<Bell className="w-6 h-6 text-emerald-400" />}
              title="Receive Match Alerts"
              description="Get notified when your blood type is needed nearby."
            />
            
            <FeatureItem 
              icon={<Activity className="w-6 h-6 text-emerald-400" />}
              title="Accept & Save Lives"
              description="Choose to respond and make a real impact."
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
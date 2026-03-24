import FirstSymbol from "../assets/IMG-20260324-WA0002-removebg-preview.png";
import SecondSymbol from "../assets/IMG-20260324-WA0004-removebg-preview.png";
import ThirdSymbol from "../assets/IMG-20260324-WA0003-removebg-preview.png";


function FeaturesSection() {
  const features = [
    {
      bgColor: 'bg-[#B8E5DD]',
      title: 'Smart Donor Matching',
      uppercaseTitle: true,
      description: 'We match the right donors instantly using blood type, location, and reliability.',
      imageUrl: FirstSymbol
    },
    {
      bgColor: 'bg-[#CEDBFD]',
      title: 'Availability Tracking',
      uppercaseTitle: true,
      description: "Donors control their status so hospitals reach people who are ready to respond.",
      imageUrl: SecondSymbol
    },
    {
      bgColor: 'bg-[#FFCCCC]',
      title: 'Emergency Aware Priority', 
      uppercaseTitle: true,
      description: 'Urgent requests are pushed first so critical cases get faster attention.',
      imageUrl: ThirdSymbol
    }
  ];

  return (
    <section className="py-10 px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-semibold mb-4 tracking-tight">
            Why Hospitals Choose VitalMatch
          </h2>
          <p className="text-gray-300 text-sm sm:text-base md:text-lg">
            Designed to save time, improve response, and deliver results when it matters most.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              bgColor={feature.bgColor}
              imageUrl={feature.imageUrl}
              title={feature.title}
              uppercaseTitle={feature.uppercaseTitle}
              description={feature.description}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

const FeatureCard = (props) => {
  return (
    <div className={`${props.bgColor} rounded-2xl p-8 flex flex-col items-center text-center h-full transition-transform duration-300 hover:-translate-y-1`}>
      <div className="mb-6 h-24 w-24 shrink-0 flex items-center justify-center">
        <img src={props.imageUrl} />
      </div>
      <h3 className={`text-[#0E1C37] font-bold text-[32px] mb-4 sm:text-left sm:items-start ${props.uppercaseTitle ? 'uppercase' : ''}`}>
        {props.title}
      </h3>
      <p className="text-[#434248] text-sm sm:items-start sm:text-left leading-relaxed">
        {props.description}
      </p>
    </div>
  );
};

export default FeaturesSection;
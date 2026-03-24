import Image from "../assets/99cd94c4c656cfcac3a6022b53ee9ba15ba0b5d6 (1).jpg"

export default function BuildingTrust() {
  return (
    <div className="py-10 px-6 lg:px-8 flex items-center justify-center">
      <div className="bg-white  w-full rounded-2xl flex flex-col-reverse md:flex-row gap-6">

        {/* Content Section */}
        <div className="md:w-1/2 w-full flex flex-col justify-center md:text-left text-center md:py-8 md:px-16 p-6 pb-0">

          <h2 className="text-2xl md:text-3xl font-bold text-[#0E1C37] leading-snug mb-4">
            Building Trust in Every Drop
          </h2>

          <p className="text-[#434248] mb-6 text-sm md:text-base">
            VitalMatch connects verified hospitals with real donors. Every match is based on accuracy, speed, and availability. Built for real emergencies, the system removes delays and helps hospitals act fast. Saving lives starts with the right connection.
          </p>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 w-full md:py-8 md:px-16 p-6 pb-0">
          <img
            src={Image}
            alt="Blood Donation"
            className="w-full h-full object-cover rounded-2xl"
          />
        </div>
      </div>
    </div>
  );
}
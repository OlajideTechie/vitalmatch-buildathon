import Image from "../assets/99cd94c4c656cfcac3a6022b53ee9ba15ba0b5d6 (1).jpg"

export default function BuildingTrust() {
  return (
    <div className="py-10 px-6 lg:px-8 flex items-center justify-center">
      <div className="bg-white  w-full rounded-2xl flex flex-col-reverse md:flex-row gap-6">

        {/* Content Section */}
        <div className="md:w-1/2 w-full flex flex-col justify-center md:py-8 md:px-16 p-4 pb-0">

          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-4">
            Building Trust in Every Drop
          </h2>

          <p className="text-gray-700 mb-6 text-sm md:text-base">
            VitalMatch is a hospital-verified blood matching platform built on a simple belief: access to blood shouldn't depend on luck or connections. We connect verified hospitals with compatible, nearby donors through intelligent matching technology that's transparent, explainable, and privacyfirst. Every feature is designed with one goal in mindgetting the right blood to the right patient when every second counts. Created with real-world constraints in mind, VitalMatch prioritizes trust over visibility, clarity over complexity, and impact over features. Because saving lives isn't about having the most toolsit's about having the right ones.
          </p>
        </div>

        {/* Image Section */}
        <div className="md:w-1/2 w-full md:py-8 md:px-16 p-4 pb-0">
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
import React from 'react';
import { ShieldPlus, Activity, Utensils, Ticket, Star } from 'lucide-react';

// --- Data ---
const rewardsData = [
  {
    id: 1,
    title: 'Health Insurance Voucher',
    description: '₦10,000 insurance credit',
    category: 'Health',
    availability: 'Available',
    points: 5,
    icon: ShieldPlus,
  },
  {
    id: 2,
    title: 'Free Health Checkup',
    description: 'Full Medical exmination',
    category: 'Health',
    availability: 'Limited - 3 slot left',
    points: 5,
    icon: Activity,
  },
  {
    id: 3,
    title: 'Restaurant Voucher',
    description: '₦10,000 dining credit',
    category: 'Lifestyle',
    availability: 'Available',
    points: 5,
    icon: Utensils,
  },
  {
    id: 4,
    title: 'Movie Ticket (2)',
    description: 'Any filmhouse cinema',
    category: 'Lifestyle',
    availability: 'Available',
    points: 5,
    icon: Ticket,
  },
];

// --- Sub-component for individual reward cards ---
const RewardCard = ({ reward }) => {
  const Icon = reward.icon;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow gap-4">
      
      {/* Left Section: Icon & Details */}
      <div className="flex gap-5">
        <div className="bg-gray-100/80 p-3 rounded-xl h-fit">
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
        
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-bold text-gray-900 text-base">{reward.title}</h3>
          <p className="text-xs font-medium text-gray-500">{reward.description}</p>
          
          {/* Tags */}
          <div className="flex items-center gap-3 pt-1 pb-1">
            <span
              className={`px-3 py-1 rounded-md text-[11px] font-bold ${
                reward.category === 'Health'
                  ? 'bg-green-100/70 text-green-700'
                  : 'bg-blue-100/70 text-blue-600'
              }`}
            >
              {reward.category}
            </span>
            <span
              className={`text-[11px] font-bold ${
                reward.availability === 'Available'
                  ? 'text-green-600'
                  : 'text-amber-500'
              }`}
            >
              {reward.availability}
            </span>
          </div>

          {/* Points */}
          <div className="flex items-center gap-1 font-bold text-gray-900 text-sm pt-1">
            {reward.points} Pts
            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Right Section: Button */}
      <button className="w-full sm:w-auto bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold text-sm px-8 py-2.5 rounded-full transition-colors mt-2 sm:mt-0">
        Redeem Now
      </button>
    </div>
  );
};

// --- Main Page Component ---
export default function RewardPage() {
  return (
    <div className="text-gray-900 font-sans p-6 md:p-10 w-full">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Reward Vault</h1>
          <p className="text-sm font-medium text-gray-500 mt-1">
            Redeem your points for exclusive rewards and benefits
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-[#E5F2FF80] rounded-2xl p-6 w-full max-w-[340px]">
          <h2 className="text-sm font-bold text-gray-900 mb-2">Your Point Balance</h2>
          <div className="flex items-center gap-1 mb-1.5">
            <span className="text-2xl font-extrabold mr-1">5 Points</span>
            {/* Render 5 Stars */}
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          <p className="text-[11px] font-medium text-gray-400">
            Earned from 10 donations
          </p>
        </div>

        {/* Rewards List */}
        <div className="flex flex-col space-y-4">
          {rewardsData.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
        
      </div>
    </div>
  );
}
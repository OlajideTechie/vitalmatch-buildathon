import { Heart, Stethoscope, UtensilsCrossed, Film } from "lucide-react";
import PointBalance from "../../components/PointBalance";
import RewardCard from "../../components/RewardCard";

const rewards = [
  {
    icon: <Stethoscope className="w-5 h-5" />,
    title: "Health Insurance Voucher",
    description: "₦10,000 Insurance credit",
    category: "Health",
    availability: "Available",
    points: 5,
  },
  {
    icon: <Heart className="w-5 h-5" />,
    title: "Free Health Checkup",
    description: "Full Medical examination",
    category: "Health",
    availability: "Limited - 3 slot left",
    isLimited: true,
    points: 5,
  },
  {
    icon: <UtensilsCrossed className="w-5 h-5" />,
    title: "Restaurant Voucher",
    description: "₦10,000 dining credit",
    category: "Lifestyle",
    availability: "Available",
    points: 5,
  },
  {
    icon: <Film className="w-5 h-5" />,
    title: "Movie Ticket (2)",
    description: "Any filmhouse cinema",
    category: "Lifestyle",
    availability: "Available",
    points: 5,
  },
];

function RewardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-foreground">Reward Vault</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Redeem your points for exclusive rewards and benefits
        </p>

        <div className="mt-6">
          <PointBalance />
        </div>

        <div className="mt-6 space-y-4">
          {rewards.map((reward, i) => (
            <RewardCard key={i} {...reward} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardPage;

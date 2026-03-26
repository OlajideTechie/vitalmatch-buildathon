import { Star } from "lucide-react";

const RewardCard = ({ icon, title, description, category, availability, isLimited, points }) => {
  return (
    <div className="bg-card rounded-xl border p-5 flex items-center justify-between shadow-sm">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shrink-0 mt-1">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              category === "Health"
                ? "bg-badge-health/10 text-badge-health"
                : "bg-badge-lifestyle/10 text-badge-lifestyle"
            }`}>
              {category}
            </span>
            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              isLimited
                ? "bg-badge-limited/10 text-badge-limited"
                : "bg-badge-available/10 text-badge-available"
            }`}>
              {availability}
            </span>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-sm font-semibold text-foreground">{points} Pts</span>
            <Star className="w-3.5 h-3.5 fill-star text-star" />
          </div>
        </div>
      </div>
      <button className="bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:opacity-90 transition-opacity shrink-0">
        Redeem Now
      </button>
    </div>
  );
};

export default RewardCard;

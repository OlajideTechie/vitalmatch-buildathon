import { Star } from "lucide-react";

const PointBalance = () => {
  return (
    <div className="bg-card rounded-xl border p-5 flex items-center gap-4 shadow-sm">
      <div>
        <p className="text-muted-foreground text-sm">Your Point Balance</p>
        <p className="text-2xl font-bold text-foreground">5 Points</p>
        <div className="flex items-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-star text-star" />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-1">Earned from 10 donations</p>
      </div>
    </div>
  );
};

export default PointBalance;

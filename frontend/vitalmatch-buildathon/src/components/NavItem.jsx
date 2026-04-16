import { Link } from "react-router-dom";

export default function NavItem({ icon, label, to, isActive }) {
  return (
    <Link 
      to={to} 
      className={`flex items-center w-full p-3 rounded-lg transition-colors ${
        isActive 
          ? "bg-[#3B82F6] text-white" 
          : "text-gray-400 hover:bg-[#14183E] hover:text-white"
      }`}
    >
      <span>{icon}</span>
      <span className="ml-4 text-sm font-medium">{label}</span>
    </Link>
  );
}
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ label, name, value, onChange, placeholder, error }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[#797B8B]">{label}</label>
      <div className="relative">
        <input 
          type={showPassword ? "text" : "password"} 
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full border rounded-lg p-3.5 pr-12 text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-1 ${
            error ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'
          }`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
        >
          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
      {error && <span className="text-red-500 text-xs mt-0.5">{error}</span>}
    </div>
  );
}
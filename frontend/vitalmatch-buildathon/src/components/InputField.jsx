export default function InputField({ label, name, type = "text", value, onChange, placeholder, error }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-[#797B8B]">{label}</label>
      <input 
        type={type} 
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full border rounded-lg p-3.5 text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-1 ${
          error ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'
        }`}
      />
      {error && <span className="text-red-500 text-xs mt-0.5">{error}</span>}
    </div>
  );
}
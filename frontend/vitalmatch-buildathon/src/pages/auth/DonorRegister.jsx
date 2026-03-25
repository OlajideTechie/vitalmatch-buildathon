import { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, AlertCircle } from 'lucide-react';
import VitalMatchLogo from "../../assets/vitalmatch-logo.png";
import { getUserCoordinates, getAddressFromCoords } from '../../utils/locationUtils';
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

function DonorRegister() {
  const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false);
  const [isGenotypeOpen, setIsGenotypeOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedGenotype, setSelectedGenotype] = useState('');
  const [globalError, setGlobalError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    nin: '',
    gender: '',
    donatedBefore: '',
    password: '',
    confirmPassword: '',
    stateText: '',
    addressText: '',
    coordinates: {
      lat: null,
      lon: null
    }
  });
  const [errors, setErrors] = useState({});

  const bloodGroups = ['A+', 'O+', 'B+', 'O-', 'A-', 'AB', 'B-'];
  const genotypes = ['AA', 'AS', 'SS', 'AC', 'SC'];

  const handleGetLocation = async () => {
    try {
      const coords = await getUserCoordinates();
      const locationDetails = await getAddressFromCoords(coords.lat, coords.lon);
      
      setFormData((prev) => ({
        ...prev,
        coordinates: coords,
        stateText: locationDetails.state,
        addressText: locationDetails.address
      }));
      
      setErrors((prev) => ({ ...prev, location: '' }));
    } catch (error) {
      alert(error.message || "Unable to retrieve your location");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!formData.nin.trim()) newErrors.nin = "NIN is required";
    if (!formData.gender) newErrors.gender = "Please select your gender";
    if (!selectedBloodGroup) newErrors.bloodGroup = "Please select a blood group";
    if (!selectedGenotype) newErrors.genotype = "Please select a genotype";
    if (!formData.donatedBefore) newErrors.donatedBefore = "Please select an option";
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.coordinates.lat || !formData.coordinates.lon) {
      newErrors.location = "Please provide your location using the button above";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
  e.preventDefault();
  setGlobalError('');

  if (validateForm()) {
    const payload = {
      full_name: formData.fullName,
      phone_number: formData.phone,
      email: formData.email,
      password: formData.password,
      confirm_password: formData.confirmPassword,
      nin: formData.nin,
      gender: formData.gender,
      blood_group: selectedBloodGroup,
      genotype: selectedGenotype,
      has_donated_before: formData.donatedBefore === "yes",
      latitude: formData.coordinates.lat,
      longitude: formData.coordinates.lon,
    };

    mutation.mutate(payload);
  }
};

    const registerDonor = async (payload) => {
        const res = await fetch(
            "https://vitalmatch-backend-service.onrender.com/api/auth/donor/register",
            {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            // Attach backend response to error
            const error = new Error(data.message || "Registration failed");
            error.response = { data };
            throw error;
        }

        return data;
    };

    const mutation = useMutation({
    mutationFn: registerDonor,

    onSuccess: () => {
      toast.success("Registration successful 🎉");
    },

    onError: async (error) => {
      const responseData = error?.response?.data;
      const backendErrors = responseData?.errors || responseData;

      if (backendErrors && typeof backendErrors === 'object') {
        const formattedErrors = {};
        let mappedAtLeastOneField = false;

        Object.keys(backendErrors).forEach((key) => {
          // Skip if the key happens to be a generic global 'message' string
          if (key === 'message' && typeof backendErrors[key] === 'string') return;

          mappedAtLeastOneField = true;
          
          const errorMessages = Array.isArray(backendErrors[key]) 
            ? backendErrors[key] 
            : [backendErrors[key]];

          const fieldMap = {
            full_name: "fullName",
            phone_number: "phone",
            email: "email",
            password: "password",
            confirm_password: "confirmPassword",
            nin: "nin",
            gender: "gender",
            blood_group: "bloodGroup",
            genotype: "genotype",
          };

          const frontendKey = fieldMap[key] || key; 
          formattedErrors[frontendKey] = errorMessages.join(", ");

          // Show a toast, replacing underscores with spaces for readability
          errorMessages.forEach((msg) => {
             const cleanKey = key.replace('_', ' ').toUpperCase();
             toast.error(`${cleanKey}: ${msg}`);
          });
        });

        // If we found specific field errors, set them and STOP execution here
        if (mappedAtLeastOneField) {
          setErrors((prev) => ({ ...prev, ...formattedErrors }));
          return; 
        }
      } 
      
      // 3. Fallback for a generic global message (if no field errors were found)
      if (responseData?.message) {
        setGlobalError(responseData.message);
        toast.error(responseData.message);
      } 
      // 4. Ultimate Fallback for network crashes
      else {
        const fallbackError = error.message || "An unexpected error occurred. Please try again later.";
        setGlobalError(fallbackError);
        toast.error("Registration failed.");
      }
    },
  });

    
  return (
    <div className="flex h-screen w-full font-sans overflow-hidden bg-white">
      
      {/* Left Pane - Fixed Branding & Info */}
      <div className="hidden lg:flex w-1/2 h-full bg-[#07052C] p-12 flex-col justify-between text-white relative z-10 shadow-lg">
        <div>
          <div className="cursor-pointer flex items-center mb-6">
            <img src={VitalMatchLogo} alt="vitalmatch-logo" className="h-14 w-20" />
          </div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Let's Get You<br />Started!
          </h1>
          <p className="text-gray-300 text-sm leading-relaxed max-w-md">
            Join thousands of hospitals and donors making blood access faster, safer, and more transparent.
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full overflow-y-auto scroll-smooth">
        <div className="min-h-full flex flex-col items-center justify-center p-8 py-12">
          <div className="w-full max-w-md">
            
            <div className="cursor-pointer flex items-center mb-6 lg:hidden">
              <img src={VitalMatchLogo} alt="vitalmatch-logo" className="h-14 w-20" />
            </div>
            
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">Complete your profile</h2>
            <p className="text-[#434248] text-sm mb-8">
              Let's finish setting up your donor account. This information helps us send you the right requests at the right time.
            </p>
            {globalError && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                    <h3 className="text-sm font-semibold text-red-800">Registration Failed</h3>
                    <p className="text-sm text-red-600 mt-1">{globalError}</p>
                    </div>
                </div>
            )}
            <form className="space-y-5" onSubmit={handleSubmit}>
              
              {/* Existing Fields (Name, Phone, Email, NIN) */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#797B8B]">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className={`w-full border rounded-lg p-3.5 text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.fullName ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                />
                {errors.fullName && <span className="text-red-500 text-xs mt-0.5">{errors.fullName}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#797B8B]">Phone Number</label>
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  className={`w-full border rounded-lg p-3.5 text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.phone ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                />
                {errors.phone && <span className="text-red-500 text-xs mt-0.5">{errors.phone}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#797B8B]">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  className={`w-full border rounded-lg p-3.5 text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.email ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                />
                {errors.email && <span className="text-red-500 text-xs mt-0.5">{errors.email}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#797B8B]">National Identification Number (NIN)</label>
                <input 
                  type="number" 
                  name="nin"
                  value={formData.nin}
                  onChange={handleInputChange}
                  placeholder="Enter your national identification number"
                  className={`w-full border rounded-lg p-3.5 text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.nin ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                />
                {errors.nin && <span className="text-red-500 text-xs mt-0.5">{errors.nin}</span>}
              </div>

              {/* 3. Updated Password Field with Toggle */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#797B8B]">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className={`w-full border rounded-lg p-3.5 pr-12 text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.password ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-xs mt-0.5">{errors.password}</span>}
              </div>

              {/* 4. Updated Confirm Password Field with Toggle */}
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#797B8B]">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className={`w-full border rounded-lg p-3.5 pr-12 text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.confirmPassword ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && <span className="text-red-500 text-xs mt-0.5">{errors.confirmPassword}</span>}
              </div>

              {/* Gender, Blood Group, Genotype... */}
              <div className="flex flex-col gap-1 relative">
                <label className="text-sm font-medium text-[#797B8B]">Gender</label>
                <select 
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3.5 text-sm text-[#1C1C1C] appearance-none focus:outline-none focus:ring-1 bg-white ${errors.gender ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                >
                  <option value="" disabled>Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <ChevronDown className="absolute right-4 top-[70%] -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                {errors.gender && <span className="text-red-500 text-xs mt-0.5">{errors.gender}</span>}
              </div>

              <div className="flex flex-col gap-1 relative">
                <label className="text-sm font-medium text-[#797B8B]">Blood Group</label>
                <div 
                  onClick={() => setIsBloodGroupOpen(!isBloodGroupOpen)}
                  className={`w-full border rounded-lg p-3.5 text-sm text-[#1C1C1C] flex justify-between items-center cursor-pointer bg-white ${errors.bloodGroup ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                >
                  <span className={selectedBloodGroup ? "text-[#1C1C1C]" : "text-gray-400"}>
                    {selectedBloodGroup || 'Select Blood Group'}
                  </span>
                  {isBloodGroupOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
                {errors.bloodGroup && <span className="text-red-500 text-xs mt-0.5">{errors.bloodGroup}</span>}

                {isBloodGroupOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#F7F9FC] rounded-2xl shadow-xl z-10 py-2 border border-gray-50 max-h-48 overflow-y-auto">
                    {bloodGroups.map((group) => (
                      <div 
                        key={group}
                        onClick={() => {
                          setSelectedBloodGroup(group);
                          setIsBloodGroupOpen(false);
                          setErrors(prev => ({ ...prev, bloodGroup: '' }));
                        }}
                        className="px-4 py-2.5 text-sm text-[#1C1C1C] hover:bg-gray-200 cursor-pointer transition-colors mx-2 rounded-lg"
                      >
                        {group}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 relative">
                <label className="text-sm font-medium text-[#797B8B]">Genotype</label>
                <div 
                  onClick={() => setIsGenotypeOpen(!isGenotypeOpen)}
                  className={`w-full border rounded-lg p-3.5 text-sm text-[#1C1C1C] flex justify-between items-center cursor-pointer bg-white ${errors.genotype ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                >
                  <span className={selectedGenotype ? "text-[#1C1C1C]" : "text-gray-400"}>
                    {selectedGenotype || 'Select Genotype'}
                  </span>
                  {isGenotypeOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                </div>
                {errors.genotype && <span className="text-red-500 text-xs mt-0.5">{errors.genotype}</span>}

                {isGenotypeOpen && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-[#F7F9FC] rounded-2xl shadow-xl z-10 py-2 border border-gray-50 max-h-48 overflow-y-auto">
                    {genotypes.map((genotype) => (
                      <div 
                        key={genotype}
                        onClick={() => {
                          setSelectedGenotype(genotype);
                          setIsGenotypeOpen(false);
                          setErrors(prev => ({ ...prev, genotype: '' }));
                        }}
                        className="px-4 py-2.5 text-sm text-[#1C1C1C] hover:bg-gray-200 cursor-pointer transition-colors mx-2 rounded-lg"
                      >
                        {genotype}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 relative">
                <label className="text-sm font-medium text-[#797B8B]">
                  Have You Ever Donated?
                </label>
                <select 
                  name="donatedBefore"
                  value={formData.donatedBefore}
                  onChange={handleInputChange}
                  className={`w-full border rounded-lg p-3.5 text-sm text-[#1C1C1C] appearance-none focus:outline-none focus:ring-1 bg-white ${errors.donatedBefore ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                >
                  <option value="" disabled>Select option</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
                <ChevronDown className="absolute right-4 top-[70%] -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                {errors.donatedBefore && <span className="text-red-500 text-xs mt-0.5">{errors.donatedBefore}</span>}
              </div>

              {/* Location Handling */}
              <div className="flex flex-col gap-2 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-[#797B8B]">Location Details</label>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="text-sm text-[#3B82F6] font-medium hover:underline"
                  >
                    Use my current location
                  </button>
                </div>
                
                <input 
                  type="text" 
                  readOnly
                  value={formData.stateText}
                  placeholder="State" 
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3.5 text-sm text-gray-700 placeholder-gray-400 cursor-not-allowed"
                />

                <input 
                  type="text" 
                  readOnly
                  value={formData.addressText}
                  placeholder="Address" 
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg p-3.5 text-sm text-gray-700 placeholder-gray-400 cursor-not-allowed"
                />
                
                {errors.location && <span className="text-red-500 text-xs mt-0.5">{errors.location}</span>}
              </div>

              <div className="pt-4">
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-[#3B82F6] text-white font-semibold rounded-full py-4 mt-2 hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {mutation.isPending ? "Submitting..." : "Submit"}
                </button>
              </div>

              <div className="text-sm font-medium mt-2">
                <p className="mb-2">
                  Already have an account? <a href="#" className="text-[#3B82F6] hover:underline">Sign in</a>
                </p>
                <a href="#" className="text-[#3B82F6] hover:underline">Need Help?</a>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DonorRegister;
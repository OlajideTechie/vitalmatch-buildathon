import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import VitalMatchLogo from "../../assets/vitalmatch-logo.png";

function DonorRegister() {
  const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false);
  const [isGenotypeOpen, setIsGenotypeOpen] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedGenotype, setSelectedGenotype] = useState('');

  // 1. Form and Error States
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    nin: '',
    gender: '',
    donatedBefore: '',
    state: '',
    address: ''
  });
  const [errors, setErrors] = useState({});

  const bloodGroups = ['A+', 'O+', 'B+', 'O-', 'A-', 'AB', 'B-'];
  const genotypes = ['AA', 'AS', 'SS', 'AC', 'SC'];

  const getUserLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
            const { latitude, longitude } = position.coords;

            console.log("Coords:", latitude, longitude);

            // Call reverse geocoding API here
            fetchLocationDetails(latitude, longitude);
            },
            (error) => {
            console.error(error);
            alert("Unable to retrieve your location");
            }
        );
    };

    const fetchLocationDetails = async (lat, lon) => {
        try {
            const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
            );
            const data = await res.json();

            const state = data.address.state || '';
            const address = data.display_name || '';

            setFormData((prev) => ({
            ...prev,
            state,
            address
            }));
        } catch (err) {
            console.error("Error fetching location details:", err);
        }
        };
  // Handle standard input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // 2. Validation Logic
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
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const payload = {
        ...formData,
        bloodGroup: selectedBloodGroup,
        genotype: selectedGenotype
      };
      console.log("Form ready for submission:", payload);
      // Proceed to the next step or API call here
    }
  };

  return (
    // 3. Layout Fix: h-screen and overflow-hidden prevent the whole page from scrolling
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
            Join thousands of hospitals and donors making blood access faster, safer, and more transparent. Whether you're a hospital looking to save critical time in emergencies or a blood donor ready to make real difference, VitalMatch makes it simple to start saving lives today
          </p>
        </div>
      </div>

      <div className="w-full lg:w-1/2 h-full overflow-y-auto scroll-smooth">
        
        {/* Added min-h-full so the form stays centered vertically if the screen is very tall */}
        <div className="min-h-full flex flex-col items-center justify-center p-8 py-12">
          <div className="w-full max-w-md">
            
            <div className="cursor-pointer flex items-center mb-6 lg:hidden">
              <img src={VitalMatchLogo} alt="vitalmatch-logo" className="h-14 w-20" />
            </div>
            
            <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">Complete your profile</h2>
            <p className="text-[#434248] text-sm mb-8">
              Let's finish setting up your donor account. This information helps us send you the right requests at the right time.
            </p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              
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
                  type="tel" // Changed to 'tel' to prevent up/down arrows in some browsers
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

              {/* Gender Select */}
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

              {/* Custom Blood Group Select */}
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

              {/* Custom Genotype Select */}
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
                <button
                    type="button"
                    onClick={getUserLocation}
                    className="text-sm text-blue-500 hover:underline self-start"
                >
                    Use my current location
                </button>

              <div className="flex flex-col gap-1">
                <input 
                  type="text" 
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State" 
                  className={`w-full border rounded-lg p-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.state ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                />
                {errors.state && <span className="text-red-500 text-xs mt-0.5">{errors.state}</span>}
              </div>

              <div className="flex flex-col gap-1">
                <input 
                  type="text" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address" 
                  className={`w-full border rounded-lg p-3.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.address ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                />
                {errors.address && <span className="text-red-500 text-xs mt-0.5">{errors.address}</span>}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full bg-[#3B82F6] text-white font-semibold rounded-full py-4 mt-2 hover:bg-blue-600 transition-colors shadow-sm"
                >
                  Continue
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
import { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, Users, MapPin, Activity } from 'lucide-react';
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom"; 

function CreateRequests() {
    const navigate = useNavigate();
    const [globalError, setGlobalError] = useState('');
    const [isBloodGroupOpen, setIsBloodGroupOpen] = useState(false);
    const [isGenotypeOpen, setIsGenotypeOpen] = useState(false);
    const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
    const [selectedGenotype, setSelectedGenotype] = useState('');
  
    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [matchedDonors, setMatchedDonors] = useState([]);

    const bloodGroups = ['A+', 'O+', 'B+', 'O-', 'A-', 'AB', 'B-'];
    const genotypes = ['AA', 'AS'];
    const { token } = useAuth();
    const [formData, setFormData] = useState({
        requiredUnits: '',
    });
    const [errors, setErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.requiredUnits.trim()) newErrors.requiredUnits = "Required units is required";
        if (!selectedBloodGroup) newErrors.bloodGroup = "Please select a blood group";
        if (!selectedGenotype) newErrors.genotype = "Please select a genotype";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setGlobalError('');

        if (validateForm()) {
            const payload = {
                blood_group: selectedBloodGroup,
                genotype: selectedGenotype,
                required_units: Number(formData.requiredUnits),
            };

            mutation.mutate(payload);
        }
    };

    const createRequests = async (payload) => {
        const res = await fetch(
            "https://vitalmatch-backend-service.onrender.com/api/hospital/create-request",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            const error = new Error(data.message || "Registration failed");
            error.response = { data };
            throw error;
        }

        return data;
    };
    
    const mutation = useMutation({
        mutationFn: createRequests,
        onSuccess: (data) => {
            toast.success("Request created successfully");
            
            setMatchedDonors(data.matches || []);
            
            setIsModalOpen(true);
        },
        onError: async (error) => {
            const responseData = error?.response?.data;
            const backendErrors = responseData?.errors || responseData;

            if (backendErrors && typeof backendErrors === 'object') {
                const formattedErrors = {};
                let mappedAtLeastOneField = false;

                Object.keys(backendErrors).forEach((key) => {
                    if (key === 'message' && typeof backendErrors[key] === 'string') return;
                    mappedAtLeastOneField = true;
                
                    const errorMessages = Array.isArray(backendErrors[key]) ? backendErrors[key] : [backendErrors[key]];

                    const fieldMap = {
                        blood_group: "bloodGroup",
                        genotype: "genotype",
                        required_units: "requiredUnits",
                    };

                    const frontendKey = fieldMap[key] || key; 
                    formattedErrors[frontendKey] = errorMessages.join(", ");

                    errorMessages.forEach((msg) => {
                      const cleanKey = key.replace('_', ' ').toUpperCase();
                      toast.error(`${cleanKey}: ${msg}`);
                    });
                });

                if (mappedAtLeastOneField) {
                    setErrors((prev) => ({ ...prev, ...formattedErrors }));
                    return; 
                }
            } 
              
            if (responseData?.message) {
                setGlobalError(responseData.message);
                toast.error(responseData.message);
            } else {
                const fallbackError = error.message || "An unexpected error occurred. Please try again later.";
                setGlobalError(fallbackError);
                toast.error("Registration failed.");
            }
        },
    });

    return (
        <div className="w-full h-full overflow-y-auto scroll-smooth relative">
            <div className="min-h-full flex flex-col items-center justify-start pt-20 px-8 pb-8">
                <div className="w-full max-w-md">
                    
                    <h2 className="text-2xl font-bold text-[#0A0A0A] mb-2">Create Blood Request</h2>
                    <p className="text-[#434248] text-sm mb-8">
                        Fill out the details below to request blood. Compatible donors in your area will be notified immediately, with emergency requests receiving priority matching.
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
                        
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-[#797B8B]">Required Units</label>
                            <input 
                                type="number"
                                name="requiredUnits"
                                value={formData.requiredUnits}
                                onChange={handleInputChange}
                                placeholder="Enter required units"
                                className={`w-full border rounded-lg p-3.5 text-sm text-[#1C1C1C] placeholder-gray-400 focus:outline-none focus:ring-1 ${errors.requiredUnits ? 'border-red-400 focus:ring-red-300' : 'border-gray-200 focus:ring-gray-300'}`}
                            />
                            {errors.requiredUnits && <span className="text-red-500 text-xs mt-0.5">{errors.requiredUnits}</span>}
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
                    </form>
                </div>
            </div>

            {/* Success Modal Overlay */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* Header */}
                        <div className="flex flex-col items-center text-center mb-6">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <Users className="w-8 h-8 text-blue-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-[#0A0A0A]">Available Donors Found</h3>
                            <p className="text-[#434248] text-sm mt-3 leading-relaxed">
                                We've found potential donors near you. Notifications have been sent. You'll be notified once a donor accepts your request.
                            </p>
                        </div>

                        {/* Donors List (Identity hidden) */}
                        <div className="space-y-3 mb-8 max-h-[200px] overflow-y-auto pr-1">
                            {matchedDonors.length > 0 ? (
                                matchedDonors.map((donor) => (
                                    <div key={donor.donor_id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 w-full">
                                            {/* We use the requested blood group as a fallback visual indicator */}
                                            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                                                {selectedBloodGroup}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-[#1C1C1C] text-sm">Anonymous Donor</h4>
                                                <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-xs text-gray-500 mt-0.5">
                                                    <span className="flex items-center gap-1 shrink-0">
                                                        <Activity className="w-3 h-3" /> {selectedGenotype} Match
                                                    </span>
                                                    <span className="hidden sm:inline text-gray-300">•</span>
                                                    <span className="flex items-center gap-1 truncate">
                                                        <MapPin className="w-3 h-3 shrink-0" /> 
                                                        {donor.distance_km}km away 
                                                        <span className="text-gray-400 italic">({donor.reason})</span>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-sm text-gray-500 py-4">No exact matches found nearby yet, but your request is live.</p>
                            )}
                        </div>

                        {/* CTA Button */}
                        <button
                            onClick={() => navigate('/hospital-dashboard')}
                            className="w-full bg-[#3B82F6] text-white font-semibold rounded-full py-3.5 hover:bg-blue-600 transition-colors shadow-sm"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default CreateRequests;
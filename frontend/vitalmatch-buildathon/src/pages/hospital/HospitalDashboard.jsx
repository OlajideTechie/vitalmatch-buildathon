import { fetchProfile, fetchRequests } from "../../services/auth";
import { useQuery } from "@tanstack/react-query";
import { formatTime } from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function HospitalDashboard() {
    const { token } = useAuth();
    const navigate = useNavigate();

    const { data: profileData, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: () => fetchProfile(token),
        enabled: !!token,
    });

    const { data: requestsData, isLoading: requestsLoading } = useQuery({
        queryKey: ['requests'],
        queryFn: () => fetchRequests(token),
        enabled: !!token,
        // refetchInterval: 10000,
    });

    // --- 1. NEW STYLED SPINNER ---
    if (isLoading || requestsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-6xl">
                <div className="w-12 h-12 border-4 border-gray-100 border-t-[#3B82F6] rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500 font-medium animate-pulse">Loading dashboard...</p>
            </div>
        );
    }
    
    if (error) return <p className="text-red-500 text-center mt-10">Error: {error.message}</p>;

    const dashboard = profileData.dashboard;

    const summaryCards = [
        { 
            title: 'Active Blood Request', 
            count: dashboard.open_requests + dashboard.partial_requests, 
            subtitle: 'Needs attention', 
            bgColor: 'bg-[#CCE7FF]'
        },
        { 
            title: 'Total Requests', 
            count: dashboard.total_requests, 
            subtitle: 'All requests', 
            bgColor: 'bg-[#E5F2FF80]' 
        },
        { 
            title: 'Open Requests', 
            count: dashboard.open_requests, 
            subtitle: 'Currently open', 
            bgColor: 'bg-[#E5F2FF80]' 
        },
        { 
            title: 'Completed Requests', 
            count: dashboard.completed_requests, 
            subtitle: 'Successfully done', 
            bgColor: 'bg-[#C2E8DC]' 
        },
    ];

    const filteredActiveRequests = requestsData?.filter(req => req.status === 'open') || [];
    const activeRequests = filteredActiveRequests.map((req) => ({
        id: req.id,
        bloodGroup: req.blood_group,
        genotype: req.genotype,
        requiredUnits: req.required_units,
        fulfilledUnits: req.fulfilled_units,
        time: formatTime(req.created_at),
        status: req.status,
        progressPercentage: req.progress_percentage
    })) || [];

    return (
        <div className="p-6 md:p-8 w-full mx-auto">
            {/* --- 2. FIXED GRID: Changed lg:grid-cols-3 to lg:grid-cols-4 --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {summaryCards.map((card, idx) => (
                    <div key={idx} className={`${card.bgColor} p-6 rounded-2xl shadow-sm border ${card.bgColor === 'bg-white' ? 'border-gray-200' : 'border-transparent'}`}>
                        <h3 className="text-gray-700 font-semibold mb-2">{card.title}</h3>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{card.count}</p>
                        <p className="text-sm text-gray-500">{card.subtitle}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Blood Requests</h2>
        
            {/* --- 3. EMPTY STATE HANDLING --- */}
            {activeRequests.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                    <p className="text-gray-500 font-medium">No active blood requests at the moment.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {activeRequests.map((req, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition-shadow duration-200">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h4 className="font-bold text-gray-900">Request ID: {req.id}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{req.time}</p>
                                </div>
                                {/* --- 4. STATUS BADGE --- */}
                                <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                                    req.status === 'open' 
                                    ? 'bg-emerald-100 text-emerald-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }`}>
                                    {req.status}
                                </span>
                            </div>

                            <div className="space-y-3 mb-6 text-sm flex-1">
                                <DetailRow label="Blood Group:" value={req.bloodGroup} />
                                <DetailRow label="Genotype:" value={req.genotype} />
                                <DetailRow label="Required Units:" value={`${req.requiredUnits} unit(s)`} />
                                <DetailRow label="Fulfilled Units:" value={`${req.fulfilledUnits} unit(s)`} />
                                
                                {/* --- 5. VISUAL PROGRESS BAR --- */}
                                <div className="pt-2">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-gray-500 text-sm">Progress</span>
                                        <span className="font-semibold text-gray-900 text-sm">{req.progressPercentage}%</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2">
                                        <div 
                                            className="bg-[#3B82F6] h-2 rounded-full transition-all duration-500" 
                                            style={{ width: `${req.progressPercentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <button 
                                className="w-full text-[#F4F7FB] hover:bg-blue-700 bg-[#3B82F6] cursor-pointer hover:text-white font-semibold py-3 rounded-xl transition-colors duration-200"
                                onClick={() => navigate(`/hospital/requests/${req.id}`)}
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function DetailRow({ label, value, valueColor = 'text-gray-900' }) {
  return (
    <div className="flex justify-between items-center py-1 border-b border-gray-50 last:border-0">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}

export default HospitalDashboard;
import { fetchProfile, fetchDonorRequests, respondToRequest } from "../../services/auth";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { formatTime } from "../../utils/formatTime";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function DonorDashboard() {
    const { token } = useAuth();

    const { data: profileData, isLoading, error } = useQuery({
        queryKey: ['profile'],
        queryFn: () => fetchProfile(token),
        enabled: !!token,
    });

    const {
        data: requestsData,
        isLoading: requestsLoading,
        } = useQuery({
        queryKey: ["donorRequests"],
        queryFn: () => fetchDonorRequests(token),
        enabled: !!token,
        // refetchInterval: 15000,
    });

    const activeRequests = (requestsData?.incoming_requests || []).map((req) => ({
        // FIX 2: Map to the correct properties from your API response
        id: req.request_id, 
        hospitalName: req.hospital_name,
        bloodGroup: req.blood_group,
        genotype: req.genotype,
        status: req.status,
        time: req.time_ago, // Using time_ago directly since it's already formatted
        isEmergency: req.status === "pending", 
    }));

    const queryClient = useQueryClient();

    const respondMutation = useMutation({
    mutationFn: ({ requestId, action }) =>
        respondToRequest({ requestId, action, token }),

        onSuccess: () => {
            queryClient.invalidateQueries(["donorRequests"]);
            queryClient.invalidateQueries(["profile"]);
        },
    });
    // --- 1. NEW STYLED SPINNER ---
    if (isLoading || requestsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">Loading dashboard...</p>
            </div>
        );
    }
    
    if (error) return <p className="text-red-500 text-center mt-10">Error: {error.message}</p>;

    const dashboard = profileData.dashboard;

    const summaryCards = [
        { 
            title: 'Accepted Requests', 
            count: dashboard.accepted_requests, 
            subtitle: 'All accepted requests', 
            bgColor: 'bg-[#CCE7FF]'
        },
        { 
            title: 'Confirmed Requests', 
            count: dashboard.confirmed_requests, 
            subtitle: 'All successful donations', 
            bgColor: 'bg-[#E5F2FF80]' 
        },
        { 
            title: 'Pending Requests', 
            count: dashboard.pending_requests, 
            subtitle: 'Currently open', 
            bgColor: 'bg-[#E5F2FF80]' 
        },
    ];

    return (
        <div className="p-6 md:p-8 w-full mx-auto">
            {/* --- 2. FIXED GRID: Changed lg:grid-cols-3 to lg:grid-cols-4 --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {summaryCards.map((card, idx) => (
                    <div key={idx} className={`${card.bgColor} p-6 rounded-2xl shadow-sm bordk8er ${card.bgColor === 'bg-white' ? 'border-gray-200' : 'border-transparent'}`}>
                        <h3 className="text-gray-700 font-semibold mb-2">{card.title}</h3>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{card.count}</p>
                        <p className="text-sm text-gray-500">{card.subtitle}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Incoming Blood Requests</h2>
        
            {activeRequests.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                    <p className="text-gray-500 font-medium">No active blood requests at the moment.</p>
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activeRequests.map((req) => (
                    <div key={req.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        
                        <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">{req.hospitalName}</h2>
                        {req.isEmergency && (
                            <span className="bg-red-50 text-red-500 text-xs font-medium px-2.5 py-1 rounded-md">
                                Emergency
                            </span>
                        )}
                        </div>

                    
                        <div className="space-y-4 mb-8">
                            <DetailRow label="Blood Group:" value={req.bloodGroup} />
                            <DetailRow label="Genotype:" value={req.genotype} />
                            <DetailRow label="Request Time:" value={req.time} />
                        </div>

                        
                        <div className="flex gap-4">
                        <button
                            onClick={() =>
                                respondMutation.mutate({ requestId: req.request_id, action: "accept" })
                            }
                            disabled={respondMutation.isPending}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl disabled:opacity-50"
                        >
                            Accept
                        </button>

                        <button
                            onClick={() =>
                                respondMutation.mutate({ requestId: req.request_id, action: "ignore" })
                            }
                            disabled={respondMutation.isPending}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-4 rounded-xl disabled:opacity-50"
                        >
                            Decline
                        </button>
                        </div>
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

export default DonorDashboard;
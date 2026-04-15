import { fetchProfile, fetchDonorRequests, respondToRequest } from "../../services/auth";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Check } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

function DonorDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionType, setActionType] = useState(""); // "accept" or "decline"
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

    const incomingRequests = requestsData?.incoming_requests || [];
    const activeRequestsRaw = requestsData?.active_requests || [];
    
    const pendingRequests = (incomingRequests).map((req) => ({
        // FIX 2: Map to the correct properties from your API response
        id: req.request_id, 
        hospitalName: req.hospital_name,
        bloodGroup: req.blood_group,
        genotype: req.genotype,
        status: req.status,
        time: req.time_ago, // Using time_ago directly since it's already formatted
    }));

    const activeRequests = activeRequestsRaw.map((req) => ({
        id: req.request_id,
        hospitalName: req.hospital_name,
        bloodGroup: req.blood_group,
        genotype: req.genotype,
        status: req.status,
        time: req.time_ago,
    }));

    const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-blue-100 text-blue-700';
      case 'Confirmed':
        return 'bg-green-100 text-green-700';
      case 'Ignored':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-slate-100 text-slate-800'; // Fallback
    }
  };

    const queryClient = useQueryClient();

    const respondMutation = useMutation({
        mutationFn: ({ acceptance_id, action, token }) =>
            respondToRequest({ acceptance_id, action, token }),

        onSuccess: (_, variables) => {
            setActionType(variables.action);
            setIsModalOpen(true);

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

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pending Blood Requests</h2>
        
            {pendingRequests.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                    <p className="text-gray-500 font-medium">No pending blood requests at the moment.</p>
                </div>
                ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {pendingRequests.map((req) => (
                    <div key={req.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        
                        <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-bold text-gray-900">{req.hospitalName}</h2>
                        
                        <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusStyle(req.status)}`}>
                            {req.status}
                        </span>
                    
                        </div>

                        <div className="space-y-4 mb-8">
                            <DetailRow label="Blood Group:" value={req.bloodGroup} />
                            <DetailRow label="Genotype:" value={req.genotype} />
                            <DetailRow label="Request Time:" value={req.time} />
                        </div>

                        
                        {req.status === "pending" && (
                            <div className="flex gap-4">
                                <button
                                    onClick={() =>
                                    respondMutation.mutate({ acceptance_id: req.id, action: "accept", token })
                                }
                                    disabled={respondMutation.isPending}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl disabled:opacity-50 cursor-pointer"
                                >
                                    Accept
                                </button>

                                <button
                                    onClick={() =>
                                        respondMutation.mutate({ acceptance_id: req.id, action: "ignore", token })
                                    }
                                    disabled={respondMutation.isPending}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 px-4 rounded-xl disabled:opacity-50 cursor-pointer"
                                >
                                    Decline
                                </button>
                            </div>
                            )}
                        </div>
                    
                    ))}
                </div>
                )}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                        <div className="bg-[#0f1425] rounded-xl shadow-2xl w-[90%] max-w-120 p-10 flex flex-col items-center text-center mx-auto">
                        
                        <div className="relative w-28 h-28 flex items-center justify-center mb-6">
                            <div className="absolute inset-0 bg-white/5 rounded-full"></div>
                            <div className="absolute inset-3 bg-white/10 rounded-full"></div>
                            <div className="absolute inset-6 bg-white/20 rounded-full"></div>
                            <div className="relative bg-[#3ddc97] w-12 h-12 rounded-full flex items-center justify-center z-10">
                            <Check className="text-[#0f1425] w-7 h-7 stroke-4" />
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-3">
                            {actionType === "accept" ? "Request Accepted" : "Request Declined"}
                        </h3>

                        <p className="text-gray-300 text-base mb-8 px-4 leading-relaxed">
                            {actionType === "accept"
                            ? "The hospital will contact you shortly at your phone number."
                            : "You have declined this request. It will no longer appear in your active list."}
                        </p>

                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="w-[80%] bg-[#4285F4] hover:bg-blue-600 text-white font-semibold py-3.5 rounded-full transition-colors"
                        >
                            Got it
                        </button>
                        </div>
                    </div>
                )}
                <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-6">
                    Active Blood Requests
                </h2>

                    {activeRequests.length === 0 ? (
                    <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                        <p className="text-gray-500 font-medium">
                            No active requests yet.
                        </p>
                    </div>
                    ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {activeRequests.map((req) => (
                        <div key={req.id} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                            
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-gray-900">
                                {req.hospitalName}
                            </h2>

                            <span className="bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-md">
                                Active
                            </span>
                            </div>

                            {/* Details */}
                            <div className="space-y-4 mb-4">
                                <DetailRow label="Blood Group:" value={req.bloodGroup} />
                                <DetailRow label="Genotype:" value={req.genotype} />
                                <DetailRow label="Request Time:" value={req.time} />
                            </div>

                            {/* Status note */}
                            <p className="text-sm text-gray-500">
                                You have accepted this request. The hospital may contact you shortly.
                            </p>
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
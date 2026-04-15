import { useAuth } from "../../context/AuthContext";
import { fetchRequests } from "../../services/auth";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { formatTime } from "../../utils/formatTime";

// 1. The Dynamic Card Component
const RequestCard = ({request}) => {
    const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-6 text-sm md:text-base">
        <span className="font-bold text-gray-900">{request.time}</span>
        <span
          className={`px-3 py-1 rounded text-xs md:text-sm font-medium bg-green-100 text-green-700`}
        >
          {request.status}
        </span>
      </div>

      {/* Card Details */}
      <div className="space-y-4 text-sm md:text-base">
        <div className="flex justify-between items-start gap-4">
          <span className="text-gray-600 shrink-0">RequestID:</span>
          <span className="font-medium text-gray-800">{request.id}</span>
        </div>

        <div className="flex justify-between items-start gap-4">
          <span className="text-gray-600 shrink-0">Blood Group:</span>
          <span className="font-medium text-red-600">{request.bloodGroup}</span>
        </div>

        <div className="flex justify-between items-start gap-4">
          <span className="text-gray-600 shrink-0">Genotype:</span>
          <span className="font-medium text-gray-800 text-right">
            {request.genotype}
          </span>
        </div>

        <div className="flex justify-between items-start gap-4">
          <span className="text-gray-600 shrink-0">Fulfilled Unit(s):</span>
          <span className="font-medium text-gray-800 text-right">
            {request.fulfilledUnits} unit(s)
          </span>
        </div>

        <div className="flex justify-between items-start gap-4">
          <span className="text-gray-600 shrink-0">Required Unit(s):</span>
          <span className="font-medium text-gray-800 text-right">
            {request.requiredUnits} unit(s)
          </span>
        </div>

        <button 
            className="w-full text-[#F4F7FB] hover:bg-blue-700 bg-[#3B82F6] hover:text-white font-semibold py-3 rounded-xl transition-colors duration-200 cursor-pointer"
            onClick={() => navigate(`/hospital/requests/${request.id}`)}
        >
            View Details
        </button>
      </div>
    </div>
  );
};

// 2. The Main Container Component
function CompletedRequests() {
    const { token } = useAuth();

    const { data: requestsData, isLoading: requestsLoading, error: requestsError } = useQuery({
        queryKey: ['requests'],
        queryFn: () => fetchRequests(token),
        enabled: !!token,
        // refetchInterval: 10000,
    });

    const filteredCompletedRequests = requestsData?.filter(req => req.status === 'completed') || [];
    const completedRequests = filteredCompletedRequests.map((req) => ({
        // FIX 2: Map to the correct properties from your API response
        id: req.id, 
        bloodGroup: req.blood_group,
        genotype: req.genotype,
        status: req.status,
        requiredUnits: req.required_units,
        fulfilledUnits: req.fulfilled_units,
        time: formatTime(req.created_at),
    }));

    if (requestsLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-blue-500 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-500">Loading dashboard...</p>
            </div>
        );
    }
    
    if (requestsError) return <p className="text-red-500 text-center mt-10">Error: {requestsError.message}</p>;

  return (
    <div className="bg-[#f8f9fa] p-4 md:p-8 w-full font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Completed Requests</h1>
            {completedRequests.length === 0 ? (
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-2xl p-10 text-center">
                    <p className="text-gray-500 font-medium">No completed requests at the moment.</p>
                </div>
                ) : (
                    <div className="space-y-5">
                        {/* Mapping through dynamic data and passing it to the reusable card */}
                        {completedRequests.map((request) => (
                            <RequestCard key={request.id} request={request} />
                        ))}
                    </div>
                )
            }
      </div>
    </div>
  );
};

export default CompletedRequests;
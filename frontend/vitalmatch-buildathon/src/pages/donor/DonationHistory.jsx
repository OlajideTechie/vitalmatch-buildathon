import { useAuth } from "../../context/AuthContext";
import { fetchDonorRequests } from "../../services/auth";
import { useQuery } from "@tanstack/react-query";

// 1. The Dynamic Card Component
const DonationCard = ({donation}) => {

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
      {/* Card Header */}
      <div className="flex justify-between items-center mb-6 text-sm md:text-base">
        <span className="font-bold text-gray-900">{donation.time}</span>
        <span
          className={`px-3 py-1 rounded text-xs md:text-sm font-medium bg-green-100 text-green-700`}
        >
          {donation.status}
        </span>
      </div>

      {/* Card Details */}
      <div className="space-y-4 text-sm md:text-base">
        <div className="flex justify-between items-start gap-4">
          <span className="text-gray-600 shrink-0">RequestID:</span>
          <span className="font-medium text-gray-800">{donation.id}</span>
        </div>

        <div className="flex justify-between items-start gap-4">
          <span className="text-gray-600 shrink-0">Blood Group:</span>
          <span className="font-medium text-red-800">{donation.bloodGroup}</span>
        </div>

        <div className="flex justify-between items-start gap-4">
          <span className="text-gray-600 shrink-0">Genotype:</span>
          <span className="font-medium text-gray-800 text-right">
            {donation.genotype}
          </span>
        </div>

        <div className="flex justify-between items-start gap-4">
          <span className="text-gray-600 shrink-0">Hospital Name:</span>
          <span className="font-medium text-gray-800 text-right">
            {donation.hospitalName}
          </span>
        </div>
      </div>
    </div>
  );
};

// 2. The Main Container Component
function DonationHistory() {
    const { token } = useAuth();

    const {
        data: requestsData,
        isLoading: requestsLoading,
        error: requestsError
        } = useQuery({
        queryKey: ["donorRequests"],
        queryFn: () => fetchDonorRequests(token),
        enabled: !!token,
        // refetchInterval: 15000,
    });

    const completedRequestsRaw = requestsData?.completed_requests || [];

    const completedRequests = (completedRequestsRaw).map((req) => ({
        // FIX 2: Map to the correct properties from your API response
        id: req.request_id, 
        hospitalName: req.hospital_name,
        bloodGroup: req.blood_group,
        genotype: req.genotype,
        status: req.status,
        time: req.time_ago, // Using time_ago directly since it's already formatted
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
    <div className="bg-[#f8f9fa] p-4 md:p-8 font-sans text-gray-900">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Donation History</h1>

        <div className="space-y-5">
          {/* Mapping through dynamic data and passing it to the reusable card */}
          {completedRequests.map((donation) => (
            <DonationCard key={donation.id} donation={donation} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { formatTime } from "../../utils/formatTime";
import { X, ChevronLeft, ChevronRight, Loader2, AlertCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { fetchDonorsByRequest, confirmDonation, fetchRequestById, retryMatching } from "../../services/auth";

function ViewRequest() {
  	const [activeTab, setActiveTab] = useState("all");
  	const [matchInsight, setMatchInsight] = useState(null);
  	const { id } = useParams();
	const { token } = useAuth();
	const {
		data: requestData,
		isLoading: requestLoading,
		isError: requestError,
		error: requestErr,
		} = useQuery({
		queryKey: ["request", id],
		queryFn: () => fetchRequestById(id, token),
		enabled: !!id && !!token,
	});

	const {
		data: donorsData,
			isLoading,
			isError,
			error,
			// refetch,
		} = useQuery({
			queryKey: ["donors", id],
			queryFn: () => fetchDonorsByRequest(id, token),
			enabled: !!id && !!token,
	});
	const donorsArray = Array.isArray(donorsData) ? donorsData : donorsData?.data || [];

	const donors = (donorsArray || []).map((donor) => ({
		id: donor.id,
		name: donor.full_name,
		group: donor.blood_group,
		genotype: donor.genotype,
		contact: donor.phone_number,
		email: donor.email,
		distance: "—",
		status: "pending",
		isActive: false,
	}));

	const filteredDonors = donors.filter((donor) => {
		if (activeTab === "all") return true;
		return donor.status === activeTab;
	});

	const isPageLoading = requestLoading || isLoading;
	const isPageError = requestError || isError;

	const queryClient = useQueryClient();

	const toggleMutation = useMutation({
		mutationFn: ({ donorId }) =>
			confirmDonation({ requestId: id, donorId, token }),

		onSuccess: () => {
			// 🔥 refresh donors list
			queryClient.invalidateQueries(["donors", id]);
		},

		onError: (err) => {
			console.error(err.message);
		},
	});

	const retryMutation = useMutation({
		mutationFn: () => retryMatching({ requestId: id, token }),

		onSuccess: (data) => {
			setMatchInsight(data.reason);
			// 🔥 refresh donors + request
			queryClient.invalidateQueries(["donors", id]);
			queryClient.invalidateQueries(["request", id]);
		},

		onError: (err) => {
			console.error(err.message);
		},
	});

	const getStatusBadge = (status) => {
		const styles = {
			accepted: "bg-green-100 text-green-600",
			pending: "bg-yellow-100 text-yellow-600",
			declined: "bg-red-100 text-red-600",
		};

		return (
			<span className={`px-2 py-1 rounded text-xs font-semibold ${styles[status] || styles.pending}`}>
				{status}
			</span>
		);
	};

	const request = requestData
		? {
			id: requestData.id,
			bloodGroup: requestData.blood_group,
			genotype: requestData.genotype,
			requiredUnits: requestData.required_units,
			fulfilledUnits: requestData.fulfilled_units,
			status: requestData.status,
			createdAt: requestData.created_at,
		}
		: null;

  return (
    <div className="flex-1 bg-gray-50/50 p-6 md:p-8 text-gray-800 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Blood Request Details</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track potential donors for this request.</p>
          </div>
        </div>

		{matchInsight && (
			<div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700">
				<strong>Matching Insight:</strong> {matchInsight}
			</div>
		)}

        {/* DETAILS CARD */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
            {[
				{ label: "Request ID", value: request?.id, highlight: true },
				{ label: "Blood Group", value: request?.bloodGroup, alert: true },
				{ label: "Genotype", value: request?.genotype },
				{ label: "Number of Units", value: request?.requiredUnits },
				{ label: "Fulfilled Units", value: request?.fulfilledUnits },
				{ label: "Request Time", value: formatTime(request?.createdAt) },
				{ label: "Status", value: request?.status, badge: true },
			].map((item, i) => (
              <div key={i} className={`flex flex-col space-y-1 ${item.fullSpan ? "col-span-2 md:col-span-4" : ""}`}>
                <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">{item.label}</span>
                {item.badge ? (
                  <span className="w-max px-2.5 py-0.5 bg-blue-50 text-blue-700 font-semibold rounded-md text-sm">
                    {item.value}
                  </span>
                ) : (
                  <span className={`text-sm ${item.highlight ? "font-bold text-gray-900" : "text-gray-700"} ${item.alert ? "text-red-600 font-bold" : ""}`}>
                    {item.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT AREA: STATE MANAGEMENT */}
        {isPageLoading ? (
          <div className="bg-white rounded-2xl p-16 shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Fetching donor responses...</p>
          </div>
        ) : isPageError ? (
          <div className="bg-red-50 rounded-2xl p-8 border border-red-100 flex flex-col items-center text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-red-800 mb-1">Failed to load data</h3>
            <p className="text-sm text-red-600">{error?.message || "An unknown error occurred."}</p>
            <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors">
              Try Again
            </button>
          </div>
        ) : donors.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* TABS */}
            <div className="p-4 border-b border-gray-100 bg-white">
              <div className="inline-flex bg-gray-100/80 p-1 rounded-xl overflow-x-auto w-full md:w-auto">
                {[
                  { key: "all", label: "All Responses" },
                  { key: "accepted", label: "Accepted" },
                  { key: "pending", label: "Pending" },
                  { key: "declined", label: "Declined" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`px-5 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                      activeTab === tab.key
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              {filteredDonors.length === 0 ? (
                <div className="p-12 text-center text-gray-500 text-sm">No donors found in this category.</div>
              ) : (
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-medium">Donor ID</th>
                      <th className="px-6 py-4 font-medium">Blood / Genotype</th>
                      <th className="px-6 py-4 font-medium">Contact</th>
                      <th className="px-6 py-4 font-medium">Distance</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium text-center">Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDonors.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50/80 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900">{row.id}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-red-600 mr-2">{row.group}</span>
                          <span className="text-gray-500">{row.genotype}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{row.contact}</td>
                        <td className="px-6 py-4 text-gray-600">{row.distance}</td>
                        <td className="px-6 py-4">{getStatusBadge(row.status)}</td>
                        
                        {/* TOGGLE */}
                        <td className="px-6 py-4 text-center">
                          <button
								onClick={() => toggleMutation.mutate({ donorId: row.id })}
								disabled={toggleMutation.isPending}
								className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
							>
								{toggleMutation.isPending ? "Confirming..." : "Confirm Donation"}
							</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            {/* PAGINATION */}
            <div className="flex flex-col sm:flex-row justify-between items-center p-6 border-t border-gray-100 gap-4">
              <span className="text-sm text-gray-500 font-medium">
                Showing {filteredDonors.length} of {donors.length} results
              </span>
              <div className="flex items-center gap-1">
                <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <button className="w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-700 font-semibold rounded-lg text-sm border border-blue-100">
                  1
                </button>
                <button className="p-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-50 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="flex flex-col items-center justify-center text-center mt-12 mb-12 max-w-md mx-auto bg-white p-10 rounded-3xl shadow-sm border border-gray-100">
            <div className="bg-red-50 p-5 rounded-full mb-6 ring-8 ring-red-50/50">
              <X className="text-red-500 w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No Donors Found Yet</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              We are still searching our database. You'll be notified immediately once a matching donor is located in your radius.
            </p>
            <button
				onClick={() => retryMutation.mutate()}
				disabled={retryMutation.isPending}
				className="w-full bg-blue-600 text-white px-6 py-3 cursor-pointer rounded-xl font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-50"
			>
				{retryMutation.isPending ? "Searching..." : "Expand Search Radius"}
			</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewRequest;
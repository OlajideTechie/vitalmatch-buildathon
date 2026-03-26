function HospitalDashboard() {
    const summaryCards = [
        { title: 'Active Blood Request', count: 5, subtitle: '2 need attention', bgColor: 'bg-[#C2E8DC]' },
        { title: 'Emergency Request', count: 2, subtitle: 'Both accepted', bgColor: 'bg-white' },
        { title: 'Matched Donors', count: 32, subtitle: 'For all request', bgColor: 'bg-[#F4F7FB]' },
    ];

    const activeRequests = [
        { id: 'BR-2026-001', emergency: true, bloodGroup: 'O+', units: 2, time: '15 Min ago', matches: 5, status: 'Accepted', action: 'Contact Donor', actionColor: 'bg-blue-500' },
        { id: 'BR-2026-002', emergency: false, bloodGroup: 'A+', units: 3, time: '2 Hours ago', matches: 3, status: 'Matching', action: 'View Matches', actionColor: 'bg-blue-500' },
        { id: 'BR-2026-301', emergency: true, bloodGroup: 'AB', units: 2, time: '15 Min ago', matches: 5, status: 'Matching', action: 'View Matches', actionColor: 'bg-blue-500' },
        { id: 'BR-2026-101', emergency: false, bloodGroup: 'O-', units: 1, time: '2 Hours ago', matches: 3, status: 'Accepted', action: 'Contact Donor', actionColor: 'bg-blue-500' },
    ];

    return (
        <div className="p-6 md:p-8 max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {summaryCards.map((card, idx) => (
                    <div key={idx} className={`${card.bgColor} p-6 rounded-2xl shadow-sm border ${card.bgColor === 'bg-white' ? 'border-gray-100' : 'border-transparent'}`}>
                        <h3 className="text-gray-700 font-semibold mb-2">{card.title}</h3>
                        <p className="text-3xl font-bold text-gray-900 mb-1">{card.count}</p>
                        <p className="text-sm text-gray-500">{card.subtitle}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-6">Active Blood Request</h2>
        
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {activeRequests.map((req, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                        <div className="flex justify-between items-center mb-6">
                            <h4 className="font-bold text-gray-900">Request ID: {req.id}</h4>
                            {req.emergency && (
                                <span className="bg-[#FFEAEA] text-[#D83B3B] text-xs font-semibold px-3 py-1 rounded-md">
                                    Emergency
                                </span>
                            )}
                        </div>

                        <div className="space-y-3 mb-8 text-sm flex-1">
                            <DetailRow label="Blood Group:" value={req.bloodGroup} />
                            <DetailRow label="Number of Unit:" value={`${req.units} Unit`} />
                            <DetailRow label="Request Time:" value={req.time} />
                            <DetailRow label="Matches:" value={`${req.matches} Matched`} />
                            <DetailRow 
                                label="Status:" 
                                value={req.status} 
                                valueColor={req.status === 'Accepted' ? 'text-emerald-500' : 'text-blue-500'} 
                            />
                        </div>

                        <button className={`w-full ${req.actionColor} hover:opacity-90 text-white font-medium py-3 rounded-xl transition-opacity`}>
                            {req.action}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DetailRow({ label, value, valueColor = 'text-gray-900' }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-500">{label}</span>
      <span className={`font-semibold ${valueColor}`}>{value}</span>
    </div>
  );
}


export default HospitalDashboard;
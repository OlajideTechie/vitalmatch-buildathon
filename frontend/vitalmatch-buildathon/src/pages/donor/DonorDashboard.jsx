import { useState } from "react";
import { 
  Search, Bell, LayoutDashboard, PlusSquare, 
  List, HelpCircle, Settings, LogOut, Menu, X,
  CheckSquare, GitPullRequest, Star
} from 'lucide-react';

function NavItem({ icon, label }) {
  return (
    <button className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-blue-600 transition-colors">
      <span>{icon}</span>
      <span className="ml-4 text-sm font-medium">{label}</span>
    </button>
  );
}

function DonorDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard },
        { label: "Create Emergency Request", icon: PlusSquare },
        { label: "View All Request", icon: List },
        { label: "Help Center", icon: HelpCircle },
        { label: "Setting", icon: Settings },
    ];

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

    const notifications = [
        { id: 1, type: 'sent', message: "Your blood request has been sent to a potential donor. We'll notify you once they respond.", unread: true },
        { id: 2, type: 'accepted', message: "Your blood request has been accepted by a donor. Proceed to coordinate with them for the donation.", unread: false },
        { id: 3, type: 'sent', message: "Your blood request has been sent to a potential donor. We'll notify you once they respond.", unread: false },
        { id: 4, type: 'accepted', message: "Your blood request has been accepted by a donor. Proceed to coordinate with them for the donation.", unread: false },
        { id: 5, type: 'sent', message: "Your blood request has been sent to a potential donor. We'll notify you once they respond.", unread: false },
    ];

    return (
        <div className="flex h-screen bg-[#F8F9FC] font-sans overflow-hidden">
            
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 z-50 bg-[#07052C] w-64 h-screen shadow transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}>
                <div className="p-6 flex items-center justify-between border-b border-gray-800 shrink-0">
                    <div className="text-blue-500 text-xl font-bold tracking-wide">VitalMatch</div>
                    <button className="lg:hidden text-gray-300" onClick={() => setSidebarOpen(prev => !prev)}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="px-4 py-6 shrink-0">
                    <div className="rounded-xl p-4 flex flex-col items-center justify-center border border-gray-700">
                        <div className="w-12 h-12 bg-purple-400 rounded-full mb-2"></div>
                        <h2 className="text-white font-semibold">John Doe</h2>
                        <span className="bg-[#E5F9F1] text-[#05A660] text-xs font-semibold px-3 py-1 rounded-full flex items-center">
                            Verified <span className="ml-1">✓</span>
                        </span>
                        <div className="text-sm mt-3 space-y-2 w-full">
                            <p className="flex justify-between text-white"><span>Blood Group:</span> <span className="font-semibold">O-</span></p>
                            <p className="flex justify-between text-white"><span>Address:</span> <span className="font-semibold">Wuse Abuja</span></p>
                            <div className="flex justify-between items-center">
                            <span className="text-white">Reward:</span>
                                <div className="flex text-yellow-400">
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} fill="currentColor" />
                                    <Star size={14} className="text-slate-500" />
                                    <Star size={14} className="text-slate-500" />
                                </div>
                            </div>
                        </div>
                        <button className="w-full text-white py-2 px-4 bg-white/10 hover:bg-white/20 transition rounded-full text-sm font-medium mt-4">
                            Redeem Reward
                        </button>
                    </div>
                </div>

                {/* MODIFIED: Changed overflow-hidden to overflow-y-auto and hid the scrollbar */}
                <div className="sidebar-scroll flex-1 px-4 space-y-2 overflow-y-auto whitespace-nowrap pb-4">
                    {navItems.map(({label, icon: Icon}, key) => (
                        <NavItem key={key} icon={<Icon size={20} />} label={label} />
                    ))}
                </div>

                <div className="p-4 shrink-0 border-t border-gray-800 mt-auto">
                    <button className="flex items-center w-full p-3 rounded-lg text-gray-400 hover:bg-[#14183E] hover:text-white transition-colors">
                        <LogOut size={20} />
                        <span className="ml-4 font-medium">Log out</span>
                    </button>
                </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-y-auto lg:ml-64 relative">
                
                {/* Header */}
                <header className="sticky top-0 z-30 bg-[#F8F9FC] flex justify-between items-center p-4 shadow-sm">
                    <div className="flex items-center space-x-4 w-full max-w-2xl">
                        <button className="p-2 text-xl font-bold lg:hidden text-gray-700" onClick={() => setSidebarOpen(true)}>
                            <Menu size={24} />
                        </button>
                        
                        <div className="relative flex-1 hidden md:block">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search" 
                                className="w-full bg-white border border-gray-100 rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-100 text-sm shadow-sm"
                            />
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsNotificationOpen(true)}
                        className="p-2.5 bg-white rounded-lg shadow-sm border border-gray-100 text-gray-500 hover:text-blue-500 transition-colors relative"
                    >
                        <Bell size={20} />
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                    </button>
                </header>

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
            </main>

            {/* --- NOTIFICATION PANEL OVERLAY --- */}
            {isNotificationOpen && (
                <div 
                    className="fixed inset-0 bg-black/20 z-40 transition-opacity"
                    onClick={() => setIsNotificationOpen(false)}
                />
            )}

            {/* --- MODIFIED: NOTIFICATION PANEL --- */}
            <aside 
                className={`fixed inset-y-0 right-0 z-50 w-full sm:max-w-md bg-[#FAFBFC] shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out sm:rounded-l-3xl ${isNotificationOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="px-6 py-5 flex items-center justify-between border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">Notification</h2>
                    <button 
                        onClick={() => setIsNotificationOpen(false)}
                        className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
                    {notifications.map((notif) => (
                        <div 
                            key={notif.id} 
                            className={`flex items-start p-4 rounded-xl gap-4 ${notif.unread ? 'bg-gray-100/70' : 'bg-transparent'}`}
                        >
                            <div className="mt-1 text-gray-400">
                                {notif.type === 'sent' ? (
                                    <GitPullRequest size={20} className="transform rotate-90" />
                                ) : (
                                    <CheckSquare size={20} />
                                )}
                            </div>
                            <p className="text-sm text-gray-700 leading-relaxed font-medium">
                                {notif.message}
                            </p>
                        </div>
                    ))}
                </div>
            </aside>
            
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

export default DonorDashboard;
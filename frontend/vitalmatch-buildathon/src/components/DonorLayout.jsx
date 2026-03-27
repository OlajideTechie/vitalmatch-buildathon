import { useState, useEffect } from "react";
import { 
  Search, Bell, LayoutDashboard, Star, 
  List, HelpCircle, Settings, LogOut, Menu, X,
  CheckSquare
} from 'lucide-react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import { fetchProfile, fetchNotifications } from "../services/auth";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { getUserCoordinates, getAddressFromCoords } from '../utils/locationUtils';
import { formatTime } from "../utils/formatTime";

function NavItem({ icon, label, to}) {
  return (
    <Link to={to} className="flex items-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 hover:text-blue-600 transition-colors">
      <span>{icon}</span>
      <span className="ml-4 text-sm font-medium">{label}</span>
    </Link>
  );
}

function DonorLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [location, setLocation] = useState('Loading...');
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const locationHandler = useLocation();

    useEffect(() => {
        setSidebarOpen(false);
    }, [locationHandler.pathname]);

    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { logout } = useAuth();

    useEffect(() => {
        const fetchLocation = async () => {
            try {
                const { lat, lon } = await getUserCoordinates();
                const { state } = await getAddressFromCoords(lat, lon);

                setLocation(state || 'Unknown location');
            } catch (err) {
                console.error(err);
                setLocation('Location unavailable');
            }
    };

    fetchLocation();}, []);

    const { token } = useAuth();
    
    const { data, isLoading } = useQuery({
        queryKey: ['profile'],
        queryFn: () => fetchProfile(token),
        enabled: !!token,
    });

    const rating = data?.reward_points || 0; 
    const isRedeemable = rating >= 5;
    
    const {
        data: notificationsData,
        isLoading: notificationsLoading,
        } = useQuery({
        queryKey: ["notifications"],
        queryFn: () => fetchNotifications(token),
        enabled: !!token,
    });

    const notifications = (notificationsData?.results || []).map((notif) => ({
        id: notif.id,
        title: notif.title,
        message: notif.message,
        time: formatTime(notif.created_at),
        unread: !notif.is_read,
    }));

    const unreadCount = notifications.filter(n => n.unread).length;

    const getInitials = (name = '') => {
        return name
            .split(' ')
            .filter(Boolean)
            .map(word => word[0].toUpperCase())
            .slice(0, 2) // limit to 2 letters
            .join('');
    };

    const navItems = [
        { label: "Dashboard", icon: LayoutDashboard, to: "/donor-dashboard" },
        { label: "Donation History", icon: List, to: "/donor-dashboard/donation-history" },
        { label: "Help Center", icon: HelpCircle },
        { label: "Setting", icon: Settings },
    ];

    const handleLogout = () => {
        logout(); // remove token

        queryClient.clear(); // 🔥 wipe all cached data

        navigate("/login"); // redirect
    };

    return (
        <div className="flex h-screen bg-[#F8F9FC] font-sans overflow-hidden">
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 z-50 bg-[#0B0E27] w-64 h-screen shadow transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 flex flex-col`}>
                <div className="p-6 flex items-center justify-between border-b border-gray-800 shrink-0">
                    <div className="text-blue-500 text-xl font-bold tracking-wide">VitalMatch</div>
                    <button className="lg:hidden text-gray-300" onClick={() => setSidebarOpen(prev => !prev)}>
                        <X size={20} />
                    </button>
                </div>
                
                <div className="px-4 py-6 shrink-0">
                    <div className="rounded-xl p-4 flex flex-col items-center justify-center border border-gray-700 bg-[#14183E]">
                        
                        {/* Dynamic Avatar: Uses Initials or default gray circle */}
                        <div className="w-12 h-12 bg-purple-500 rounded-full mb-2 flex items-center justify-center text-white font-bold text-lg">
                            {isLoading ? '...' : getInitials(data?.full_name) || 'U'}
                        </div>
                        
                        {/* Dynamic Name */}
                        <h2 className="text-white font-semibold">
                            {isLoading ? 'Loading...' : data?.full_name || 'Unknown User'}
                        </h2>
                        
                        {/* Dynamic Verification Badge */}
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full flex items-center mt-1 ${
                            data?.is_verified 
                                ? 'bg-[#E5F9F1] text-[#05A660]' 
                                : 'bg-gray-700 text-gray-300'
                        }`}>
                            {isLoading ? (
                                'Loading...'
                            ) : data?.is_verified ? (
                                <>Verified <span className="ml-1">✓</span></>
                            ) : (
                                'Unverified'
                            )}
                        </span>
                        
                        <div className="text-sm mt-4 space-y-3 w-full">
                            {/* Dynamic Blood Group */}
                            <p className="flex justify-between text-gray-300">
                                <span>Blood Group:</span> 
                                <span className="font-semibold text-white">
                                    {isLoading ? '-' : data?.blood_group || 'N/A'}
                                </span>
                            </p>
                            
                            {/* Dynamic Address */}
                            <p className="flex justify-between text-gray-300">
                                <span>Address:</span> 
                                <span className="font-semibold text-white truncate max-w-30 text-right">
                                    {isLoading ? '...' : data?.address || location || 'Unknown'}
                                </span>
                            </p>
                    
                            <div className="flex justify-between items-center text-gray-300">
                                <span>Reward:</span>
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, index) => {
                                        const isFilled = index < rating;
                                        return (
                                            <Star 
                                                key={index} 
                                                size={14} 
                                                fill={isFilled ? "currentColor" : "none"} 
                                                className={isFilled ? "text-yellow-400" : "text-slate-500"} 
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                                                    
                            {/* Next closing div from your original snippet context */}
                            </div> 
                                                    
                            <Link 
                                to={isRedeemable ? "/donor-dashboard/rewards" : "#"}
                                onClick={(e) => {
                                    if (!isRedeemable) e.preventDefault();
                                }}
                                className={`block w-full text-center text-white py-2 px-4 transition rounded-full text-sm font-medium mt-5 ${
                                    isRedeemable 
                                        ? "bg-[#3B82F6] hover:bg-blue-600 shadow-md" 
                                        : "bg-white/10 opacity-50 cursor-not-allowed"
                                }`}
                            >
                                Redeem Reward
                            </Link>
                    </div>
                </div>

                {/* MODIFIED: Changed overflow-hidden to overflow-y-auto and hid the scrollbar */}
                <div className="sidebar-scroll flex-1 px-4 space-y-2 overflow-y-auto whitespace-nowrap pb-4">
                    {navItems.map(({label, icon: Icon, to}, key) => (
                        <NavItem key={key} icon={<Icon size={20} />} label={label} to={to} />
                    ))}
                </div>

                <div className="p-4 shrink-0 border-t border-gray-800 mt-auto">
                    <button onClick={() => setShowLogoutModal(true)} className="flex items-center w-full p-3 rounded-lg text-gray-400 hover:bg-[#14183E] hover:text-white transition-colors">
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
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                        )}
                    </button>
                </header>
                {/* Add Content */}
                <Outlet />
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
                    {notificationsLoading ? (
                        <p className="text-sm text-gray-500">Loading notifications...</p>
                    ) : notifications.length === 0 ? (
                        <p className="text-sm text-gray-500">No notifications yet.</p>
                    ) : (
                        notifications.map((notif) => (
                        <div 
                            key={notif.id} 
                            className={`flex items-start p-4 rounded-xl gap-4 ${
                            notif.unread ? 'bg-gray-100/70' : 'bg-transparent'
                            }`}
                        >
                            <div className="mt-1 text-gray-400">
                            <CheckSquare size={20} />
                            </div>

                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900">
                                    {notif.title}
                                </p>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {notif.message}
                                </p>
                                <span className="text-xs text-gray-400 mt-1 block">
                                    {notif.time}
                                </span>
                            </div>
                        </div>
                        ))
                    )}
                </div>
            </aside>
            {showLogoutModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    
                    {/* Overlay */}
                    <div 
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowLogoutModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm mx-4">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">
                        Confirm Logout
                    </h2>
                    
                    <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to log out?
                    </p>

                    <div className="flex justify-end gap-3">
                        {/* Cancel */}
                        <button
                            onClick={() => setShowLogoutModal(false)}
                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                        >
                            Cancel
                        </button>

                        {/* Confirm */}
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                        >
                            Log out
                        </button>
                    </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DonorLayout;
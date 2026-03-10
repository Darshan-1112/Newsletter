
"use client";
import { useState,useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import Modal from '@/components/Modal';
import toast from 'react-hot-toast';
import { User, LogOut, ChevronDown, Settings,Trash2 } from 'lucide-react';

export default function Dashboard() {
    const [subscribers, setSubscribers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);
    
    // Pagination States
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1
    });

    const router = useRouter();
    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchSubscribers = async () => {
        setLoading(true);
        try {
            // Updated to pass page, limit, and search query parameters
            const res = await api.get(`/subscribers?page=${page}&limit=${limit}&search=${search}`);
            
            // Assuming backend returns { data: [...], pagination: {...} }
            setSubscribers(res.data.data || []);
            setPagination(res.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
        } catch (err) {
            console.error("Failed to fetch", err);
            toast.error('Failed to load subscribers');
        } finally {
            setLoading(false);
        }
    };

    // Re-fetch data when page, limit, or search changes
    useEffect(() => {
        fetchSubscribers();
    }, [page, limit, search]);

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this subscriber?")) return;
        try {
            await api.delete(`/subscribers/${id}`);
            toast.success('Subscriber removed');
            fetchSubscribers();
        } catch (err) {
            toast.error('Error deleting subscriber');
        }
    };

    const handleLogout = async () => {
        await api.post('/auth/logout');
        router.push('/');
    };

    // Calculate "Showing X to Y" indices
    const showingFrom = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
    const showingTo = Math.min(pagination.page * pagination.limit, pagination.total);

    return (
        <div className="min-h-screen bg-[#f8f9fc] font-sans text-[#858796]">
            {/* Topbar */}
           <nav className="bg-white h-16 shadow mb-8 px-8 flex justify-between items-center relative z-40">
                <h1 className="text-xl font-bold text-[#4e73df] tracking-tight">AdminPanel</h1>

                <div className="relative" ref={dropdownRef}>
                    {/* PROFILE ICON BUTTON */}
                    <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-lg transition-colors group"
                    >
                       
                        <div className="w-8 h-8 rounded-full bg-[#4e73df] flex items-center justify-center text-white shadow-sm border border-blue-200">
                            <User size={18} />
                        </div>
                        <ChevronDown size={14} className={`text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* DROPDOWN MENU */}
                    {isProfileOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50 animate-in fade-in zoom-in duration-150">
                           

                            <div className="border-t border-gray-100 my-1"></div>

                            <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                            >
                                <LogOut size={14} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            <div className="max-w-[95%] mx-auto pb-10">
                {/* Header Card Area */}
                <div className="bg-white shadow-sm border border-[#e3e6f0] rounded-t-md p-4 flex justify-between items-center">
                    <h6 className="m-0 font-bold text-[#4e73df] uppercase text-sm">Subscriber Data</h6>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#4e73df] text-white px-3 py-1.5 rounded text-xs font-semibold hover:bg-[#2e59d9] shadow-sm transition"
                    >
                        + Add Subscriber
                    </button>
                </div>

                {/* Table Content Area */}
                <div className="bg-white shadow-sm border border-[#e3e6f0] border-t-0 rounded-b-md p-5">
                    
                    {/* Search & Show Entries controls */}
                    <div className="flex flex-col md:flex-row justify-between mb-4 gap-4">
                        <div className="text-xs flex items-center gap-2">
                            Show 
                            <select 
                                value={limit}
                                onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
                                className="border border-gray-300 rounded px-1 py-0.5 outline-none focus:border-[#4e73df]"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select> 
                            entries
                        </div>
                        <div className="text-xs flex items-center gap-2">
                            Search: 
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                                className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#4e73df] w-48"
                                placeholder="Search email or group..."
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-[#858796] border-collapse border border-[#e3e6f0]">
    <thead>
        <tr className="border-b-2 border-[#e3e6f0] bg-[#f8f9fc]">
            {/* Centered header for ID */}
            <th className="px-2 py-2 text-center font-bold text-gray-700 cursor-pointer hover:text-[#4e73df] transition w-16 border-r border-[#e3e6f0]">
                ID <span className="text-[8px] opacity-50 ml-1">⇅</span>
            </th>
            {/* Centered header for Email */}
            <th className="px-2 py-2 text-center font-bold text-gray-700 cursor-pointer hover:text-[#4e73df] transition border-r border-[#e3e6f0]">
                Email Address <span className="text-[8px] opacity-50 ml-1">⇅</span>
            </th>
            {/* Centered header for Group */}
            <th className="px-2 py-2 text-center font-bold text-gray-700 cursor-pointer hover:text-[#4e73df] transition border-r border-[#e3e6f0]">
                Group <span className="text-[8px] opacity-50 ml-1">⇅</span>
            </th>
            {/* Centered header for Actions */}
            <th className="px-2 py-2 text-center font-bold text-gray-700">
                Actions
            </th>
        </tr>
    </thead>
    <tbody>
        {loading ? (
            <tr>
                <td colSpan="4" className="text-center py-6 italic border-r border-[#e3e6f0]">
                    Loading data...
                </td>
            </tr>
        ) : subscribers.length > 0 ? (
            subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-[#e3e6f0] hover:bg-[#f2f4f9] transition-colors leading-tight">
                    {/* ID Column */}
                    <td className="px-2 py-1.5 text-center align-middle border-r border-[#e3e6f0]">
                        {sub.id}
                    </td>
                    {/* Email Column */}
                    <td className="px-2 py-1.5 font-medium text-gray-800 align-middle border-r border-[#e3e6f0]">
                        {sub.email}
                    </td>
                    {/* Group Column - Centered Badge */}
                    <td className="px-2 py-1.5 text-center align-middle border-r border-[#e3e6f0]">
                        <span className="inline-block px-1.5 py-0.5 bg-[#4e73df] text-white text-[9px] rounded-sm uppercase font-bold tracking-tighter">
                            {sub.group_name}
                        </span>
                    </td>
                    {/* Actions Column - Balanced and Proper Size */}
                    <td className="px-2 py-1.5 text-center align-middle">
                        <button 
                            onClick={() => handleDelete(sub.id)}
                            title="Delete Subscriber"
                            className="group inline-flex items-center justify-center h-8 w-8 rounded-md text-[#e74a3b] hover:bg-[#fff1f0] hover:text-[#be2617] transition-all duration-200 active:scale-90"
                        >
                            <Trash2 
                                size={14} 
                                className="transition-transform duration-200 group-hover:scale-110" 
                            />
                        </button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="4" className="text-center py-10 text-gray-400">
                    No matching records found.
                </td>
            </tr>
        )}
    </tbody>
</table>
                    </div>

                    {/* Pagination Footer */}
                    <div className="flex flex-col md:flex-row justify-between mt-4 items-center">
                        <div className="text-xs">
                            Showing {showingFrom} to {showingTo} of {pagination.total} entries
                        </div>
                        <div className="flex border border-gray-300 rounded overflow-hidden mt-2 md:mt-0">
                            <button 
                                disabled={page === 1}
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                className={`px-3 py-1 text-xs border-r transition ${page === 1 ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100 bg-white text-[#4e73df]'}`}
                            >
                                Previous
                            </button>
                            
                            {/* Simple Page Indicator */}
                            <span className="px-4 py-1 text-xs bg-[#4e73df] text-white font-bold flex items-center">
                                {page}
                            </span>

                            <button 
                                disabled={page >= pagination.totalPages}
                                onClick={() => setPage(p => p + 1)}
                                className={`px-3 py-1 text-xs border-l transition ${page >= pagination.totalPages ? 'bg-gray-100 text-gray-400' : 'hover:bg-gray-100 bg-white text-[#4e73df]'}`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <Modal 
                    closeModal={() => setIsModalOpen(false)} 
                    refreshList={fetchSubscribers} 
                />
            )}
        </div>
    );
}
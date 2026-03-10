"use client";
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { Toaster, toast } from 'react-hot-toast';

import { Table as TableIcon, Send } from 'lucide-react'; // Standard lucide-react icons

export default function DashboardLayout({ children }) {
    const router = useRouter();

const handleSendBroadcast = async () => {
    const confirmSend = confirm("Are you sure you want to send the Imperial Gazette to ALL subscribers?");
    if (!confirmSend) return;

    const loadingToast = toast.loading("Sending Imperial Gazette...");
    try {
        await api.post('/subscribers/send-broadcast', { 
            subject: "The Vovance Imperial Gazette - Edition No. 111" 
        });
        toast.success("Broadcast sent successfully!", { id: loadingToast });
    } catch (err) {
        toast.error("Broadcast failed to send.", { id: loadingToast });
    }
};

    return (
        <div className="flex min-h-screen bg-[#f8f9fc]">
            <Toaster position="top-right" />

            {/* SIDEBAR - SB Admin 2 Style */}
            <aside className="w-56 bg-[#212529] text-white flex flex-col shadow-xl">
                {/* Branding */}
                <div className="p-4 text-lg font-bold flex items-center gap-2 border-b border-gray-700/50 mb-2">
                    <span className="text-gray-200">Start Bootstrap</span>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    {/* CORE SECTION */}

                    {/* ADDONS SECTION */}

                    {/* ACTIVE STATE for Subscribers/Tables */}
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-white/10 text-white rounded-md transition cursor-pointer text-sm font-medium">
                        <TableIcon size={16} />
                        <span>Subscribers</span>
                    </div>
                    <div className="flex items-center gap-3 px-3 py-2.5 bg-white/10 text-white rounded-md transition cursor-pointer text-sm font-medium">
                        <button
                            onClick={() => handleSendBroadcast()}
                            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-white transition w-full text-sm"
                        >
                            <Send size={16} />
                            <span>Send Gazette</span>
                        </button>
                    </div>
                </nav>


            </aside>

            {/* MAIN CONTENT Area */}
            <main className="flex-1 h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
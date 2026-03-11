// "use client";
// import { useRouter, usePathname } from 'next/navigation';
// import { Toaster } from 'react-hot-toast';
// import { Table as TableIcon, Send } from 'lucide-react';

// export default function DashboardLayout({ children }) {
//     const router = useRouter();
//     const pathname = usePathname();

//     return (
//         <div className="flex min-h-screen bg-[#f8f9fc]">
//             <Toaster position="top-right" />

//             {/* SIDEBAR */}
//             <aside className="w-56 bg-[#212529] text-white flex flex-col shadow-xl">
//                 {/* Branding */}
//                 <div className="p-4 text-lg font-bold flex items-center gap-2 border-b border-gray-700/50 mb-2">
//                     <span className="text-gray-200">Start Bootstrap</span>
//                 </div>

//                 <nav className="flex-1 px-3 space-y-1">
//                     {/* Subscribers */}
//                     <button
//                         onClick={() => router.push('/dashboard')}
//                         className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition cursor-pointer text-sm font-medium ${
//                             pathname === '/dashboard'
//                                 ? 'bg-white/10 text-white'
//                                 : 'text-gray-400 hover:text-white hover:bg-white/5'
//                         }`}
//                     >
//                         <TableIcon size={16} />
//                         <span>Subscribers</span>
//                     </button>

//                     {/* Send Gazette — goes DIRECTLY to the Vovance editor */}
//                     <button
//                         onClick={() => router.push('/dashboard/send/vovance')}
//                         className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition cursor-pointer text-sm font-medium ${
//                             pathname?.startsWith('/dashboard/send')
//                                 ? 'bg-white/10 text-white'
//                                 : 'text-gray-400 hover:text-white hover:bg-white/5'
//                         }`}
//                     >
//                         <Send size={16} />
//                         <span>Send Gazette</span>
//                     </button>
//                 </nav>
//             </aside>

//             {/* MAIN CONTENT Area */}
//             <main className="flex-1 h-screen overflow-y-auto">
//                 {children}
//             </main>
//         </div>
//     );
// }
"use client";
import { useRouter, usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import { Table as TableIcon, Send } from 'lucide-react';

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-[#f8f9fc]">
            <Toaster position="top-right" />

            {/* SIDEBAR */}
            <aside className="w-56 bg-[#212529] text-white flex flex-col shadow-xl">
                <div className="p-4 text-lg font-bold flex items-center gap-2 border-b border-gray-700/50 mb-2">
                    <span className="text-gray-200">Start Bootstrap</span>
                </div>

                <nav className="flex-1 px-3 space-y-1">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition cursor-pointer text-sm font-medium ${
                            pathname === '/dashboard'
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <TableIcon size={16} />
                        <span>Subscribers</span>
                    </button>

                    {/* Send Gazette → brand selection page first */}
                    <button
                        onClick={() => router.push('/dashboard/send')}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition cursor-pointer text-sm font-medium ${
                            pathname?.startsWith('/dashboard/send')
                                ? 'bg-white/10 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <Send size={16} />
                        <span>Send Gazette</span>
                    </button>
                </nav>
            </aside>

            <main className="flex-1 h-screen overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
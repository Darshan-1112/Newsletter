// "use client";
// import { useState, useRef } from 'react';
// import { useRouter } from 'next/navigation';
// import api from '@/utils/api';
// import toast, { Toaster } from 'react-hot-toast';
// import { ChevronLeft, Crown, Send } from 'lucide-react';

// export default function VovanceEditorPage() {
//     const router = useRouter();
//     const iframeRef = useRef(null);
//     const [sending, setSending] = useState(false);

//     const handleSendMail = async () => {
//         if (!confirm('Send the Imperial Gazette to ALL subscribers? This cannot be undone.')) return;

//         setSending(true);
//         const loadingToast = toast.loading('Dispatching the Imperial Gazette...');

//         try {
//             // 1. Ask the iframe for the current rendered HTML + subject via postMessage
//             iframeRef.current?.contentWindow?.postMessage({ type: 'GET_EXPORT_HTML' }, '*');

//             // 2. Wait for iframe to respond with the HTML
//             const { html, subject } = await new Promise((resolve, reject) => {
//                 const timeout = setTimeout(() => reject(new Error('Editor did not respond. Please try again.')), 6000);
//                 const handler = (event) => {
//                     if (event.data?.type === 'EXPORT_HTML') {
//                         clearTimeout(timeout);
//                         window.removeEventListener('message', handler);
//                         resolve({ html: event.data.html, subject: event.data.subject });
//                     }
//                 };
//                 window.addEventListener('message', handler);
//             });

//             // 3. Post to your existing backend route
//             await api.post('/subscribers/send-broadcast', {
//                 subject: subject || 'The Vovance Imperial Gazette',
//                 htmlContent: html,
//             });

//             toast.success('Gazette dispatched to all subscribers!', { id: loadingToast });
//         } catch (err) {
//             toast.error(err.response?.data?.message || err.message || 'Failed to send.', { id: loadingToast });
//         } finally {
//             setSending(false);
//         }
//     };

//     return (
//         <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#1a1208' }}>
//             <Toaster position="top-right" />

//             {/* ── Top bar matching your editor's dark theme ── */}
//             <div
//                 className="flex-shrink-0 flex items-center justify-between px-5 z-50"
//                 style={{
//                     height: 52,
//                     background: '#1a1208',
//                     borderBottom: '2px solid #b8973a',
//                 }}
//             >
//                 {/* Left */}
//                 <div className="flex items-center gap-4">
//                     <button
//                         onClick={() => router.push('/dashboard/send')}
//                         className="flex items-center gap-1 transition text-xs font-medium"
//                         style={{ color: '#b8973a', fontFamily: "'Cormorant Garamond', serif", letterSpacing: '0.1em' }}
//                     >
//                         <ChevronLeft size={14} />
//                         Back
//                     </button>
//                     <div style={{ width: 1, height: 16, background: 'rgba(184,151,58,0.3)' }}></div>
//                     <div className="flex items-center gap-2">
//                         <div
//                             className="flex items-center justify-center rounded"
//                             style={{ width: 20, height: 20, background: 'linear-gradient(135deg, #3a2e18, #b8973a)' }}
//                         >
//                             <Crown size={10} color="#f5f0e8" />
//                         </div>
//                         <span
//                             style={{
//                                 fontFamily: "'Playfair Display', serif",
//                                 fontSize: 11,
//                                 letterSpacing: '0.2em',
//                                 textTransform: 'uppercase',
//                                 color: '#d4af5a',
//                             }}
//                         >
//                             Imperial Gazette · Newsletter Editor
//                         </span>
//                     </div>
//                 </div>

//                 {/* Right — Send Mail button */}
//                 <button
//                     onClick={handleSendMail}
//                     disabled={sending}
//                     className="flex items-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
//                     style={{
//                         background: '#b8973a',
//                         color: '#1a1208',
//                         fontFamily: "'Cormorant Garamond', serif",
//                         fontSize: 11,
//                         letterSpacing: '0.14em',
//                         textTransform: 'uppercase',
//                         fontWeight: 700,
//                         padding: '6px 20px',
//                         border: '1px solid #b8973a',
//                         cursor: sending ? 'not-allowed' : 'pointer',
//                     }}
//                     onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#d4af5a'; }}
//                     onMouseLeave={e => { e.currentTarget.style.background = '#b8973a'; }}
//                 >
//                     <Send size={13} />
//                     {sending ? 'Dispatching...' : 'Send Mail'}
//                 </button>
//             </div>

//             {/* ── Your HTML editor fills all remaining height ── */}
//             <iframe
//                 ref={iframeRef}
//                 src="/newsletter-editor.html"
//                 className="flex-1 w-full"
//                 style={{ border: 'none', display: 'block' }}
//                 title="Vovance Newsletter Editor"
//             />
//         </div>
//     );
// }
"use client";
import { useRouter } from 'next/navigation';
import { Crown, Sparkles, ArrowRight, ChevronLeft } from 'lucide-react';

export default function SendGazettePage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#f8f9fc] flex flex-col">
            {/* Top breadcrumb bar */}
            <div className="bg-white border-b border-[#e3e6f0] px-8 py-4 flex items-center gap-3">
                <button
                    onClick={() => router.push('/dashboard')}
                    className="flex items-center gap-1 text-xs text-[#858796] hover:text-[#4e73df] transition"
                >
                    <ChevronLeft size={14} />
                    Back to Dashboard
                </button>
                <span className="text-[#e3e6f0]">/</span>
                <span className="text-xs font-semibold text-[#4e73df]">Send Gazette</span>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center px-8 py-16">
                <div className="text-center mb-12">
                    <p className="text-xs font-bold uppercase tracking-widest text-[#b8973a] mb-2">
                        Newsletter Broadcast
                    </p>
                    <h1 className="text-3xl font-bold text-[#1a1208] mb-3">Choose Your Brand</h1>
                    <p className="text-sm text-[#858796] max-w-md">
                        Select the brand newsletter you want to compose and send to your subscribers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">

                    {/* VOVANCE — clickable */}
                    <button
                        onClick={() => router.push('/dashboard/send/vovance')}
                        className="group relative bg-white border-2 border-[#e3e6f0] hover:border-[#b8973a] rounded-2xl p-8 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden"
                    >
                        {/* Glow bg */}
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                            <div className="w-full h-full rounded-full bg-[#b8973a] blur-2xl translate-x-8 -translate-y-8"></div>
                        </div>

                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3a2e18] to-[#b8973a] flex items-center justify-center mb-5 shadow-lg">
                            <Crown size={22} className="text-[#f5f0e8]" />
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#b8973a] mb-1">
                            Imperial Gazette
                        </p>
                        <h2 className="text-xl font-bold text-[#1a1208] mb-2">Vovance</h2>
                        <p className="text-xs text-[#858796] leading-relaxed mb-6">
                            The sovereign voice of intelligence. Compose and send the royal gazette
                            to all Vovance subscribers using the full newsletter editor.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#b8973a] group-hover:gap-3 transition-all">
                            <span>Open Editor</span>
                            <ArrowRight size={14} />
                        </div>

                        {/* Bottom accent line */}
                        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-[#3a2e18] to-[#b8973a] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-2xl"></div>
                    </button>

                    {/* AMBLIAI — coming soon, not clickable */}
                    <div className="relative bg-white border-2 border-[#e3e6f0] rounded-2xl p-8 text-left opacity-55 overflow-hidden select-none">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a1f3c] to-[#4e73df] flex items-center justify-center mb-5 shadow-lg">
                            <Sparkles size={22} className="text-white" />
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[#4e73df] mb-1">
                            Coming Soon
                        </p>
                        <h2 className="text-xl font-bold text-[#1a1208] mb-2">Ambliai</h2>
                        <p className="text-xs text-[#858796] leading-relaxed mb-6">
                            The Ambliai newsletter editor is under construction and will be
                            available in the next release.
                        </p>
                        <div className="flex items-center gap-2 text-xs font-bold text-[#858796]">
                            <span>Not Available Yet</span>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
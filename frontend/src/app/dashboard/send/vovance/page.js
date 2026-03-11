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

//             // 3. Post to backend
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

//             {/* Top bar */}
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
//                         onClick={() => router.push('/dashboard')}
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

//             {/* iframe loads newsletter-editor.html from public/ folder */}
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
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { ChevronLeft, Crown, Send } from 'lucide-react';

export default function VovanceEditorPage() {
    const router = useRouter();
    const iframeRef = useRef(null);
    const [sending, setSending] = useState(false);

    const handleSendMail = async () => {
        if (!confirm('Send the Imperial Gazette to ALL subscribers? This cannot be undone.')) return;

        setSending(true);
        const loadingToast = toast.loading('Dispatching the Imperial Gazette...');

        try {
            // 1. Ask the iframe for the current HTML via postMessage
            iframeRef.current?.contentWindow?.postMessage({ type: 'GET_EXPORT_HTML' }, '*');

            // 2. Wait for iframe to respond
            const { html, subject } = await new Promise((resolve, reject) => {
                const timeout = setTimeout(
                    () => reject(new Error('Editor did not respond. Please try again.')),
                    6000
                );
                const handler = (event) => {
                    if (event.data?.type === 'EXPORT_HTML') {
                        clearTimeout(timeout);
                        window.removeEventListener('message', handler);
                        resolve({ html: event.data.html, subject: event.data.subject });
                    }
                };
                window.addEventListener('message', handler);
            });

            // 3. Send to backend
            await api.post('/subscribers/send-broadcast', {
                subject: subject || 'The Vovance Imperial Gazette',
                htmlContent: html,
            });

            toast.success('Gazette dispatched to all subscribers!', { id: loadingToast });
        } catch (err) {
            toast.error(
                err.response?.data?.message || err.message || 'Failed to send.',
                { id: loadingToast }
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden" style={{ background: '#1a1208' }}>
            <Toaster position="top-right" />

            {/* Top bar */}
            <div
                className="flex-shrink-0 flex items-center justify-between px-5 z-50"
                style={{
                    height: 52,
                    background: '#1a1208',
                    borderBottom: '2px solid #b8973a',
                }}
            >
                {/* Left — back to brand selection */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/dashboard/send')}
                        className="flex items-center gap-1 transition text-xs font-medium"
                        style={{
                            color: '#b8973a',
                            fontFamily: "'Cormorant Garamond', serif",
                            letterSpacing: '0.1em',
                        }}
                    >
                        <ChevronLeft size={14} />
                        Back
                    </button>
                    <div style={{ width: 1, height: 16, background: 'rgba(184,151,58,0.3)' }} />
                    <div className="flex items-center gap-2">
                        <div
                            className="flex items-center justify-center rounded"
                            style={{
                                width: 20,
                                height: 20,
                                background: 'linear-gradient(135deg, #3a2e18, #b8973a)',
                            }}
                        >
                            <Crown size={10} color="#f5f0e8" />
                        </div>
                        <span
                            style={{
                                fontFamily: "'Playfair Display', serif",
                                fontSize: 11,
                                letterSpacing: '0.2em',
                                textTransform: 'uppercase',
                                color: '#d4af5a',
                            }}
                        >
                            Imperial Gazette · Newsletter Editor
                        </span>
                    </div>
                </div>

                {/* Right — Send Mail */}
                <button
                    onClick={handleSendMail}
                    disabled={sending}
                    className="flex items-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{
                        background: '#b8973a',
                        color: '#1a1208',
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 11,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        fontWeight: 700,
                        padding: '6px 20px',
                        border: '1px solid #b8973a',
                        cursor: sending ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={e => { if (!sending) e.currentTarget.style.background = '#d4af5a'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#b8973a'; }}
                >
                    <Send size={13} />
                    {sending ? 'Dispatching...' : 'Send Mail'}
                </button>
            </div>

            {/* Editor iframe — loads from public/newsletter-editor.html */}
            <iframe
                ref={iframeRef}
                src="/newsletter-editor.html"
                className="flex-1 w-full"
                style={{ border: 'none', display: 'block' }}
                title="Vovance Newsletter Editor"
            />
        </div>
    );
}
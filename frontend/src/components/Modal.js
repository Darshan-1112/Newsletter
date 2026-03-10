"use client";
import { useState } from 'react';
import api from '@/utils/api';
import toast from 'react-hot-toast';

export default function Modal({ closeModal, refreshList }) {
    const [email, setEmail] = useState('');
    const [groupName, setGroupName] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            console.log(groupName);
            await api.post('/subscribers', {email,group_name: groupName});
            toast.success('New subscriber added!');
            refreshList(); 
            closeModal();  
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to add");
        }
    };

    return (
        /* BACKDROP: 
           - bg-white/30: 30% transparent white
           - backdrop-blur-md: This creates the glass/blur effect
        */
       <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 backdrop-blur-md transition-all">
            
            {/* MODAL CARD: Industry standard shadow and border */}
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-md p-8 relative mx-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1">Add Subscriber</h3>
                <p className="text-sm text-gray-500 mb-6">Enter details to categorize and save the member.</p>
                
                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-xs mb-4 border border-red-100">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5 tracking-widest">
                            Email Address
                        </label>
                        <input 
                            type="email"
                            autoFocus
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-gray-700 text-sm transition-all"
                            placeholder="name@example.com"
                        />
                    </div>

                    {/* Group Input */}
                    <div>
                        <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1.5 tracking-widest">
                            Group Name
                        </label>
                        <input 
                            type="text" 
                            required 
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none text-gray-700 text-sm transition-all"
                            placeholder="e.g. Newsletter"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end items-center gap-3 pt-4 border-t border-gray-50">
                        <button 
                            type="button" 
                            onClick={closeModal}
                            className="px-5 py-2 text-sm font-bold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-8 py-2.5 bg-blue-600 text-white text-sm rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            Save Member
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
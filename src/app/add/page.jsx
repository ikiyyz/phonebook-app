'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createPhonebookAsync } from '@/redux/phonebookSlice';
import { toast } from 'react-hot-toast';

export default function AddPhonebookPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Simple validation
        if (!name.trim()) {
            setError('Nama tidak boleh kosong');
            return;
        }
        if (!phone.trim()) {
            setError('Nomor telepon tidak boleh kosong');
            return;
        }

        setLoading(true);
        try {
            await dispatch(createPhonebookAsync({ name: name.trim(), phone: phone.trim() })).unwrap();
            toast.success('Contact added successfully!');
            router.back();
        } catch (error) {
            const message = error?.response?.data?.message || error?.message || 'Failed to add contact';
            setError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-16 px-10 py-16 bg-white rounded-xl border border-gray-100 shadow-xl">
            <h1 className="text-2xl font-bold mb-6">Add Contact</h1>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="px-4 py-2 border border-gray-100 rounded-lg shadow-inner bg-gray-100 focus:outline-none focus:shadow-md"
                    disabled={loading}
                    required
                />
                
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    className="px-4 py-2 border border-gray-100 rounded-lg shadow-inner bg-gray-100 focus:outline-none focus:shadow-md"
                    disabled={loading}
                    required
                />
                
                {error && <p className="text-red-600">{error}</p>}
                
                <div className="flex flex-row-reverse gap-2 mt-5">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Adding..." : "Add Contact"}
                    </button>
                    
                    <button
                        type="button"
                        onClick={() => router.back()}
                        disabled={loading}
                        className="px-4 py-2 flex-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
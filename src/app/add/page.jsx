'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createPhonebookAsync } from '@/redux/phonebookSlice';
import { toast } from 'react-hot-toast';

export default function AddPhonebookPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [form, setForm] = useState({ name: '', phone: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!form.name.trim() || !form.phone.trim()) {
            setError('Name and phone are required.');
            return;
        }
        setLoading(true);
        try {
            await dispatch(createPhonebookAsync(form)).unwrap();
            toast.success('Contact added successfully!');
            router.push('/');
        } catch (error) {
            setError(error?.message || 'Failed to add contact');
            toast.error('Failed to add contact');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-16 px-10 py-16 bg-white rounded-xl border border-gray-100 shadow-xl">
            <h1 className="text-2xl font-bold mb-6">Add Contact</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="px-4 py-2 border border-gray-100 rounded-lg shadow-inner bg-gray-100 focus:outline-none focus:shadow-md"
                    required
                />
                <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="px-4 py-2 border border-gray-100 rounded-lg shadow-inner bg-gray-100 focus:outline-none focus:shadow-md"
                    required
                />
                {error && <p className="text-red-600">{error}</p>}
                <div className="flex flex-row-reverse gap-2 mt-5">
                    <button
                        type="submit"
                        className="px-4 py-2 flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Adding..." : "Add Contact"}
                    </button>
                    <button
                        type="button"
                        className="px-4 py-2 flex-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                        onClick={() => router.push('/phonebook')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

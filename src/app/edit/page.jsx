'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPhonebookByIdAsync, updatePhonebookAsync } from '@/redux/phonebookSlice';
import { toast } from 'react-hot-toast';

export default function EditPhonebookPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch();
    const id = searchParams.get('id');
    const phonebookState = useSelector((state) => state.phonebook);
    const currentPhonebook = phonebookState.currentPhonebook;
    const [form, setForm] = useState({ name: '', phone: '', email: '', avatar: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchPhonebookByIdAsync(id));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (currentPhonebook) {
            setForm({
                name: currentPhonebook.name,
                phone: currentPhonebook.phone,
                email: currentPhonebook.email,
                avatar: currentPhonebook.avatar || ''
            });
        }
    }, [currentPhonebook]);

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
            await dispatch(updatePhonebookAsync({ id, ...form })).unwrap();
            toast.success('Contact updated successfully!');
            router.push('/phonebook');
        } catch (error) {
            setError(error?.message || 'Failed to update contact');
            toast.error('Failed to update contact');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto mt-16 px-10 py-16 bg-white rounded-xl border border-gray-100 shadow-xl">
            <h1 className="text-2xl font-bold mb-6">Edit Contact</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {currentPhonebook && (
                    <div className="w-32 h-32 relative mb-4">
                        <img
                            src={form.avatar || '/avatar.png'}
                            alt="Contact Avatar"
                            className="w-full h-full rounded-full object-cover border"
                        />
                    </div>
                )}
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
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone"
                    className="px-4 py-2 border border-gray-100 rounded-lg shadow-inner bg-gray-100 focus:outline-none focus:shadow-md"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="px-4 py-2 border border-gray-100 rounded-lg shadow-inner bg-gray-100 focus:outline-none focus:shadow-md"
                />
                <input
                    type="url"
                    name="avatar"
                    value={form.avatar}
                    onChange={handleChange}
                    placeholder="Avatar URL"
                    className="px-4 py-2 border border-gray-100 rounded-lg shadow-inner bg-gray-100 focus:outline-none focus:shadow-md"
                />
                {error && <p className="text-red-600">{error}</p>}
                <div className="flex flex-row-reverse gap-2 mt-5">
                    <button
                        type="submit"
                        className="px-4 py-2 flex-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        disabled={loading}
                    >
                        {loading ? "Updating..." : "Update Contact"}
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

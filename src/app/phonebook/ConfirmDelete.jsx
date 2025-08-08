'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { deletePhonebookAsync } from '@/redux/phonebookSlice';
import { toast } from 'react-hot-toast';

export default function ConfirmDelete({
    open,
    title = 'Delete Contact',
    message = 'Are you sure you want to delete this contact?',
    onClose,
    onConfirm,
    contactId,
}) {
    const dispatch = useDispatch();

    if (!open) return null;

    const handleDelete = async () => {
        try {
            await dispatch(deletePhonebookAsync(contactId)).unwrap();
            toast.success('Contact deleted successfully!');
            onClose();
        } catch (error) {
            toast.error('Failed to delete contact');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-lg p-6 min-w-[300px] flex flex-col items-center">
                <div className="font-bold text-lg mb-2">{title}</div>
                <div className="text-gray-700 mb-4 text-center">{message}</div>
                <div className="flex gap-4 mt-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                    >
                        No!
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold"
                    >
                        Sure!
                    </button>
                </div>
            </div>
        </div>
    );
}

'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { deletePhonebook } from '@/redux/phonebookSlice';
import { toast } from 'react-hot-toast';

export default function ConfirmDelete({
    open,
    title = 'Hapus Kontak',
    contactName = 'kontak ini',
    onClose,
    onConfirm,
    contactId,
}) {
    const dispatch = useDispatch();

    if (!open) return null;

    const handleDelete = async () => {
        try {
            if (typeof onConfirm === 'function') {
                await onConfirm();
            } else {
                if (contactId == null) {
                    toast.error('ID kontak tidak valid');
                    return;
                }
                await dispatch(deletePhonebook(contactId)).unwrap();
            }
            toast.success('Kontak berhasil dihapus!');
            onClose();
        } catch (error) {
            toast.error('Gagal menghapus kontak');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-4">
                <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {title}
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Anda yakin ingin menghapus {contactName}? Tindakan ini akan menghapus data secara permanen.
                    </p>
                </div>
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}
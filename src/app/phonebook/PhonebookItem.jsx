'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePhonebookAsync, deletePhonebookAsync } from '@/redux/phonebookSlice';
import Avatar from './Avatar.jsx';
import ConfirmDelete from './ConfirmDelete.jsx';
import { Pencil, Trash2, Save, XCircle, Hourglass } from 'lucide-react';

export default function PhonebookItem({ contact }) {
    const dispatch = useDispatch();
    const [isEdit, setIsEdit] = useState(false);
    const [editedContact, setEditedContact] = useState({
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        avatar: contact.avatar
    });
    const [deleting, setDeleting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const save = async () => {
        try {
            await dispatch(updatePhonebookAsync({ id: contact.id, ...editedContact })).unwrap();
            setIsEdit(false);
        } catch (error) {
            console.error('Failed to update contact:', error);
        }
    };

    if (isEdit) {
        return (
            <div className="shadow-inner bg-white rounded-2xl p-4 flex items-center gap-5 border border-gray-200">
                <div>
                    <Avatar src={editedContact.avatar || '/avatar.png'} size={48} />
                </div>
                <div className="flex flex-col w-full gap-1">
                    <input
                        type="text"
                        value={editedContact.name}
                        onChange={(e) => setEditedContact({ ...editedContact, name: e.target.value })}
                        className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                        placeholder="Name"
                    />
                    <input
                        type="text"
                        value={editedContact.phone}
                        onChange={(e) => setEditedContact({ ...editedContact, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                        placeholder="Phone"
                    />
                    <input
                        type="email"
                        value={editedContact.email}
                        onChange={(e) => setEditedContact({ ...editedContact, email: e.target.value })}
                        className="w-full px-4 py-2 bg-white text-gray-900 border border-gray-400 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-base"
                        placeholder="Email"
                    />
                    <div className="flex gap-3 mt-3">
                        <button
                            type="button"
                            onClick={() => setIsEdit(false)}
                            className="hover:cursor-pointer text-red-600 hover:text-red-700 transition"
                        >
                            <XCircle />
                        </button>
                        <button
                            type="button"
                            onClick={save}
                            className="hover:cursor-pointer text-blue-600 hover:text-blue-700 transition"
                        >
                            <Save />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="shadow-inner bg-white rounded-2xl p-4 flex items-center gap-5 border border-gray-200">
            <div>
                <Avatar src={contact.avatar || '/avatar.png'} size={48} />
            </div>
            <div className="flex flex-col w-full gap-1">
                <div className="font-semibold text-xl text-gray-900">{contact.name}</div>
                <div className="text-gray-700 text-base">{contact.phone}</div>
                <div className="text-gray-600 text-sm">{contact.email}</div>
                <div className="flex gap-3 mt-3">
                    <button
                        type="button"
                        onClick={() => setIsEdit(true)}
                        className="hover:cursor-pointer text-yellow-600 hover:text-yellow-700 transition"
                    >
                        <Pencil />
                    </button>
                    <button
                        type="button"
                        disabled={deleting}
                        onClick={() => setShowConfirm(true)}
                        className={`hover:cursor-pointer text-red-600 hover:text-red-700 transition ${
                            deleting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                    >
                        {deleting ? <Hourglass /> : <Trash2 />}
                    </button>
                    <ConfirmDelete
                        open={showConfirm}
                        onClose={() => setShowConfirm(false)}
                        onConfirm={async () => {
                            setShowConfirm(false);
                            setDeleting(true);
                            await dispatch(deletePhonebookAsync(contact.id)).unwrap();
                            setDeleting(false);
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

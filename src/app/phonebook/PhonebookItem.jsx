'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updatePhonebook, deletePhonebook } from '@/redux/phonebookSlice';
import { Pencil, Trash2, Save, X, Loader2, Camera } from 'lucide-react';
import ConfirmDelete from './ConfirmDelete.jsx';
import Avatar from './Avatar.jsx';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function PhonebookItem({ phonebook }) {
    const dispatch = useDispatch();
    const router = useRouter();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(phonebook.name);
    const [phone, setPhone] = useState(phonebook.phone);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handleEdit = () => {
        setName(phonebook.name);
        setPhone(phonebook.phone);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setName(phonebook.name);
        setPhone(phonebook.phone);
        setIsEditing(false);
    };

    const handleSave = async () => {
        if (!name.trim() || !phone.trim())
            return toast.error('Name and phone are required');
        if (name === phonebook.name && phone === phonebook.phone)
            return setIsEditing(false);

        setIsUpdating(true);
        try {
            await dispatch(updatePhonebook({ id: phonebook.id, name, phone })).unwrap();
            toast.success('Contact updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.message || 'Failed to update contact (rolled back)');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async () => {
        setShowDeleteConfirm(false);
        setIsDeleting(true);
        try {
            await dispatch(deletePhonebook(phonebook.id)).unwrap();
            toast.success('Contact deleted');
        } catch {
            toast.error('Failed to delete contact (rolled back)');
        } finally {
            setIsDeleting(false);
        }
    };

    const cardClass = `bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 h-56 flex flex-col ${isDeleting ? 'opacity-50' : ''}`;

    // Edit Mode
    if (isEditing) {
        return (
            <div className={cardClass}>
                <div className="flex justify-center mb-4">
                    <Avatar src={phonebook.avatar} size={60} />
                </div>

                <div className="flex-1 space-y-2">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isUpdating}
                        className="w-full px-2 py-1 text-sm text-center border rounded-md"
                        placeholder="Name"
                    />
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={isUpdating}
                        className="w-full px-2 py-1 text-sm text-center border rounded-md"
                        placeholder="Phone"
                    />
                </div>

                <div className="flex justify-center space-x-2 mt-2">
                    <button onClick={handleCancel} disabled={isUpdating}>
                        <X size={16} />
                    </button>
                    <button onClick={handleSave} disabled={isUpdating}>
                        {isUpdating ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Save size={16} />
                        )}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={cardClass}>
                {/* Avatar dengan hover overlay untuk edit */}
                <div className="relative flex justify-center mb-3 group">
                    <button
                        type="button"
                        onClick={() => router.push(`/edit-avatar?id=${phonebook.id}`)}
                        className="relative"
                    >
                        <Avatar
                            src={phonebook.avatar}
                            size={70}
                            alt={`${phonebook.name}'s avatar`}
                        />
                        <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 flex justify-center items-center transition">
                            <Camera className="text-white" size={20} />
                        </div>
                    </button>
                </div>

                <div className="flex-1 text-center space-y-1">
                    <h3 className="text-sm font-medium line-clamp-1">
                        {phonebook.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-1">
                        {phonebook.phone}
                    </p>
                    {phonebook.email && (
                        <p className="text-xs text-gray-500 truncate">
                            {phonebook.email}
                        </p>
                    )}
                </div>

                <div className="flex justify-center space-x-3 mt-3">
                    <button onClick={handleEdit} disabled={isDeleting}>
                        <Pencil size={16} />
                    </button>
                    <button onClick={() => setShowDeleteConfirm(true)} disabled={isDeleting}>
                        {isDeleting ? (
                            <Loader2 size={16} className="animate-spin" />
                        ) : (
                            <Trash2 size={16} />
                        )}
                    </button>
                </div>
            </div>

            <ConfirmDelete
                open={showDeleteConfirm}
                onClose={() => setShowDeleteConfirm(false)}
                onConfirm={handleDelete}
                contactName={phonebook.name}
            />
        </>
    );
}

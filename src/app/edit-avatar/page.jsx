'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';
import Avatar from '../phonebook/Avatar.jsx';
import { updatePhonebook } from '@/redux/phonebookSlice';

export default function EditAvatarPage() {
    const router = useRouter()
    const searchParams = useSearchParams();
    const dispatch = useDispatch();

    const id = searchParams.get('id');
    const phonebookFromStore = useSelector(state =>
        state.phonebook.items.find(pb => pb.id === id)
    );

    const [preview, setPreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (phonebookFromStore?.avatar) {
            setPreview(phonebookFromStore.avatar);
            return;
        }

        if (!id) return;
        (async () => {
            try {
                const res = await fetch(`/api/phonebooks/${id}`);
                if (!res.ok) throw new Error('Gagal mengambil data kontak');
                const data = await res.json();
                if (data?.avatar) setPreview(data.avatar);
            } catch (error) {
                console.error(error);
                toast.error(error.message || 'Gagal memuat data kontak');
            }
        })();
    }, [id, phonebookFromStore]);

    // Handle file input change
    const handleFileChange = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) return toast.error('Please upload an image file');
        if (file.size > 2 * 1024 * 1024) return toast.error('Image size should be less than 2MB');

        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
    }, []);

    // Upload avatar
    const handleUpload = useCallback(async () => {
        if (!preview || !fileInputRef.current?.files?.[0]) return toast.error('Please select an image');

        const formData = new FormData();
        formData.append('avatar', fileInputRef.current.files[0]);
        formData.append('id', id);

        setIsUploading(true);
        try {
            const res = await fetch('/api/phonebooks/avatar', { method: 'POST', body: formData });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || 'Failed to upload image');

            if (result.data?.avatar) {
                // Update redux store supaya list dan edit page sinkron
                dispatch(updatePhonebook({ id, avatar: result.data.avatar }));
                setPreview(result.data.avatar);
            }

            toast.success('Avatar berhasil diupdate');
            router.push('/');
        } catch (error) {
            console.error(error);
            toast.error(error.message || 'Gagal mengupdate avatar');
        } finally {
            setIsUploading(false);
        }
    }, [preview, id, dispatch, router]);

    const handleCancel = useCallback(() => router.push('/'), [router]);

    if (!id) return <p className="text-center mt-10">ID tidak ditemukan</p>;

    return (
        <div className="max-w-md mx-auto mt-10 p-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
                {/* Header */}
                <div className="flex items-center mb-6">
                    <button onClick={handleCancel} className="p-2 hover:bg-gray-100 rounded-full mr-4">
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Update Avatar</h1>
                </div>

                {/* Avatar Preview */}
                <div className="flex flex-col items-center mb-6">
                    <Avatar src={preview} alt="Profile" size={160} className="w-40 h-40 mb-4" />
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={isUploading}
                    />
                    <div className="flex gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            disabled={isUploading}
                        >
                            <Upload size={16} className="mr-2" /> Choose Photo
                        </button>
                        <button
                            type="button"
                            onClick={handleUpload}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                            disabled={!preview || isUploading}
                        >
                            {isUploading ? <Loader2 className="animate-spin mr-2" size={16} /> : 'Save Changes'}
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500">JPG, PNG, GIF. Max size 2MB</p>
            </div>
        </div>
    );
}

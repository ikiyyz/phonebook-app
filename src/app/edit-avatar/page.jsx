"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updatePhonebook } from "@/redux/phonebookSlice";

export default function EditAvatarPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const phonebookId = searchParams.get("id");
    const dispatch = useDispatch();

    const contact = useSelector((state) =>
        state.phonebook.items.find((c) => String(c.id) === String(phonebookId))
    );

    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(contact?.avatar || "/avatar.svg");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef();

    useEffect(() => {
        if (contact?.avatar) {
            setPreview(contact.avatar);
        }
    }, [contact?.avatar]);

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;

        if (!f.type.startsWith("image/")) {
            alert("Please upload an image file");
            return;
        }
        if (f.size > 2 * 1024 * 1024) {
            alert("Image size must be less than 2MB");
            return;
        }

        setFile(f);
        setPreview(URL.createObjectURL(f));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !phonebookId) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("avatar", file);
        formData.append("id", phonebookId);

        try {
            const res = await fetch("/api/phonebooks/avatar", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to upload avatar");
            const data = await res.json(); // { avatar: "url" }

            dispatch(updatePhonebook({ id: Number(phonebookId), avatar: data.avatar }));

            router.back();
        } catch (err) {
            console.error(err);
            alert(err.message || "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-4">
            <div className="bg-white border border-gray-200 rounded-xl shadow-md p-6">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-full mr-4"
                        disabled={uploading}
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">Update Avatar</h1>
                </div>

                <div className="flex flex-col items-center mb-6">
                    <div className="relative w-40 h-40 mb-4">
                        <Image
                            src={preview}
                            alt="Avatar Preview"
                            fill
                            className="rounded-full object-cover border"
                        />
                    </div>

                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        disabled={uploading}
                    />

                    <div className="flex gap-3 w-full">
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                            disabled={uploading}
                        >
                            <Upload size={16} className="mr-2" /> Choose Photo
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="flex-1 flex items-center justify-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                            disabled={!file || uploading}
                        >
                            {uploading ? (
                                <Loader2 className="animate-spin mr-2" size={16} />
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </div>

                <p className="text-center text-sm text-gray-500">
                    JPG, PNG, GIF. Max size 2MB
                </p>
            </div>
        </div>
    );
}

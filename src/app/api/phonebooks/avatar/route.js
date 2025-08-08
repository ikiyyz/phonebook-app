import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

// Konstanta untuk konfigurasi
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'avatars');
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB

// Fungsi untuk validasi file
function validateFile(file) {
    if (!file) {
        return { isValid: false, error: 'File tidak ditemukan' };
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return {
            isValid: false,
            error: 'Format file tidak didukung. Gunakan format: ' + ALLOWED_FILE_TYPES.join(', ')
        };
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            isValid: false,
            error: `Ukuran file terlalu besar. Maksimal ${MAX_FILE_SIZE / (1024 * 1024)}MB`
        };
    }

    return { isValid: true };
}

// POST /api/avatar - Upload avatar
export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('avatar');
        const id = formData.get('id');

        // Validasi input
        if (!file || !id) {
            return NextResponse.json(
                { success: false, message: 'File dan ID kontak harus diisi' },
                { status: 400 }
            );
        }

        // Validasi ID
        const contactId = Number(id);
        if (isNaN(contactId) || contactId <= 0) {
            return NextResponse.json(
                { success: false, message: 'ID kontak tidak valid' },
                { status: 400 }
            );
        }

        // Validasi file
        const validation = validateFile(file);
        if (!validation.isValid) {
            return NextResponse.json(
                { success: false, message: validation.error },
                { status: 400 }
            );
        }

        // Buat direktori jika belum ada
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        // Generate nama file unik
        const fileExt = file.name.split('.').pop();
        const fileName = `avatar_${contactId}_${Date.now()}.${fileExt}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        // Simpan file
        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));

        // Update database
        const avatarUrl = `/avatars/${fileName}`;

        const updatedContact = await prisma.contact.update({
            where: { id: contactId },
            data: { avatar: avatarUrl },
        });

        if (!updatedContact) {
            // Hapus file yang sudah diupload jika update database gagal
            try {
                await fs.unlink(filePath);
            } catch (error) {
                console.error('Gagal menghapus file yang diupload:', error);
            }

            return NextResponse.json(
                { success: false, message: 'Kontak tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Avatar berhasil diupload',
            data: { avatar: avatarUrl }
        });

    } catch (error) {
        console.error('Error saat mengupload avatar:', error);

        return NextResponse.json(
            {
                success: false,
                message: 'Terjadi kesalahan saat mengupload avatar',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}
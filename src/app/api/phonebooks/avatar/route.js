import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'avatars');
const ALLOWED_EXTS = ['jpg', 'jpeg', 'png', 'webp'];

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('avatar');
        const id = Number(formData.get('id'));

        if (!file || !id) {
            return NextResponse.json({ success: false, message: 'File dan ID wajib diisi' }, { status: 400 });
        }

        // Validasi ekstensi
        const fileExt = file.name.split('.').pop().toLowerCase();
        if (!ALLOWED_EXTS.includes(fileExt)) {
            return NextResponse.json({ success: false, message: 'Format file tidak didukung' }, { status: 400 });
        }

        // Buat folder upload kalau belum ada
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        // Hapus avatar lama jika ada
        const existing = await prisma.phonebook.findUnique({ where: { id } });
        if (existing?.avatar) {
            const oldPath = path.join(process.cwd(), 'public', existing.avatar);
            try {
                await fs.unlink(oldPath);
            } catch {}
        }

        // Simpan file baru
        const fileName = `avatar_${id}_${Date.now()}.${fileExt}`;
        const filePath = path.join(UPLOAD_DIR, fileName);

        const arrayBuffer = await file.arrayBuffer();
        await fs.writeFile(filePath, Buffer.from(arrayBuffer));

        // Update database
        const avatarUrl = `/avatars/${fileName}`;
        const updated = await prisma.phonebook.update({
            where: { id },
            data: { avatar: avatarUrl },
        });

        return NextResponse.json({
            success: true,
            message: 'Avatar berhasil diupload',
            data: { avatar: updated.avatar },
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        return NextResponse.json({ success: false, message: 'Gagal upload avatar' }, { status: 500 });
    }
}

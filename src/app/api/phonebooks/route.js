import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Fungsi untuk validasi input
function validateContactData(data) {
    const errors = [];
    const trimmedData = {
        name: data.name ? data.name.trim() : '',
        phone: data.phone ? data.phone.trim() : '',
        avatar: data.avatar || null
    };

    // Validasi nama
    if (!trimmedData.name) {
        errors.push('Nama tidak boleh kosong');
    } else if (trimmedData.name.length < 2) {
        errors.push('Nama terlalu pendek');
    }

    // Validasi nomor telepon
    if (!trimmedData.phone) {
        errors.push('Nomor telepon tidak boleh kosong');
    } else if (!/^[0-9+\-\s()]*$/.test(trimmedData.phone)) {
        errors.push('Format nomor telepon tidak valid. Hanya angka, +, -, dan spasi yang diperbolehkan');
    } else if (trimmedData.phone.replace(/[^0-9]/g, '').length < 8) {
        errors.push('Nomor telepon terlalu pendek');
    }

    // Validasi avatar (opsional)
    if (trimmedData.avatar && typeof trimmedData.avatar !== 'string') {
        errors.push('Format avatar tidak valid');
    }

    return errors;
}
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '30', 10);
        const keyword = searchParams.get('keyword') || '';
        const sortBy = searchParams.get('sortBy') || 'name';
        const sortMode = searchParams.get('sortMode') === 'asc' ? 'asc' : 'desc';

        // Validasi parameter
        if (isNaN(page) || page < 1) {
            return NextResponse.json(
                { success: false, message: 'Parameter halaman tidak valid' },
                { status: 400 }
            );
        }

        if (isNaN(limit) || limit < 1 || limit > 100) {
            return NextResponse.json(
                { success: false, message: 'Parameter limit tidak valid (1-100)' },
                { status: 400 }
            );
        }

        // Buat filter pencarian
        const filters = {};
        if (keyword) {
            filters.OR = [
                { name: { contains: keyword, mode: 'insensitive' } },
                { phone: { contains: keyword, mode: 'insensitive' } },
                { email: { contains: keyword, mode: 'insensitive' } }
            ];
        }

        // Hitung total data
        const total = await prisma.phonebook.count({ where: filters });
        const pages = Math.ceil(total / limit);

        // Dapatkan data kontak
        const contacts = await prisma.phonebook.findMany({
            where: filters,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { [sortBy]: sortMode },
        });

        return NextResponse.json({
            success: true,
            data: contacts,
            pagination: {
                page,
                limit,
                total,
                pages,
                hasNextPage: page < pages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Terjadi kesalahan saat mengambil data kontak',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}

// POST /api/phonebooks - Buat kontak baru
export async function POST(request) {
    try {
        const data = await request.json();
        console.log('Data yang diterima:', JSON.stringify(data, null, 2));

        // Validasi input
        const validationErrors = validateContactData(data);
        if (validationErrors.length > 0) {
            console.log('Error validasi:', validationErrors);
            return NextResponse.json(
                {
                    success: false,
                    message: 'Validasi gagal',
                    errors: validationErrors
                },
                { status: 400 }
            );
        }

        // Cek apakah nomor telepon sudah ada (format nomor telepon untuk pencarian)
        const phoneNumber = data.phone.trim().replace(/[^0-9]/g, '');
        console.log('Mencari nomor telepon:', phoneNumber);

        const existingContact = await prisma.phonebook.findFirst({
            where: {
                phone: {
                    contains: phoneNumber
                }
            }
        });

        console.log('Hasil pencarian kontak:', existingContact);

        if (existingContact) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Nomor telepon sudah terdaftar',
                    existingPhone: existingContact.phone
                },
                { status: 400 }
            );
        }

        // Format data sebelum disimpan
        const contactData = {
            name: data.name.trim(),
            phone: data.phone.trim(),
            ...(data.avatar && { avatar: data.avatar })
        };

        // Simpan kontak ke database
        const contact = await prisma.phonebook.create({
            data: contactData
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Kontak berhasil ditambahkan',
                data: contact
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Terjadi kesalahan saat menambahkan kontak',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            },
            { status: 500 }
        );
    }
}
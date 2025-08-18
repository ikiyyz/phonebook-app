import { prisma } from '@/lib/prisma';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '10', 10);
        const keyword = searchParams.get('keyword')?.trim() || '';
        const sortBy = searchParams.get('sortBy') || 'name';
        const sortMode = searchParams.get('sortMode') === 'desc' ? 'desc' : 'asc';
        
        const where = keyword
            ? {
                  OR: [
                      { name: { contains: keyword, mode: 'insensitive' } },
                      { phone: { contains: keyword, mode: 'insensitive' } },
                  ],
              }
            : {};

        const total = await prisma.phonebook.count({ where });

        const phonebooks = await prisma.phonebook.findMany({
            where,
            orderBy: { [sortBy]: sortMode },
            skip: (page - 1) * limit,
            take: limit,
        });

        const totalPages = Math.ceil(total / limit);
        
        return Response.json({
            success: true,
            data: phonebooks,
            pagination: {
                page,
                limit,
                pages: totalPages,
                total,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching phonebooks:', error);
        return Response.json(
            { success: false, message: 'Gagal mengambil data kontak' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        const contact = await prisma.phonebook.create({
            data: {
                name: data.name || '',
                phone: data.phone || '',
                avatar: data.avatar || null,
            },
        });

        return Response.json({
            success: true,
            message: 'Kontak berhasil ditambahkan',
            data: contact,
        });
    } catch (error) {
        console.error('Error adding contact:', error);
        return Response.json(
            { success: false, message: 'Terjadi kesalahan saat menambahkan kontak' },
            { status: 500 }
        );
    }
}

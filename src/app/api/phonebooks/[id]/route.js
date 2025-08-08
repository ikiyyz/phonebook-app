import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Fungsi untuk menangani error
function handleError(error) {
  console.error('Error:', error);
  return NextResponse.json(
    { 
      success: false, 
      message: 'Terjadi kesalahan pada server',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    }, 
    { status: 500 }
  );
}

// PUT /api/phonebooks/[id] - Update kontak
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    
    // Validasi ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'ID kontak tidak valid' },
        { status: 400 }
      );
    }

    // Ambil data dari request
    const body = await request.json();
    
    // Validasi data yang dikirim
    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Data tidak boleh kosong' },
        { status: 400 }
      );
    }

    // Cek apakah kontak ada
    const existingContact = await prisma.phonebook.findUnique({
      where: { id: Number(id) }
    });

    if (!existingContact) {
      return NextResponse.json(
        { success: false, message: 'Kontak tidak ditemukan' },
        { status: 404 }
      );
    }

    // Update kontak
    const updatedContact = await prisma.phonebook.update({
      where: { id: Number(id) },
      data: body,
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Kontak berhasil diperbarui',
        data: updatedContact 
      },
      { status: 200 }
    );

  } catch (error) {
    return handleError(error);
  }
}

// DELETE /api/phonebooks/[id] - Hapus kontak
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    // Validasi ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'ID kontak tidak valid' },
        { status: 400 }
      );
    }

    // Cek apakah kontak ada
    const existingContact = await prisma.phonebook.findUnique({
      where: { id: Number(id) }
    });

    if (!existingContact) {
      return NextResponse.json(
        { success: false, message: 'Kontak tidak ditemukan' },
        { status: 404 }
      );
    }

    // Hapus kontak
    await prisma.phonebook.delete({
      where: { id: Number(id) }
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Kontak berhasil dihapus' 
      },
      { status: 200 }
    );

  } catch (error) {
    return handleError(error);
  }
}
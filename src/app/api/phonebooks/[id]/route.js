import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Validasi ID
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'ID kontak tidak valid' },
        { status: 400 }
      );
    }

    const contact = await prisma.phonebook.findUnique({
      where: { id: Number(id) }
    });

    if (!contact) {
      return NextResponse.json(
        { success: false, message: 'Kontak tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: contact }, { status: 200 });
  } catch (error) {
    return handleError(error);
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'ID kontak tidak valid' },
        { status: 400 }
      );
    }

    const body = await request.json();

    if (!body || Object.keys(body).length === 0) {
      return NextResponse.json(
        { success: false, message: 'Data tidak boleh kosong' },
        { status: 400 }
      );
    }

    const existingContact = await prisma.phonebook.findUnique({
      where: { id: Number(id) }
    });

    if (!existingContact) {
      return NextResponse.json(
        { success: false, message: 'Kontak tidak ditemukan' },
        { status: 404 }
      );
    }

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

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!id || isNaN(Number(id))) {
      return NextResponse.json(
        { success: false, message: 'ID kontak tidak valid' },
        { status: 400 }
      );
    }

    const existingContact = await prisma.phonebook.findUnique({
      where: { id: Number(id) }
    });

    if (!existingContact) {
      return NextResponse.json(
        { success: false, message: 'Kontak tidak ditemukan' },
        { status: 404 }
      );
    }
    
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
// src/app/api/notes/[id]/route.ts
/*
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();


export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const noteId = params.id;

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        tenantId: session.user.tenantId, 
      },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found or you do not have permission to view it" },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const noteId = params.id;

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { title, content } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    // Use updateMany to ensure the note belongs to the correct tenant
    const updateResult = await prisma.note.updateMany({
      where: {
        id: noteId,
        tenantId: session.user.tenantId, // CRITICAL: Ensures tenant isolation
      },
      data: {
        title,
        content,
      },
    });
    
    if (updateResult.count === 0) {
        return NextResponse.json(
            { error: "Note not found or you do not have permission to edit it" },
            { status: 404 }
        );
    }

    return NextResponse.json({ message: "Note updated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const noteId = params.id;

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    // Use deleteMany to ensure the note belongs to the correct tenant
    const deleteResult = await prisma.note.deleteMany({
      where: {
        id: noteId,
        tenantId: session.user.tenantId, // CRITICAL: Ensures tenant isolation
      },
    });

    if (deleteResult.count === 0) {
      return NextResponse.json(
        { error: "Note not found or you do not have permission to delete it" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
  */

// src/app/api/notes/[id]/route.ts
import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const noteId = context.params.id;

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const note = await prisma.note.findFirst({
      where: {
        id: noteId,
        tenantId: session.user.tenantId,
      },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const noteId = context.params.id;

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const { title, content } = await request.json();
    if (!title) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }

    await prisma.note.updateMany({
      where: {
        id: noteId,
        tenantId: session.user.tenantId,
      },
      data: {
        title,
        content,
      },
    });

    return NextResponse.json({ message: "Note updated successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}


export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  const noteId = context.params.id;

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    await prisma.note.deleteMany({
      where: {
        id: noteId,
        tenantId: session.user.tenantId,
      },
    });
    return NextResponse.json({ message: "Note deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}
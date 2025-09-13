import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../auth/[...nextauth]/route"; 

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const notes = await prisma.note.findMany({
      where: {
        tenantId: session.user.tenantId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(notes);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.tenantId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    include: { _count: { select: { notes: true } } },
  });

  if (tenant?.subscription === "FREE" && tenant._count.notes >= 3) {
    return NextResponse.json(
      { error: "Note limit reached. Please upgrade to Pro." },
      { status: 403 } 
    );
  }


  try {
    const { title, content } = await request.json();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }

    const newNote = await prisma.note.create({
      data: {
        title,
        content,
        tenantId: session.user.tenantId,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}

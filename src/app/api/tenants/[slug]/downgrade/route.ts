import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: NextRequest, { params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const tenantSlug = params.slug;
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (session.user.tenantSlug !== tenantSlug) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.tenant.update({ where: { id: session.user.tenantId }, data: { subscription: "FREE" } });
    return NextResponse.json({ message: "Subscription downgraded to FREE" });
  } catch { return NextResponse.json({ error: "Failed to downgrade subscription" }, { status: 500 }); }
}
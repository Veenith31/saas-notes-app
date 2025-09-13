// Replace ENTIRE file content with this
import { getServerSession } from "next-auth/next";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(request: NextRequest, context: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);
  const tenantSlug = context.params.slug;
  if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (session.user.tenantSlug !== tenantSlug) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    await prisma.tenant.update({ where: { id: session.user.tenantId }, data: { subscription: "PRO" } });
    return NextResponse.json({ message: "Subscription upgraded to PRO" });
  } catch { return NextResponse.json({ error: "Failed to upgrade subscription" }, { status: 500 }); }
}
<<<<<<< HEAD
// src/app/api/tenants/[slug]/upgrade/route.ts
/*
=======
>>>>>>> c5a654b9740ecef64faad08855a99b3c5bc1a458
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  const tenantSlug = context.params.slug;

  // 1. Check for authentication and admin role
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Security check: Ensure the admin is upgrading their own tenant
  if (session.user.tenantSlug !== tenantSlug) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 3. Update the tenant's plan to PRO
    await prisma.tenant.update({
      where: {
        id: session.user.tenantId,
      },
      data: {
        subscription: "PRO",
      },
    });

    return NextResponse.json({ message: "Subscription upgraded to PRO" });
  } catch {
    return NextResponse.json(
      { error: "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}
<<<<<<< HEAD
  */

import { getServerSession } from "next-auth/next";
import { NextResponse,NextRequest} from "next/server";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "../../../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
context :{ params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  const tenantSlug =context.params.slug;

  // 1. Check for authentication and admin role
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // 2. Security check: Ensure the admin is upgrading their own tenant
  if (session.user.tenantSlug !== tenantSlug) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 3. Update the tenant's plan to PRO
    await prisma.tenant.update({
      where: {
        id: session.user.tenantId,
      },
      data: {
        subscription: "PRO",
      },
    });

    return NextResponse.json({ message: "Subscription upgraded to PRO" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upgrade subscription" },
      { status: 500 }
    );
  }
}
=======
>>>>>>> c5a654b9740ecef64faad08855a99b3c5bc1a458

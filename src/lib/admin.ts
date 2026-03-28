import { UserRole } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function requireAdminApi() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) {
    return { ok: false as const, response: NextResponse.json({ error: "Нет доступа" }, { status: 403 }) };
  }
  return { ok: true as const, session };
}

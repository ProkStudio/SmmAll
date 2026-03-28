import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  return NextResponse.json(await prisma.category.findMany({ orderBy: { createdAt: "desc" } }));
}

export async function POST(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const body = (await req.json()) as { name: string; slug: string; description?: string };
  const row = await prisma.category.create({ data: body });
  return NextResponse.json(row);
}

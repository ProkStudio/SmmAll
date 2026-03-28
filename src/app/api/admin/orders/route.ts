import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const status = searchParams.get("status") ?? undefined;
  const rows = await prisma.order.findMany({
    where: {
      OR: [{ email: { contains: q, mode: "insensitive" } }, { link: { contains: q, mode: "insensitive" } }],
      orderStatus: status as never,
    },
    include: { service: true, user: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(rows);
}

export async function PATCH(req: Request) {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;
  const body = (await req.json()) as { id: string; orderStatus?: string; paymentStatus?: string };
  const row = await prisma.order.update({
    where: { id: body.id },
    data: {
      orderStatus: body.orderStatus as never,
      paymentStatus: body.paymentStatus as never,
    },
  });
  return NextResponse.json(row);
}

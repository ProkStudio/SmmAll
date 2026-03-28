import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { code } = (await req.json()) as { code?: string };
  if (!code) return NextResponse.json({ valid: false, message: "Введите промокод" }, { status: 400 });
  const promo = await prisma.promoCode.findUnique({ where: { code } });
  if (!promo || !promo.isActive || (promo.expiresAt && promo.expiresAt < new Date())) {
    return NextResponse.json({ valid: false, message: "Промокод недействителен" }, { status: 404 });
  }
  return NextResponse.json({
    valid: true,
    discountPct: promo.discountPct,
    discountFixed: promo.discountFixed,
  });
}

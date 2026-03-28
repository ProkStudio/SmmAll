import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { buildRobokassaUrl } from "@/lib/payment";
import { prismaDecimalToNumber } from "@/lib/prisma-decimal";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  serviceId: z.string(),
  link: z.string().url(),
  quantity: z.number().int().positive(),
  promoCode: z.string().optional(),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const payload = schema.parse(await req.json());
  const service = await prisma.service.findUnique({ where: { id: payload.serviceId } });
  if (!service) return NextResponse.json({ error: "Услуга не найдена" }, { status: 404 });

  let amount = (prismaDecimalToNumber(service.pricePer1000) / 1000) * payload.quantity;
  let promoCodeId: string | null = null;
  if (payload.promoCode) {
    const promo = await prisma.promoCode.findUnique({ where: { code: payload.promoCode } });
    if (promo?.isActive && (!promo.expiresAt || promo.expiresAt > new Date())) {
      promoCodeId = promo.id;
      if (promo.discountPct) amount = amount * (1 - promo.discountPct / 100);
      if (promo.discountFixed) amount = Math.max(0, amount - prismaDecimalToNumber(promo.discountFixed));
    }
  }

  const order = await prisma.order.create({
    data: {
      userId: session?.user?.id ?? null,
      email: session?.user?.email ?? payload.email,
      serviceId: payload.serviceId,
      link: payload.link,
      quantity: payload.quantity,
      promoCodeId,
      amount,
    },
  });

  await prisma.payment.create({
    data: { orderId: order.id, amount, invoiceId: order.id },
  });

  return NextResponse.json({
    orderId: order.id,
    paymentUrl: buildRobokassaUrl({
      amount: amount.toFixed(2),
      invoiceId: order.id,
      description: `Оплата заказа ${order.id}`,
    }),
  });
}

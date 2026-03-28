import { NextResponse } from "next/server";
import { OrderStatus, PaymentStatus, Prisma, ProviderType } from "@prisma/client";
import { verifyRobokassaResultSignature } from "@/lib/payment";
import { createMoreThanPanelOrder } from "@/lib/providers";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const form = await req.formData();
  const invoiceId = String(form.get("InvId") ?? "");
  const outSum = String(form.get("OutSum") ?? "");
  const signature = String(form.get("SignatureValue") ?? "");
  if (!invoiceId) return new NextResponse("bad request", { status: 400 });
  if (!verifyRobokassaResultSignature(outSum, invoiceId, signature)) {
    return new NextResponse("invalid signature", { status: 403 });
  }

  const order = await prisma.order.findUnique({ where: { id: invoiceId }, include: { service: true } });
  if (!order) return new NextResponse("not found", { status: 404 });

  await prisma.payment.update({
    where: { orderId: order.id },
    data: {
      status: PaymentStatus.PAID,
      robokassaRaw: Object.fromEntries(form.entries()) as Prisma.InputJsonValue,
    },
  });

  const updatePayload: Record<string, unknown> = {
    paymentStatus: PaymentStatus.PAID,
    orderStatus: OrderStatus.IN_PROGRESS,
  };

  if (order.service.provider === ProviderType.MORETHANPANEL) {
    const cfg = order.service.providerConfig as { serviceId?: number };
    const response = await createMoreThanPanelOrder(cfg.serviceId ?? 0, order.link, order.quantity);
    updatePayload.externalOrderId = String(response.order ?? "");
    updatePayload.providerRawResponse = response;
  }

  await prisma.order.update({ where: { id: order.id }, data: updatePayload });
  return new NextResponse(`OK${order.id}`);
}

import { NextResponse } from "next/server";
import { OrderStatus } from "@prisma/client";
import { getMoreThanPanelOrderStatus } from "@/lib/providers";
import { prisma } from "@/lib/prisma";

function mapStatus(status?: string): OrderStatus {
  const s = (status ?? "").toLowerCase();
  if (s.includes("complete")) return OrderStatus.COMPLETED;
  if (s.includes("partial")) return OrderStatus.PARTIAL;
  if (s.includes("cancel")) return OrderStatus.CANCELED;
  return OrderStatus.IN_PROGRESS;
}

export async function POST(req: Request) {
  const token = req.headers.get("x-cron-token");
  if (!token || token !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 403 });
  }

  const orders = await prisma.order.findMany({
    where: { externalOrderId: { not: null } },
    take: 200,
  });

  for (const order of orders) {
    if (!order.externalOrderId) continue;
    try {
      const res = await getMoreThanPanelOrderStatus(order.externalOrderId);
      await prisma.order.update({
        where: { id: order.id },
        data: {
          orderStatus: mapStatus(res.status),
          remains: typeof res.remains === "number" ? res.remains : order.remains,
          charge: res.charge ? Number(res.charge) : order.charge,
          providerRawResponse: res,
        },
      });
    } catch {
      continue;
    }
  }

  return NextResponse.json({ ok: true });
}

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function CabinetPage() {
  const session = await getServerSession(authOptions);
  const orders = await prisma.order.findMany({
    where: { userId: session?.user.id },
    include: { service: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Личный кабинет</h1>
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border bg-white p-4">
            <p className="font-semibold">{order.service.name}</p>
            <p className="text-sm text-slate-500">
              Статус: {order.orderStatus} | Оплата: {order.paymentStatus}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

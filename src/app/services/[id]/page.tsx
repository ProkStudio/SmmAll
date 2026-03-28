import { notFound } from "next/navigation";
import { demoServices } from "@/lib/demo";
import { prismaDecimalToNumber } from "@/lib/prisma-decimal";
import { prisma } from "@/lib/prisma";
import { CheckoutForm } from "@/components/checkout-form";

export const dynamic = "force-dynamic";

export default async function ServicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const demoModeForced = process.env.DEMO_MODE === "1";
  let dbReady = Boolean(process.env.DATABASE_URL) && !demoModeForced;
  type ServiceView = { id: string; name: string; description: string; pricePer1000: number };
  let service: ServiceView | undefined = demoServices.find((s) => s.id === id);

  if (dbReady) {
    try {
      const row = await prisma.service.findUnique({
        where: { id },
        select: { id: true, name: true, description: true, pricePer1000: true },
      });
      if (row) {
        service = {
          ...row,
          pricePer1000: prismaDecimalToNumber(row.pricePer1000),
        };
      }
    } catch {
      dbReady = false;
    }
  }
  if (!service) return notFound();

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold">{service.name}</h1>
        <p className="mt-4 text-slate-600">{service.description}</p>
        <p className="mt-4 text-blue-600">{service.pricePer1000} ₽ / 1000</p>
        {!dbReady ? <p className="mt-3 text-sm text-slate-500">Демо-режим: оформление заказа отключено.</p> : null}
      </div>
      {dbReady ? <CheckoutForm serviceId={service.id} /> : <div className="rounded-xl bg-white p-6 shadow-sm">Недоступно в демо-режиме</div>}
    </div>
  );
}

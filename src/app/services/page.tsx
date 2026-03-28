import { Metadata } from "next";
import Link from "next/link";
import { demoCategories, demoServices } from "@/lib/demo";
import { prismaDecimalToNumber } from "@/lib/prisma-decimal";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Услуги — SmmAll",
  description: "Каталог SMM услуг с поиском и фильтрами.",
};

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const params = await searchParams;
  const demoModeForced = process.env.DEMO_MODE === "1";
  let dbReady = Boolean(process.env.DATABASE_URL) && !demoModeForced;
  type ServiceRow = {
    id: string;
    name: string;
    description: string;
    pricePer1000: number;
    minQuantity: number;
    maxQuantity: number;
  };
  let services: ServiceRow[] = demoServices
    .filter((s) => (!params.category ? true : s.categorySlug === params.category))
    .filter((s) => (!params.q ? true : s.name.toLowerCase().includes(params.q.toLowerCase())));

  if (dbReady) {
    try {
      const rows = await prisma.service.findMany({
        where: {
          name: { contains: params.q, mode: "insensitive" },
          category: { slug: params.category },
        },
        select: {
          id: true,
          name: true,
          description: true,
          pricePer1000: true,
          minQuantity: true,
          maxQuantity: true,
        },
      });
      services = rows.map((s) => ({
        ...s,
        pricePer1000: prismaDecimalToNumber(s.pricePer1000),
      }));
    } catch {
      dbReady = false;
    }
  }

  return (
    <div>
      <h1 className="mb-4 text-3xl font-bold">Услуги</h1>
      {!dbReady ? (
        <div className="mb-4 rounded-xl border bg-white p-4 text-sm text-slate-600">
          Демо-режим: база данных недоступна. Показаны тестовые услуги и категории.
          <div className="mt-2 flex flex-wrap gap-2">
            {demoCategories.map((c) => (
              <Link key={c.id} href={`/services?category=${c.slug}`} className="rounded-full border px-3 py-1 text-xs">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      <div className="grid gap-4 md:grid-cols-3">
        {services.map((service) => (
          <Link key={service.id} href={`/services/${service.id}`} className="rounded-xl border bg-white p-4">
            <h3 className="font-semibold">{service.name}</h3>
            <p className="text-sm text-slate-500">{service.description}</p>
            <p className="mt-2 text-blue-600">{service.pricePer1000} ₽ / 1000</p>
            <p className="text-xs text-slate-500">
              Мин: {service.minQuantity} / Макс: {service.maxQuantity}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}

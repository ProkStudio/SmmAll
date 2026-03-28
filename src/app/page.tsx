import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { demoCategories, demoServices } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function Home() {
  const demoModeForced = process.env.DEMO_MODE === "1";
  let dbReady = Boolean(process.env.DATABASE_URL) && !demoModeForced;

  let categories: Array<{ id: string; name: string; slug: string }> = demoCategories.slice(0, 8);
  let popular: Array<{ id: string; name: string; description: string; pricePer1000: number | string; popularity?: number }> =
    demoServices.slice().sort((a, b) => b.popularity - a.popularity).slice(0, 6);

  if (dbReady) {
    try {
      categories = await prisma.category.findMany({ take: 8, select: { id: true, name: true, slug: true } });
      popular = await prisma.service.findMany({
        take: 6,
        orderBy: { popularity: "desc" },
        select: { id: true, name: true, description: true, pricePer1000: true, popularity: true },
      });
    } catch {
      dbReady = false;
    }
  }
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold">Купить SMM услуги</h1>
        <p className="mt-3 text-slate-600">Быстрый запуск заказов с автоматической обработкой.</p>
        <div className="mt-4 flex gap-3">
          <input className="w-full rounded-lg border px-4 py-2" placeholder="Поиск услуги" />
          <Link href="/services" className="rounded-lg bg-blue-600 px-4 py-2 text-white">
            Найти
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((item) => (
            <Link key={item.id} href={`/services?category=${item.slug}`} className="rounded-full border px-3 py-1 text-sm">
              {item.name}
            </Link>
          ))}
        </div>
        {!dbReady ? (
          <p className="mt-4 text-sm text-slate-500">
            Демо-режим: база данных недоступна, показаны тестовые услуги.
          </p>
        ) : null}
      </section>

      <section>
        <h2 className="mb-4 text-2xl font-semibold">Популярные услуги</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {popular.map((item) => (
            <Link key={item.id} href={`/services/${item.id}`} className="rounded-xl border bg-white p-4 shadow-sm">
              <h3 className="font-semibold">{item.name}</h3>
              <p className="mt-2 text-sm text-slate-500">{item.description.slice(0, 90)}</p>
              <p className="mt-3 text-blue-600">{Number((item as { pricePer1000: unknown }).pricePer1000)} ₽ / 1000</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl bg-white p-8">
        <h2 className="text-2xl font-semibold">Как это работает</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border p-4">1. Выберите услугу и введите ссылку.</div>
          <div className="rounded-xl border p-4">2. Оплатите заказ через Robokassa.</div>
          <div className="rounded-xl border p-4">3. Отслеживайте статус в кабинете.</div>
        </div>
      </section>
    </div>
  );
}

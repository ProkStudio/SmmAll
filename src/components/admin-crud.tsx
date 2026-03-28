"use client";

import { useState } from "react";

type Row = Record<string, unknown>;

async function api(url: string, method = "GET", body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error("Ошибка запроса");
  return res.json();
}

export function AdminCrud({
  initialCategories,
  initialPromos,
  initialOrders,
}: {
  initialCategories: Row[];
  initialPromos: Row[];
  initialOrders: Row[];
}) {
  const [categories, setCategories] = useState<Row[]>(initialCategories);
  const [promos, setPromos] = useState<Row[]>(initialPromos);
  const [orders, setOrders] = useState<Row[]>(initialOrders);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoPct, setPromoPct] = useState(10);

  return (
    <div className="space-y-6">
      <section className="rounded-xl bg-white p-4">
        <h2 className="text-xl font-semibold">Категории</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input className="rounded border px-3 py-2" placeholder="Название" value={catName} onChange={(e) => setCatName(e.target.value)} />
          <input className="rounded border px-3 py-2" placeholder="Slug" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} />
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={async () => {
              const row = await api("/api/admin/categories", "POST", { name: catName, slug: catSlug });
              setCategories([row, ...categories]);
              setCatName("");
              setCatSlug("");
            }}
          >
            Добавить
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {categories.map((row) => (
            <div key={String(row.id)} className="flex items-center justify-between rounded border p-2">
              <span>
                {String(row.name)} ({String(row.slug)})
              </span>
              <button
                className="rounded bg-red-50 px-2 py-1 text-red-600"
                onClick={async () => {
                  await api(`/api/admin/categories/${String(row.id)}`, "DELETE");
                  setCategories(categories.filter((x) => String(x.id) !== String(row.id)));
                }}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-white p-4">
        <h2 className="text-xl font-semibold">Промокоды</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <input className="rounded border px-3 py-2" placeholder="Код" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
          <input
            className="rounded border px-3 py-2"
            type="number"
            placeholder="%"
            value={promoPct}
            onChange={(e) => setPromoPct(Number(e.target.value))}
          />
          <button
            className="rounded bg-blue-600 px-4 py-2 text-white"
            onClick={async () => {
              const row = await api("/api/admin/promocodes", "POST", { code: promoCode, discountPct: promoPct, isActive: true });
              setPromos([row, ...promos]);
              setPromoCode("");
            }}
          >
            Добавить
          </button>
        </div>
        <div className="mt-3 space-y-2">
          {promos.map((row) => (
            <div key={String(row.id)} className="flex items-center justify-between rounded border p-2">
              <span>
                {String(row.code)} ({String(row.discountPct ?? 0)}%)
              </span>
              <button
                className="rounded bg-red-50 px-2 py-1 text-red-600"
                onClick={async () => {
                  await api(`/api/admin/promocodes/${String(row.id)}`, "DELETE");
                  setPromos(promos.filter((x) => String(x.id) !== String(row.id)));
                }}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Заказы</h2>
          <button
            className="rounded bg-blue-600 px-3 py-2 text-white"
            onClick={async () => {
              await api("/api/admin/orders/sync", "POST");
              const rows = await api("/api/admin/orders");
              setOrders(rows);
            }}
          >
            Синхронизировать статусы
          </button>
        </div>
        <div className="space-y-2">
          {orders.slice(0, 20).map((row) => (
            <div key={String(row.id)} className="rounded border p-2 text-sm">
              <div>ID: {String(row.id)}</div>
              <div>Email: {String(row.email)}</div>
              <div>Статус: {String(row.orderStatus)}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";

export function CheckoutForm({ serviceId }: { serviceId: string }) {
  const [email, setEmail] = useState("");
  const [link, setLink] = useState("");
  const [quantity, setQuantity] = useState(1000);
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit() {
    setLoading(true);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, link, quantity, promoCode, serviceId }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.paymentUrl) window.location.href = data.paymentUrl;
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Купить</h2>
      <div className="mt-4 space-y-3">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-lg border px-3 py-2" />
        <input value={link} onChange={(e) => setLink(e.target.value)} placeholder="Ссылка" className="w-full rounded-lg border px-3 py-2" />
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="Количество"
          className="w-full rounded-lg border px-3 py-2"
        />
        <input value={promoCode} onChange={(e) => setPromoCode(e.target.value)} placeholder="Промокод" className="w-full rounded-lg border px-3 py-2" />
        <button onClick={onSubmit} disabled={loading} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white">
          {loading ? "Обработка..." : "Купить"}
        </button>
      </div>
    </div>
  );
}

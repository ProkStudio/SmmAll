"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [done, setDone] = useState(false);

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Регистрация</h1>
      <div className="mt-4 space-y-3">
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={async () => {
            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password }),
            });
            setDone(res.ok);
          }}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Создать аккаунт
        </button>
        {done ? <p className="text-sm text-green-600">Аккаунт создан</p> : null}
      </div>
    </div>
  );
}

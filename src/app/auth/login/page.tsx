"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold">Вход</h1>
      <div className="mt-4 space-y-3">
        <input className="w-full rounded-lg border px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          type="password"
          className="w-full rounded-lg border px-3 py-2"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <button
          onClick={async () => {
            const res = await signIn("credentials", { email, password, redirect: true, callbackUrl: "/cabinet" });
            if (res?.error) setError("Неверный email или пароль");
          }}
          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Войти
        </button>
      </div>
    </div>
  );
}

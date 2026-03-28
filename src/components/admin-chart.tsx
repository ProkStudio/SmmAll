"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

export function AdminChart({ data }: { data: Array<{ name: string; value: number }> }) {
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" fill="#2563eb" radius={6} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

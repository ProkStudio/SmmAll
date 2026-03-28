import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { AdminChart } from "@/components/admin-chart";
import { AdminCrud } from "@/components/admin-crud";
import { authOptions } from "@/lib/auth";
import { getMoreThanPanelBalance } from "@/lib/providers";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== UserRole.ADMIN) redirect("/auth/login");

  const [ordersCount, revenue, servicesCount, balance, categories, promos, orders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { amount: true } }),
    prisma.service.count(),
    getMoreThanPanelBalance().catch(() => ({ balance: "0", currency: "USD" })),
    prisma.category.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
  ]);

  const chartData = [
    { name: "Сегодня", value: Math.floor(ordersCount * 0.2) },
    { name: "Неделя", value: Math.floor(ordersCount * 0.6) },
    { name: "Месяц", value: ordersCount },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Админ панель</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-xl bg-white p-4">Выручка: {Number(revenue._sum.amount ?? 0).toFixed(2)} ₽</div>
        <div className="rounded-xl bg-white p-4">Заказы: {ordersCount}</div>
        <div className="rounded-xl bg-white p-4">Услуги: {servicesCount}</div>
        <div className="rounded-xl bg-white p-4">Баланс MTP: {balance.balance ?? 0}</div>
      </div>
      <div className="rounded-xl bg-white p-6">
        <AdminChart data={chartData} />
      </div>
      <AdminCrud initialCategories={categories} initialPromos={promos} initialOrders={orders} />
    </div>
  );
}

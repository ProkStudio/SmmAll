import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-blue-600">
          SmmAll
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-700">
          <Link href="/services">Услуги</Link>
          <Link href="/cabinet">Кабинет</Link>
          <Link href="/admin">Админ</Link>
          <Link href="/auth/login">Вход</Link>
        </nav>
      </div>
    </header>
  );
}

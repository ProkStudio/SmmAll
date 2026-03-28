/** Prisma возвращает Decimal для полей @db.Decimal — приводим к number для UI/типов. */
export function prismaDecimalToNumber(v: unknown): number {
  if (v == null) return 0;
  if (typeof v === "number") return v;
  if (typeof v === "string") return Number(v);
  if (
    typeof v === "object" &&
    v !== null &&
    "toNumber" in v &&
    typeof (v as { toNumber: () => number }).toNumber === "function"
  ) {
    return (v as { toNumber: () => number }).toNumber();
  }
  return Number(v);
}

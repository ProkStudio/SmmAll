import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ email: z.string().email(), password: z.string().min(6) });

export async function POST(req: Request) {
  const payload = schema.parse(await req.json());
  const exists = await prisma.user.findUnique({ where: { email: payload.email } });
  if (exists) return NextResponse.json({ error: "Email уже занят" }, { status: 409 });
  const hash = await bcrypt.hash(payload.password, 10);
  await prisma.user.create({ data: { email: payload.email, passwordHash: hash } });
  return NextResponse.json({ ok: true });
}

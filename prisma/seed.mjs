import bcrypt from "bcryptjs";
import { PrismaClient, ProviderType, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@smmall.local";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123456";
  const adminHash = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash: adminHash, role: UserRole.ADMIN },
    create: { email: adminEmail, passwordHash: adminHash, role: UserRole.ADMIN, name: "Администратор" },
  });

  const instagram = await prisma.category.upsert({
    where: { slug: "instagram" },
    update: {},
    create: { name: "Instagram", slug: "instagram", description: "Услуги Instagram" },
  });

  await prisma.service.upsert({
    where: { slug: "instagram-followers-fast" },
    update: {},
    create: {
      name: "Instagram подписчики (быстрый старт)",
      slug: "instagram-followers-fast",
      description: "Качественные подписчики с быстрым запуском.",
      pricePer1000: "120",
      minQuantity: 100,
      maxQuantity: 100000,
      categoryId: instagram.id,
      provider: ProviderType.MORETHANPANEL,
      providerConfig: { serviceId: 1001 },
      popularity: 100,
    },
  });
}

main().finally(async () => prisma.$disconnect());

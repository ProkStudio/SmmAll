export type DemoCategory = { id: string; name: string; slug: string };
export type DemoService = {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricePer1000: number;
  minQuantity: number;
  maxQuantity: number;
  popularity: number;
  categorySlug: string;
};

export const demoCategories: DemoCategory[] = [
  { id: "c1", name: "Instagram", slug: "instagram" },
  { id: "c2", name: "TikTok", slug: "tiktok" },
  { id: "c3", name: "YouTube", slug: "youtube" },
  { id: "c4", name: "Telegram", slug: "telegram" },
  { id: "c5", name: "ВКонтакте", slug: "vk" },
];

export const demoServices: DemoService[] = [
  {
    id: "s1",
    name: "Instagram подписчики (старт)",
    slug: "ig-followers-start",
    description: "Подписчики с быстрым стартом. Подходит для прогрева аккаунта.",
    pricePer1000: 120,
    minQuantity: 100,
    maxQuantity: 100000,
    popularity: 95,
    categorySlug: "instagram",
  },
  {
    id: "s2",
    name: "Instagram лайки (реальные)",
    slug: "ig-likes-real",
    description: "Лайки для постов. Отлично для повышения социального доказательства.",
    pricePer1000: 90,
    minQuantity: 50,
    maxQuantity: 50000,
    popularity: 80,
    categorySlug: "instagram",
  },
  {
    id: "s3",
    name: "TikTok просмотры",
    slug: "tt-views",
    description: "Просмотры на видео TikTok. Быстро и стабильно.",
    pricePer1000: 25,
    minQuantity: 1000,
    maxQuantity: 1000000,
    popularity: 88,
    categorySlug: "tiktok",
  },
  {
    id: "s4",
    name: "YouTube подписчики",
    slug: "yt-subs",
    description: "Подписчики на канал YouTube. Для роста и доверия аудитории.",
    pricePer1000: 350,
    minQuantity: 50,
    maxQuantity: 50000,
    popularity: 70,
    categorySlug: "youtube",
  },
  {
    id: "s5",
    name: "Telegram реакции",
    slug: "tg-reactions",
    description: "Реакции на посты в Telegram. Усиливают вовлеченность.",
    pricePer1000: 140,
    minQuantity: 100,
    maxQuantity: 200000,
    popularity: 65,
    categorySlug: "telegram",
  },
  {
    id: "s6",
    name: "ВК лайки",
    slug: "vk-likes",
    description: "Лайки для записей ВКонтакте. Быстрый запуск.",
    pricePer1000: 75,
    minQuantity: 50,
    maxQuantity: 100000,
    popularity: 60,
    categorySlug: "vk",
  },
];

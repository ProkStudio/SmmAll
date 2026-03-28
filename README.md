# SmmAll

Продакшен-каркас SMM-панели на Next.js 15 (App Router), TypeScript, Tailwind, Prisma + PostgreSQL, NextAuth, Zustand, TanStack Query.

## Что реализовано

- Публичные страницы: главная, каталог услуг, страница услуги.
- Оформление заказа (гость и авторизованный пользователь).
- Промокоды.
- Интеграции Robokassa и MoreThanPanel.
- Кабинет пользователя (история заказов).
- Админ-панель: метрики, график, CRUD категорий/промокодов, просмотр заказов, синхронизация статусов.
- API для cron-синхронизации внешних статусов заказов.

## Стек

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM + PostgreSQL
- NextAuth.js (Credentials)
- Zustand
- TanStack Query
- Recharts

## Переменные окружения

Создайте `.env` по образцу `.env.example`:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `ROBOKASSA_LOGIN`
- `ROBOKASSA_PASSWORD_1`
- `ROBOKASSA_PASSWORD_2`
- `MORETHANPANEL_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CRON_SECRET`

## Локальный запуск

1. Установите Node.js 22+ и PostgreSQL.
2. Установите зависимости:
   - `npm install`
3. Скопируйте `.env.example` в `.env` и заполните значения.
4. Примените миграции:
   - `npx prisma migrate dev`
5. Заполните базу начальными данными и админом:
   - `npm run db:seed`
6. Запустите проект:
   - `npm run dev`

## Админ-доступ

После `npm run db:seed` создается админ:

- Email: значение `ADMIN_EMAIL`
- Пароль: значение `ADMIN_PASSWORD`

## Robokassa

- Success URL: `/api/payments/robokassa/success`
- Fail URL: `/api/payments/robokassa/fail`
- Result URL: `/api/payments/robokassa/result`
- В `result` используется проверка подписи с `ROBOKASSA_PASSWORD_2`.

## MoreThanPanel

- Создание заказа: `action=add`
- Синхронизация статуса: `action=status`
- Баланс: `action=balance`

## Cron синхронизации заказов

Эндпоинт:

- `POST /api/cron/sync-orders`
- Заголовок: `x-cron-token: <CRON_SECRET>`

Рекомендуемая периодичность: раз в 5-10 минут.

## Деплой на TimeWeb Cloud (пошагово)

### Шаг 1. Подготовить репозиторий

1. Загрузите проект в GitHub/GitLab.
2. Убедитесь, что в репозитории есть:
   - `Dockerfile`
   - `next.config.mjs`
   - `prisma/schema.prisma`

### Шаг 2. Поднять PostgreSQL в TimeWeb

1. В панели TimeWeb Cloud создайте сервис PostgreSQL.
2. Скопируйте строку подключения.
3. Вставьте ее в `DATABASE_URL`.

### Шаг 3. Создать приложение в TimeWeb App Platform

1. Создайте новое приложение из репозитория.
2. Выберите Node.js или Docker (оба варианта подходят).
3. Если Node.js:
   - Build command: `npm run build`
   - Start command: `npm run start`
4. Порт приложения: `3000`.

### Шаг 4. Настроить переменные окружения

Добавьте в настройках приложения все значения из раздела "Переменные окружения".
Особенно важно:

- `NEXTAUTH_URL` = публичный URL приложения
- `NEXTAUTH_SECRET` = длинный случайный секрет
- `CRON_SECRET` = отдельный секрет для cron

### Шаг 5. Выполнить миграции и сиды

После первого деплоя выполните в консоли приложения:

1. `npx prisma migrate deploy`
2. `npm run db:seed`

### Шаг 6. Настроить Robokassa

В кабинете Robokassa укажите:

- Result URL: `https://ВАШ-ДОМЕН/api/payments/robokassa/result`
- Success URL: `https://ВАШ-ДОМЕН/api/payments/robokassa/success`
- Fail URL: `https://ВАШ-ДОМЕН/api/payments/robokassa/fail`

Проверьте, что пароли магазина совпадают с `.env`.

### Шаг 7. Настроить фоновую синхронизацию

Создайте в TimeWeb задачу cron (или внешний cron), которая раз в 5-10 минут делает:

- `POST https://ВАШ-ДОМЕН/api/cron/sync-orders`
- Header: `x-cron-token: <CRON_SECRET>`

### Шаг 8. Проверка после деплоя

1. Откройте главную и каталог услуг.
2. Пройдите тестовый checkout.
3. Войдите в `/admin` и проверьте, что видите статистику.
4. Проверьте, что webhook Robokassa меняет статус оплаты.
5. Проверьте синхронизацию статусов MoreThanPanel.

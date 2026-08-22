# TANEM Analytics MVP

Минимальная собственная аналитика для TANEM.Pro: сайт отправляет просмотры и клики в Cloudflare Worker, данные хранятся в SQLite Durable Object отдельно для каждого мастера, а раз в неделю Worker отправляет простой отчет в Telegram.

## Что уже умеет

- page_view;
- клики «Записаться»;
- WhatsApp / Telegram / телефон / карта;
- UTM и источник перехода;
- число сеансов;
- сравнение просмотров с прошлой неделей;
- одноразовая безопасная ссылка подключения Telegram;
- ручная отправка тестового отчета;
- автоматическая отправка каждый понедельник в 09:00 по Москве (cron 06:00 UTC).

## Секреты

Для Worker нужен только один продуктовый секрет:

```bash
npx wrangler secret put TELEGRAM_BOT_TOKEN
```

Токен выдаёт BotFather. Он же используется как ключ для закрытых admin-endpoint'ов; отдельные `ADMIN_KEY` и webhook-secret не нужны — webhook-secret Worker вычисляет сам.

## Деплой

```bash
npm install
npx wrangler deploy
```

После деплоя сохранить URL Worker, например `https://tanem-analytics.<account>.workers.dev`.

Подключить Telegram webhook:

```bash
curl -X POST \
  -H "Authorization: Bearer $TELEGRAM_BOT_TOKEN" \
  "https://<worker>/admin/setup-telegram"
```

Создать одноразовую ссылку для Нонны:

```bash
curl -X POST \
  -H "Authorization: Bearer $TELEGRAM_BOT_TOKEN" \
  "https://<worker>/admin/connect-link?site=nonna"
```

После того как мастер откроет ссылку и нажмет Start, тестовая отправка:

```bash
curl -X POST \
  -H "Authorization: Bearer $TELEGRAM_BOT_TOKEN" \
  "https://<worker>/admin/send-test?site=nonna"
```

## Подключение сайта

На сайт добавляется `tanem-analytics.js` и конфигурация с URL Worker + `site_id`. Файл-трекер подготовлен отдельно в репозитории сайта. До фактического деплоя Worker его не следует включать в layout.

## Масштабирование

Каждый `site_id` получает свой Durable Object, поэтому данные мастеров не складываются в один глобальный объект. Для нового мастера добавляем ID, имя и допустимый origin в переменные `REPORT_SITES`, `SITE_NAMES`, `SITE_ORIGINS`, а затем подключаем тот же клиентский скрипт.

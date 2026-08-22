const SOURCE_LABELS = {
  direct: "Прямые переходы",
  yandex: "Яндекс",
  google: "Google",
  telegram: "Telegram",
  instagram: "Instagram",
  vk: "VK",
  "2gis": "2GIS",
  profi: "Профи.ру",
  avito: "Avito",
  other: "Другие"
};

const ACTION_LABELS = {
  booking_click: "Запись",
  whatsapp_click: "WhatsApp",
  telegram_click: "Telegram",
  phone_click: "Телефон",
  map_click: "Карта",
  external_click: "Внешние ссылки"
};

export function sourceLabel(source) {
  return SOURCE_LABELS[source] || source || SOURCE_LABELS.other;
}

export function actionLabel(eventType) {
  return ACTION_LABELS[eventType] || eventType;
}

function number(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) ? n : 0;
}

function percent(value) {
  return `${number(value).toFixed(1).replace(".0", "")}%`;
}

function ruDate(ms) {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    timeZone: "Europe/Moscow"
  }).format(new Date(ms));
}

export function formatWeeklyReport(report, siteName = "Мастер") {
  const views = number(report.pageViews);
  const sessions = number(report.sessions);
  const bookings = number(report.actions?.booking_click);
  const conversion = views > 0 ? (bookings / views) * 100 : 0;
  const delta = number(report.viewsDeltaPercent);

  const lines = [
    "TANEM · Итоги недели",
    siteName,
    `${ruDate(report.since)} — ${ruDate(report.until)}`,
    "",
    `👀 Просмотры: ${views}`,
    `🧭 Сеансы: ${sessions}`,
    `✍️ Нажали «Записаться»: ${bookings}`,
    `Конверсия в клик: ${percent(conversion)}`
  ];

  if (report.previousPageViews > 0) {
    const sign = delta > 0 ? "+" : "";
    lines.push(`К прошлой неделе: ${sign}${percent(delta)}`);
  }

  if (Array.isArray(report.sources) && report.sources.length) {
    lines.push("", "Откуда пришли:");
    for (const row of report.sources.slice(0, 6)) {
      lines.push(`${sourceLabel(row.source)} — ${number(row.count)}`);
    }
  }

  const actionRows = Object.entries(report.actions || {})
    .filter(([, count]) => number(count) > 0)
    .sort((a, b) => number(b[1]) - number(a[1]));

  if (actionRows.length) {
    lines.push("", "Действия:");
    for (const [eventType, count] of actionRows) {
      lines.push(`${actionLabel(eventType)} — ${number(count)}`);
    }
  }

  return lines.join("\n");
}

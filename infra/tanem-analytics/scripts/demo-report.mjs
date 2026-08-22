import { formatWeeklyReport } from "../src/report.js";

const now = Date.now();
const report = {
  since: now - 7 * 86400000,
  until: now,
  pageViews: 128,
  sessions: 94,
  previousPageViews: 108,
  viewsDeltaPercent: 18.5185,
  sources: [
    { source: "yandex", count: 46 },
    { source: "instagram", count: 21 },
    { source: "telegram", count: 12 },
    { source: "direct", count: 15 }
  ],
  actions: {
    booking_click: 27,
    whatsapp_click: 12,
    telegram_click: 8,
    phone_click: 7
  }
};

console.log(formatWeeklyReport(report, "Нонна · ClayTone"));

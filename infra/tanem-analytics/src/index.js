import { DurableObject } from "cloudflare:workers";
import { formatWeeklyReport } from "./report.js";

const ALLOWED_EVENTS = new Set([
  "page_view",
  "booking_click",
  "whatsapp_click",
  "telegram_click",
  "phone_click",
  "map_click",
  "external_click"
]);

const MAX_TEXT = 500;

function cleanText(value, max = MAX_TEXT) {
  return String(value || "").slice(0, max);
}

function cleanEvent(payload) {
  const eventType = cleanText(payload.event_type, 64);
  if (!ALLOWED_EVENTS.has(eventType)) throw new Error("unsupported_event");
  return {
    event_type: eventType,
    ts: Date.now(),
    path: cleanText(payload.path, 400),
    referrer: cleanText(payload.referrer, 500),
    source: cleanText(payload.source || "direct", 64),
    medium: cleanText(payload.medium, 64),
    campaign: cleanText(payload.campaign, 120),
    session_id: cleanText(payload.session_id, 100),
    target: cleanText(payload.target, 300)
  };
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers }
  });
}

function siteNames(env) {
  try { return JSON.parse(env.SITE_NAMES || "{}"); } catch { return {}; }
}

function siteOrigins(env) {
  try { return JSON.parse(env.SITE_ORIGINS || "{}"); } catch { return {}; }
}

function reportSites(env) {
  return String(env.REPORT_SITES || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function siteExists(env, siteId) {
  return reportSites(env).includes(siteId);
}

function corsHeaders(request, env, siteId) {
  const origin = request.headers.get("Origin") || "";
  const allowed = siteOrigins(env)[siteId] || [];
  if (!allowed.includes(origin)) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function isAllowedOrigin(request, env, siteId) {
  const origin = request.headers.get("Origin") || "";
  return (siteOrigins(env)[siteId] || []).includes(origin);
}

function adminAuthorized(request, env) {
  if (!env.TELEGRAM_BOT_TOKEN) return false;
  return request.headers.get("Authorization") === `Bearer ${env.TELEGRAM_BOT_TOKEN}`;
}

async function telegramWebhookSecret(env) {
  if (!env.TELEGRAM_BOT_TOKEN) throw new Error("telegram_bot_token_missing");
  const bytes = new TextEncoder().encode(`tanem-webhook:${env.TELEGRAM_BOT_TOKEN}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("").slice(0, 64);
}

function randomToken(bytes = 12) {
  const raw = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(raw, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function telegramApi(env, method, body) {
  if (!env.TELEGRAM_BOT_TOKEN) throw new Error("telegram_bot_token_missing");
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body)
  });
  const data = await response.json();
  if (!response.ok || !data.ok) throw new Error(`telegram_${method}_failed`);
  return data.result;
}

export class SiteAnalytics extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS events (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          event_type TEXT NOT NULL,
          ts INTEGER NOT NULL,
          path TEXT,
          referrer TEXT,
          source TEXT,
          medium TEXT,
          campaign TEXT,
          session_id TEXT,
          target TEXT
        );
        CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts);
        CREATE INDEX IF NOT EXISTS idx_events_type_ts ON events(event_type, ts);
        CREATE TABLE IF NOT EXISTS config (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        );
      `);
    });
  }

  async recordEvent(event) {
    this.ctx.storage.sql.exec(
      `INSERT INTO events (event_type, ts, path, referrer, source, medium, campaign, session_id, target)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      event.event_type,
      event.ts,
      event.path,
      event.referrer,
      event.source,
      event.medium,
      event.campaign,
      event.session_id,
      event.target
    );
    return { ok: true };
  }

  async setConnectCode(code, expiresAt) {
    this.ctx.storage.sql.exec("INSERT OR REPLACE INTO config(key,value) VALUES('connect_code',?)", code);
    this.ctx.storage.sql.exec("INSERT OR REPLACE INTO config(key,value) VALUES('connect_expires_at',?)", String(expiresAt));
    return { ok: true };
  }

  async connectTelegram(code, chatId) {
    const codeRow = this.ctx.storage.sql.exec("SELECT value FROM config WHERE key='connect_code'").toArray()[0];
    const expRow = this.ctx.storage.sql.exec("SELECT value FROM config WHERE key='connect_expires_at'").toArray()[0];
    if (!codeRow || !expRow || codeRow.value !== code || Number(expRow.value) < Date.now()) {
      return { ok: false, reason: "invalid_or_expired_code" };
    }
    this.ctx.storage.sql.exec("INSERT OR REPLACE INTO config(key,value) VALUES('telegram_chat_id',?)", String(chatId));
    this.ctx.storage.sql.exec("DELETE FROM config WHERE key IN ('connect_code','connect_expires_at')");
    return { ok: true };
  }

  async getTelegramChatId() {
    const row = this.ctx.storage.sql.exec("SELECT value FROM config WHERE key='telegram_chat_id'").toArray()[0];
    return row?.value || null;
  }

  async buildReport(days = 7, until = Date.now()) {
    const period = days * 86400000;
    const since = until - period;
    const previousSince = since - period;
    const sql = this.ctx.storage.sql;
    const scalar = (query, ...params) => Number(sql.exec(query, ...params).toArray()[0]?.n || 0);

    const pageViews = scalar("SELECT COUNT(*) n FROM events WHERE event_type='page_view' AND ts>=? AND ts<?", since, until);
    const sessions = scalar("SELECT COUNT(DISTINCT session_id) n FROM events WHERE event_type='page_view' AND ts>=? AND ts<? AND session_id<>''", since, until);
    const previousPageViews = scalar("SELECT COUNT(*) n FROM events WHERE event_type='page_view' AND ts>=? AND ts<?", previousSince, since);

    const sources = sql.exec(
      `SELECT COALESCE(NULLIF(source,''),'direct') source, COUNT(*) count
       FROM events WHERE event_type='page_view' AND ts>=? AND ts<?
       GROUP BY COALESCE(NULLIF(source,''),'direct') ORDER BY count DESC LIMIT 8`,
      since,
      until
    ).toArray();

    const actionRows = sql.exec(
      `SELECT event_type, COUNT(*) count FROM events
       WHERE event_type<>'page_view' AND ts>=? AND ts<?
       GROUP BY event_type ORDER BY count DESC`,
      since,
      until
    ).toArray();

    const actions = Object.fromEntries(actionRows.map((row) => [row.event_type, Number(row.count)]));
    const viewsDeltaPercent = previousPageViews > 0
      ? ((pageViews - previousPageViews) / previousPageViews) * 100
      : 0;

    return {
      since,
      until,
      pageViews,
      sessions,
      previousPageViews,
      viewsDeltaPercent,
      sources: sources.map((row) => ({ source: row.source, count: Number(row.count) })),
      actions
    };
  }
}

async function getReport(env, siteId) {
  const report = await env.ANALYTICS.getByName(siteId).buildReport(7, Date.now());
  const name = siteNames(env)[siteId] || siteId;
  return { report, text: formatWeeklyReport(report, name) };
}

async function sendWeeklyReport(env, siteId) {
  const stub = env.ANALYTICS.getByName(siteId);
  const chatId = await stub.getTelegramChatId();
  if (!chatId) return { ok: false, reason: "telegram_not_connected" };
  const { text } = await getReport(env, siteId);
  await telegramApi(env, "sendMessage", { chat_id: chatId, text, disable_web_page_preview: true });
  return { ok: true };
}

async function handleTelegramWebhook(request, env) {
  const expectedSecret = await telegramWebhookSecret(env);
  if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== expectedSecret) {
    return json({ ok: false }, 401);
  }
  const update = await request.json();
  const message = update?.message;
  const text = String(message?.text || "").trim();
  const chatId = message?.chat?.id;
  if (!chatId || !text.startsWith("/start")) return json({ ok: true });

  const payload = text.split(/\s+/, 2)[1] || "";
  const splitAt = payload.indexOf("_");
  if (splitAt <= 0) {
    await telegramApi(env, "sendMessage", { chat_id: chatId, text: "Ссылка подключения TANEM недействительна." });
    return json({ ok: true });
  }
  const siteId = payload.slice(0, splitAt);
  const code = payload.slice(splitAt + 1);
  if (!siteExists(env, siteId)) return json({ ok: true });

  const result = await env.ANALYTICS.getByName(siteId).connectTelegram(code, String(chatId));
  const siteName = siteNames(env)[siteId] || siteId;
  await telegramApi(env, "sendMessage", {
    chat_id: chatId,
    text: result.ok
      ? `Готово. Еженедельная аналитика TANEM подключена к «${siteName}».`
      : "Ссылка подключения устарела или уже была использована."
  });
  return json({ ok: true });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/health") {
      return json({ ok: true, service: "tanem-analytics", version: "0.1.0" });
    }

    if (url.pathname === "/event" && request.method === "OPTIONS") {
      const requestedSite = url.searchParams.get("site") || "";
      return new Response(null, { status: 204, headers: corsHeaders(request, env, requestedSite) });
    }

    if (url.pathname === "/event" && request.method === "POST") {
      let payload;
      try { payload = await request.json(); } catch { return json({ ok: false, error: "bad_json" }, 400); }
      const siteId = cleanText(payload.site_id, 64);
      const cors = corsHeaders(request, env, siteId);
      if (!siteExists(env, siteId)) return json({ ok: false, error: "unknown_site" }, 404, cors);
      if (!isAllowedOrigin(request, env, siteId)) return json({ ok: false, error: "origin_not_allowed" }, 403, cors);
      try {
        await env.ANALYTICS.getByName(siteId).recordEvent(cleanEvent(payload));
        return json({ ok: true }, 202, cors);
      } catch (error) {
        return json({ ok: false, error: error?.message || "invalid_event" }, 400, cors);
      }
    }

    if (url.pathname === "/telegram/webhook" && request.method === "POST") {
      return handleTelegramWebhook(request, env);
    }

    if (url.pathname.startsWith("/admin/")) {
      if (!adminAuthorized(request, env)) return json({ ok: false, error: "unauthorized" }, 401);
      const siteId = cleanText(url.searchParams.get("site"), 64);

      if (url.pathname === "/admin/setup-telegram" && request.method === "POST") {
        const me = await telegramApi(env, "getMe", {});
        const secretToken = await telegramWebhookSecret(env);
        const webhookUrl = `${url.origin}/telegram/webhook`;
        await telegramApi(env, "setWebhook", { url: webhookUrl, secret_token: secretToken, allowed_updates: ["message"] });
        return json({ ok: true, bot: `@${me.username}`, webhook: webhookUrl });
      }

      if (!siteExists(env, siteId)) return json({ ok: false, error: "unknown_site" }, 404);

      if (url.pathname === "/admin/connect-link" && request.method === "POST") {
        const code = randomToken(10);
        await env.ANALYTICS.getByName(siteId).setConnectCode(code, Date.now() + 15 * 60 * 1000);
        const me = await telegramApi(env, "getMe", {});
        return json({ ok: true, link: `https://t.me/${me.username}?start=${siteId}_${code}`, expires_in_seconds: 900 });
      }

      if (url.pathname === "/admin/report" && request.method === "GET") {
        const result = await getReport(env, siteId);
        return json({ ok: true, ...result });
      }

      if (url.pathname === "/admin/send-test" && request.method === "POST") {
        return json(await sendWeeklyReport(env, siteId));
      }
    }

    return json({ ok: false, error: "not_found" }, 404);
  },

  async scheduled(controller, env, ctx) {
    for (const siteId of reportSites(env)) {
      ctx.waitUntil(
        sendWeeklyReport(env, siteId).catch((error) => console.error("weekly_report_failed", siteId, error))
      );
    }
  }
};

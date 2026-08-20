#!/usr/bin/env node
/**
 * GSC 루틴 알림 전송기
 *
 * 데스크톱 토스트(윈도우 알림) + 웹훅(Slack/Discord 호환)으로 결과를 보낸다.
 * 러너(run-gsc-cycle.ps1)와 알림 에이전트(gsc-report-notifier) 양쪽에서 쓴다.
 *
 * Usage:
 *   node scripts/notify-gsc.mjs --title "제목" --message "본문"
 *   node scripts/notify-gsc.mjs --title "제목" --file reports/gsc/notify-2026-08-20.md
 *   node scripts/notify-gsc.mjs --title "제목" --message "본문" --level error
 *
 * 환경변수:
 *   GSC_NOTIFY_WEBHOOK   Slack/Discord 웹훅 URL (없으면 데스크톱 알림만)
 *   GSC_NOTIFY_SILENT    "1" 이면 데스크톱 토스트 생략 (웹훅만)
 */
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

function parseArgs(argv) {
  const out = { title: "GSC 루틴", message: "", file: null, level: "info" };
  for (let i = 0; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) continue;
    const name = key.slice(2);
    if (name in out) out[name] = argv[i + 1] ?? "";
  }
  return out;
}

/** 토스트 본문은 짧아야 읽힌다 — 길면 잘라서 보낸다. */
function truncate(text, limit) {
  const trimmed = text.trim();
  if (trimmed.length <= limit) return trimmed;
  return `${trimmed.slice(0, limit - 1)}…`;
}

function showDesktopToast(title, message, level) {
  if (process.env.GSC_NOTIFY_SILENT === "1") return { ok: true, skipped: true };
  if (process.platform !== "win32") return { ok: false, reason: "windows 아님" };

  const icon = level === "error" ? "Error" : level === "warn" ? "Warning" : "Information";
  // 작은따옴표는 PowerShell 리터럴 문자열 안에서 두 번 써서 이스케이프한다.
  const esc = (s) => s.replace(/'/g, "''");
  const ps = `
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$n = New-Object System.Windows.Forms.NotifyIcon
$n.Icon = [System.Drawing.SystemIcons]::${icon}
$n.BalloonTipTitle = '${esc(truncate(title, 60))}'
$n.BalloonTipText = '${esc(truncate(message, 240))}'
$n.Visible = $true
$n.ShowBalloonTip(15000)
Start-Sleep -Seconds 10
$n.Dispose()
`.trim();

  const res = spawnSync(
    "powershell.exe",
    ["-NoProfile", "-NonInteractive", "-ExecutionPolicy", "Bypass", "-Command", ps],
    { stdio: "ignore", timeout: 30000 }
  );
  return res.status === 0 ? { ok: true } : { ok: false, reason: `exit ${res.status}` };
}

async function sendWebhook(title, message) {
  const hook = process.env.GSC_NOTIFY_WEBHOOK;
  if (!hook) return { ok: true, skipped: true };

  const body = `**${title}**\n${message}`;
  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Slack 은 text, Discord 는 content 를 읽는다 — 둘 다 넣어 한 벌로 보낸다.
      body: JSON.stringify({ text: body, content: body }),
    });
    return res.ok ? { ok: true } : { ok: false, reason: `HTTP ${res.status}` };
  } catch (err) {
    return { ok: false, reason: err.message };
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  let message = args.message;
  if (args.file) {
    try {
      message = readFileSync(resolve(process.cwd(), args.file), "utf8");
    } catch (err) {
      console.error(`[NOTIFY] 파일을 읽지 못했습니다: ${args.file} — ${err.message}`);
      process.exit(1);
    }
  }
  if (!message.trim()) {
    console.error("[NOTIFY] --message 또는 --file 중 하나는 있어야 합니다.");
    process.exit(1);
  }

  const toast = showDesktopToast(args.title, message, args.level);
  const webhook = await sendWebhook(args.title, message);

  const line = (label, r) =>
    r.skipped ? `${label} 생략` : r.ok ? `${label} 전송` : `${label} 실패(${r.reason})`;
  console.log(`[NOTIFY] ${line("데스크톱", toast)} · ${line("웹훅", webhook)}`);

  // 알림 실패로 루틴 전체를 실패시키지 않는다 — 코드 변경은 이미 끝나 있다.
  process.exit(0);
}

main();

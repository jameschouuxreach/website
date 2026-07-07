// 從 Notion 資料庫抓取作品，下載封面圖，輸出 data/projects.json
// 用法：NOTION_TOKEN=xxx NOTION_DATABASE_ID=xxx node scripts/fetch-notion.mjs
// 需要 Node 18+（內建 fetch）

import { writeFile, mkdir } from "node:fs/promises";
import { createWriteStream } from "node:fs";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import path from "node:path";

const TOKEN = process.env.NOTION_TOKEN;
const DATABASE_ID = process.env.NOTION_DATABASE_ID;
const NOTION_VERSION = "2022-06-28";

// 沒圖時的色塊備援配色
const PALETTE = ["#4f46e5", "#0ea5e9", "#059669", "#ea580c", "#db2777", "#7c3aed"];

if (!TOKEN || !DATABASE_ID) {
  console.error("缺少環境變數：");
  console.error(`  NOTION_TOKEN 長度 = ${(TOKEN || "").length}`);
  console.error(`  NOTION_DATABASE_ID 長度 = ${(DATABASE_ID || "").length}`);
  process.exit(1);
}

// 取 rich_text / title 的純文字
const plain = (prop) =>
  (prop?.title || prop?.rich_text || []).map((t) => t.plain_text).join("").trim();

// 取 Files & media 第一個檔案網址
const fileUrl = (prop) => {
  const f = prop?.files?.[0];
  if (!f) return "";
  return f.type === "external" ? f.external.url : f.file?.url || "";
};

// 由標題產生 2 字縮寫（備援色塊用）
const makeInitials = (name) => {
  const clean = name.replace(/\s+/g, "");
  return (clean.slice(0, 2) || "??").toUpperCase();
};

async function queryDatabase() {
  const results = [];
  let cursor = undefined;
  do {
    const res = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filter: { property: "Published", checkbox: { equals: true } },
        sorts: [{ property: "Order", direction: "ascending" }],
        start_cursor: cursor,
        page_size: 100,
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Notion API ${res.status}: ${text}`);
    }
    const data = await res.json();
    results.push(...data.results);
    cursor = data.has_more ? data.next_cursor : undefined;
  } while (cursor);
  return results;
}

// 下載封面圖到 images/，回傳相對路徑
async function downloadImage(url, pageId) {
  if (!url) return "";
  const ext = (path.extname(new URL(url).pathname) || ".jpg").split("?")[0];
  const fileName = `notion-${pageId.replace(/-/g, "")}${ext}`;
  const dest = path.join("images", fileName);
  const res = await fetch(url);
  if (!res.ok) {
    console.warn(`封面下載失敗 (${res.status})：${url}`);
    return "";
  }
  await pipeline(Readable.fromWeb(res.body), createWriteStream(dest));
  return `images/${fileName}`;
}

async function main() {
  await mkdir("data", { recursive: true });
  await mkdir("images", { recursive: true });

  const pages = await queryDatabase();
  console.log(`抓到 ${pages.length} 筆已發布作品`);

  const projects = [];
  for (const [i, page] of pages.entries()) {
    const p = page.properties;
    const name = plain(p.Name) || "未命名作品";
    const image = await downloadImage(fileUrl(p.Cover), page.id);
    projects.push({
      name,
      tag: plain(p.Tag),
      desc: plain(p.Description),
      image,
      video: p.Video?.url || "",
      color: PALETTE[i % PALETTE.length],
      initials: makeInitials(name),
    });
    console.log(`  ✓ ${name}${image ? " (含封面)" : ""}`);
  }

  await writeFile("data/projects.json", JSON.stringify(projects, null, 2) + "\n");
  console.log(`已寫入 data/projects.json（${projects.length} 筆）`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

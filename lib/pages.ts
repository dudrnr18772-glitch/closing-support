import type { PageRow, PageType } from "@/types/page";

export const PAGE_REVALIDATE_SECONDS = 5 * 60;

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vT-M3ywu0vBZI0azvtZxkRY5pg91z7iwqIgWBJpAIgsDwL1m5IMwwQKt4yXfch5-l119IaQe0dzRUqZ/pub?gid=0&single=true&output=csv";

type PageCache = {
  expiresAt: number;
  promise: Promise<PageRow[]>;
};

let pageCache: PageCache | null = null;

export async function getAllPages(): Promise<PageRow[]> {
  const now = Date.now();

  if (pageCache && pageCache.expiresAt > now) {
    return pageCache.promise;
  }

  const promise = loadPages();
  pageCache = {
    expiresAt: now + PAGE_REVALIDATE_SECONDS * 1000,
    promise,
  };

  return promise;
}

export async function getPublishedPages(): Promise<PageRow[]> {
  const pages = await getAllPages();

  return pages.filter((page) => page.status.trim() === "발행");
}

export async function getPageBySlug(slug: string): Promise<PageRow | null> {
  const cleanSlug = slug.trim();

  if (!cleanSlug) {
    return null;
  }

  const pages = await getPublishedPages();

  return pages.find((page) => page.slug === cleanSlug) ?? null;
}

async function loadPages(): Promise<PageRow[]> {
  try {
    const response = await fetch(CSV_URL, {
      next: { revalidate: PAGE_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(
        `[pages] Failed to fetch page data: ${response.status} ${response.statusText}`,
      );
      return [];
    }

    const csv = await response.text();
    return normalizePages(parseCsv(csv));
  } catch (error) {
    console.error("[pages] Failed to load page data.", error);
    return [];
  }
}

function normalizePages(rows: string[][]): PageRow[] {
  const [headerRow, ...bodyRows] = rows;

  if (!headerRow || headerRow.length === 0) {
    console.error("[pages] Page data is empty or missing a header row.");
    return [];
  }

  const headers = headerRow.map(normalizeHeader);
  const pages: PageRow[] = [];
  const seenSlugs = new Set<string>();
  let skippedRows = 0;

  for (const row of bodyRows) {
    if (row.every((value) => value.trim() === "")) {
      continue;
    }

    const record = Object.fromEntries(
      headers.map((header, index) => [header, clean(row[index] ?? "")]),
    );
    const page = normalizePageRow(record);

    if (!page) {
      skippedRows += 1;
      continue;
    }

    if (seenSlugs.has(page.slug)) {
      skippedRows += 1;
      continue;
    }

    seenSlugs.add(page.slug);
    pages.push(page);
  }

  if (skippedRows > 0) {
    console.warn(`[pages] Skipped ${skippedRows} invalid or duplicate rows.`);
  }

  return pages;
}

function normalizePageRow(record: Record<string, string>): PageRow | null {
  const slug = clean(record.slug);
  const pageType = clean(record.page_type);

  if (!slug || !isPageType(pageType)) {
    return null;
  }

  return {
    slug,
    page_type: pageType,
    지역: clean(record["지역"]),
    업종: clean(record["업종"]),
    메인키워드: clean(record["메인키워드"]),
    콘텐츠관점: clean(record["콘텐츠관점"]),
    톤: clean(record["톤"]),
    매너: clean(record["매너"]),
    status: clean(record.status),
    created_at: clean(record.created_at),
  };
}

function isPageType(value: string): value is PageType {
  return value === "location" || value === "business";
}

function normalizeHeader(value: string): string {
  return value.replace(/^\uFEFF/, "").trim();
}

function clean(value = ""): string {
  return value.trim().replace(/\s+/g, " ");
}

function parseCsv(csv: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let index = 0; index < csv.length; index += 1) {
    const char = csv[index];

    if (inQuotes) {
      if (char === '"') {
        if (csv[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }

      continue;
    }

    if (char === '"') {
      inQuotes = true;
      continue;
    }

    if (char === ",") {
      row.push(field);
      field = "";
      continue;
    }

    if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      continue;
    }

    if (char !== "\r") {
      field += char;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

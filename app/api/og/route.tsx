import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import {
  MAIN_KEYWORD,
  THUMBNAIL_BACKGROUND_IMAGE_PATH,
  THUMBNAIL_IMAGE_HEIGHT,
  THUMBNAIL_IMAGE_WIDTH,
} from "@/lib/seo";

export const runtime = "nodejs";
export const revalidate = 86400;

const defaultTitle = "폐업 철거·원상복구 업체 견적 확인";
const defaultSubtitle = "점포철거비 지원과 공사 범위를 한 번에 확인";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = cleanText(searchParams.get("keyword") || MAIN_KEYWORD, 34);
  const title = cleanText(searchParams.get("title") || defaultTitle, 48);
  const subtitle = cleanText(searchParams.get("subtitle") || defaultSubtitle, 46);
  const backgroundSrc = await getBackgroundSrc();
  const titleLines = splitKoreanLines(title, 15, 3);
  const keywordLines = splitKoreanLines(keyword, 13, 2);

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "100%",
          height: "100%",
          overflow: "hidden",
          background: "#06172c",
          color: "white",
          fontFamily:
            "Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, Arial, sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={backgroundSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(135deg, rgba(6,23,44,0.90) 0%, rgba(10,36,66,0.78) 46%, rgba(10,36,66,0.38) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "86px 82px 78px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                width: "fit-content",
                border: "2px solid rgba(255,255,255,0.30)",
                borderRadius: 999,
                background: "rgba(255,255,255,0.10)",
                color: "rgba(255,255,255,0.92)",
                fontSize: 30,
                fontWeight: 800,
                padding: "14px 24px",
              }}
            >
              소상공인 폐업지원
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 58,
                gap: 10,
              }}
            >
              {keywordLines.map((line) => (
                <div
                  key={line}
                  style={{
                    display: "flex",
                    color: "#ffffff",
                    fontSize: 74,
                    fontWeight: 900,
                    lineHeight: 1.06,
                    letterSpacing: "-1px",
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 48,
                gap: 8,
              }}
            >
              {titleLines.map((line) => (
                <div
                  key={line}
                  style={{
                    display: "flex",
                    color: "rgba(255,255,255,0.94)",
                    fontSize: 48,
                    fontWeight: 800,
                    lineHeight: 1.18,
                  }}
                >
                  {line}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                marginTop: 42,
                maxWidth: 780,
                color: "rgba(255,255,255,0.82)",
                fontSize: 31,
                fontWeight: 600,
                lineHeight: 1.45,
              }}
            >
              {subtitle}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 14,
                color: "rgba(255,255,255,0.86)",
                fontSize: 28,
                fontWeight: 700,
              }}
            >
              <span>철거 범위 확인</span>
              <span style={{ color: "rgba(255,255,255,0.42)" }}>|</span>
              <span>원상복구 검토</span>
              <span style={{ color: "rgba(255,255,255,0.42)" }}>|</span>
              <span>지원 활용 안내</span>
            </div>
            <div
              style={{
                display: "flex",
                borderRadius: 18,
                background: "#ffffff",
                color: "#0a2442",
                fontSize: 30,
                fontWeight: 900,
                padding: "20px 30px",
              }}
            >
              공사 문의
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: THUMBNAIL_IMAGE_WIDTH,
      height: THUMBNAIL_IMAGE_HEIGHT,
    },
  );
}

async function getBackgroundSrc(): Promise<string> {
  const imagePath = join(
    process.cwd(),
    "public",
    THUMBNAIL_BACKGROUND_IMAGE_PATH.replace(/^\//, ""),
  );
  const image = await readFile(imagePath, "base64");
  return `data:image/png;base64,${image}`;
}

function cleanText(value: string, maxLength: number): string {
  const normalized = value.trim().replace(/\s+/g, " ");

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

function splitKoreanLines(value: string, maxLineLength: number, maxLines: number) {
  const words = value.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length <= maxLineLength || current.length === 0) {
      current = next;
      continue;
    }

    lines.push(current);
    current = word;

    if (lines.length === maxLines - 1) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  return lines.length > 0 ? lines : [value];
}

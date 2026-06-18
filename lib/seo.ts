import type { Metadata } from "next";
import type { DetailFaq, DetailMetadata, PageRow } from "@/types/page";

export const MAIN_KEYWORD = "소상공인 폐업지원금";
export const SITE_NAME = "소상공인 폐업지원금";
export const HOME_TITLE =
  "소상공인 폐업지원금 | 점포철거비·원상복구 지원 안내";
export const HOME_DESCRIPTION =
  "소상공인 폐업지원금 신청 전 확인할 희망리턴패키지, 점포철거비 지원, 폐업 철거와 원상복구 공사 범위를 안내합니다.";
export const SEO_KEYWORDS = [
  MAIN_KEYWORD,
  "소상공인 폐업지원금 신청",
  "폐업지원금",
  "희망리턴패키지",
  "점포철거비 지원",
  "소상공인 점포철거비",
  "폐업 철거",
  "원상복구 공사",
];
export const CONSULTATION_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSfdzNitwdwclnvlcy6wj8D73z8kBuRSHsiyCp-L3XB9agx9bQ/viewform?usp=header";
export const THUMBNAIL_BACKGROUND_IMAGE_PATH =
  "/thumbnail-store-closing-support.png";
export const THUMBNAIL_IMAGE_PATH = "/thumbnail-home.png";
export const THUMBNAIL_IMAGE_WIDTH = 1200;
export const THUMBNAIL_IMAGE_HEIGHT = 1200;
export const THUMBNAIL_IMAGE_ALT =
  "소상공인 폐업지원금과 점포철거비 지원 안내 이미지";
export const HOME_THUMBNAIL_ALT =
  "소상공인 폐업지원금, 점포철거비 지원, 폐업 철거와 원상복구 안내 썸네일";

const DEFAULT_SITE_URL = "http://localhost:3000";

type SeoMode = "support" | "demolition" | "restoration" | "cost" | "consult";
type ToneMode = "calm" | "friendly" | "practical" | "concise" | "careful";

export function getSiteUrl(): string {
  const rawUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || DEFAULT_SITE_URL;

  try {
    return new URL(rawUrl).origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function buildCanonicalUrl(slug: string): string {
  const cleanSlug = slug.trim().replace(/^\/+/, "");
  return `${getSiteUrl()}/${encodeURIComponent(cleanSlug)}`;
}

export function buildThumbnailUrl(): string {
  return `${getSiteUrl()}${THUMBNAIL_IMAGE_PATH}`;
}

export function buildOgImagePath({
  title,
  keyword,
  subtitle,
}: {
  title: string;
  keyword: string;
  subtitle: string;
}): string {
  const params = new URLSearchParams({
    title: normalizeOgText(title, 72),
    keyword: normalizeOgText(keyword, 48),
    subtitle: normalizeOgText(subtitle, 70),
  });

  return `/api/og?${params.toString()}`;
}

export function buildHomeOgImagePath(): string {
  return THUMBNAIL_IMAGE_PATH;
}

export function buildHomeOgImageUrl(): string {
  return `${getSiteUrl()}${buildHomeOgImagePath()}`;
}

export function buildDetailOgImagePath(
  page: PageRow,
  metadata: DetailMetadata,
): string {
  const keyword = page.메인키워드 || fallbackKeyword(page);

  return buildOgImagePath({
    title: metadata.title,
    keyword,
    subtitle: "폐업 철거·원상복구 공사 범위와 지원 활용 안내",
  });
}

export function buildDetailOgImageUrl(
  page: PageRow,
  metadata: DetailMetadata,
): string {
  return `${getSiteUrl()}${buildDetailOgImagePath(page, metadata)}`;
}

export function buildSeoCopy(page: PageRow): DetailMetadata {
  const keyword = page.메인키워드 || fallbackKeyword(page);
  const subject = getSubject(page);
  const subjectPhrase =
    page.page_type === "location" ? `${subject} 사업장` : `${subject} 업종`;
  const mode = getSeoMode(page);
  const tone = getToneMode(page);
  const seed = `${page.slug}|${keyword}|${page.콘텐츠관점}|${page.톤}|${page.매너}`;
  const topicKeyword = withParticle(keyword, "은", "는");
  const objectKeyword = withParticle(keyword, "을", "를");
  const subjectKeyword = withParticle(keyword, "이", "가");

  const titlePhrases: Record<SeoMode, string[]> = {
    support: [
      "지원 활용과 철거 범위 안내",
      "폐업 전 공사 항목 안내",
      "사업장 상황별 공사 안내",
    ],
    demolition: [
      "폐업 철거 전 확인 항목",
      "사업장 정리와 원상복구 공사",
      "철거 범위 확인 안내",
    ],
    restoration: [
      "원상복구 범위 확인 공사",
      "임대차 조건과 철거 범위 안내",
      "폐업 전 복구 항목 정리",
    ],
    cost: [
      "비용 영향 항목과 견적 안내",
      "철거 범위별 확인 흐름",
      "사업장 정리 범위 안내",
    ],
    consult: [
      "현장 확인 항목 정리",
      "폐업 진행 방향 안내",
      "사업장 상황 확인",
    ],
  };

  const descriptionPhrases: Record<ToneMode, string[]> = {
    calm: [
      `${objectKeyword} 확인할 때 ${subjectPhrase}의 폐업 일정, 임대차 조건, 철거와 원상복구 범위를 차분히 정리합니다.`,
      `${keyword} 진행은 ${subjectPhrase}의 현재 상태와 계약 조건을 바탕으로 필요한 공사 항목을 안정적으로 살펴봅니다.`,
    ],
    friendly: [
      `${subjectKeyword} 처음이라도 ${subjectPhrase}에서 먼저 확인할 폐업 일정, 철거 범위, 원상복구 항목을 쉽게 정리할 수 있습니다.`,
      `${keyword} 진행 전 ${subjectPhrase}의 상황을 하나씩 나누어 보고, 다음 공사 방향을 이해하기 쉽게 확인할 수 있습니다.`,
    ],
    practical: [
      `${topicKeyword} ${subjectPhrase}의 현장 상태, 임대차 조건, 사업자 상태에 따라 검토 흐름이 달라질 수 있어 실무 확인이 필요합니다.`,
      `${objectKeyword} 진행하기 전 ${subjectPhrase}의 철거 범위와 원상복구 조건을 함께 검토해 실제 진행 항목을 정리합니다.`,
    ],
    concise: [
      `${keyword} 진행 전 ${subjectPhrase}에서 바로 확인할 핵심 항목은 폐업 시점, 사업장 상태, 철거와 원상복구 범위입니다.`,
      `${objectKeyword} 빠르게 정리하려면 ${subjectPhrase}의 현재 조건과 진행 일정을 먼저 확인하는 것이 중요합니다.`,
    ],
    careful: [
      `${topicKeyword} ${subjectPhrase}의 조건에 따라 검토 항목이 달라질 수 있으므로 비용 영향 요소와 진행 범위를 함께 비교합니다.`,
      `${keyword} 진행 전 ${subjectPhrase}의 사업장 정리 범위, 임대차 조건, 일정 변수를 신중하게 확인합니다.`,
    ],
  };

  const title = compactTitle(`${keyword} | ${pick(titlePhrases[mode], seed)}`, keyword);
  const description = compactDescription(pick(descriptionPhrases[tone], seed), keyword);

  return { title, description };
}

export function buildDetailMetadata(
  page: PageRow,
  metadata: DetailMetadata,
): Metadata {
  const canonicalUrl = buildCanonicalUrl(page.slug);
  const ogImagePath = buildDetailOgImagePath(page, metadata);
  const ogImageUrl = buildDetailOgImageUrl(page, metadata);
  const keyword = page.메인키워드 || fallbackKeyword(page);
  const imageAlt = `${keyword} 폐업 철거와 원상복구 지원 안내 썸네일`;

  return {
    title: { absolute: metadata.title },
    description: metadata.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImagePath,
          width: THUMBNAIL_IMAGE_WIDTH,
          height: THUMBNAIL_IMAGE_HEIGHT,
          alt: imageAlt,
        },
      ],
      locale: "ko_KR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: metadata.title,
      description: metadata.description,
      images: [
        {
          url: ogImagePath,
          alt: imageAlt,
        },
      ],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      thumbnail: ogImageUrl,
    },
  };
}

export function buildJsonLd({
  title,
  description,
  canonicalUrl,
  faq,
  imageUrl,
}: {
  title: string;
  description: string;
  canonicalUrl: string;
  faq: DetailFaq[];
  imageUrl?: string;
}) {
  const siteUrl = getSiteUrl();
  const pageImageUrl = imageUrl || buildThumbnailUrl();

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonicalUrl,
      image: pageImageUrl,
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: pageImageUrl,
        width: THUMBNAIL_IMAGE_WIDTH,
        height: THUMBNAIL_IMAGE_HEIGHT,
      },
      inLanguage: "ko-KR",
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: siteUrl,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "홈",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: title,
          item: canonicalUrl,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer,
        },
      })),
    },
  ];
}

export function buildHomeJsonLd({
  title,
  description,
  faq = [],
}: {
  title: string;
  description: string;
  faq?: DetailFaq[];
}) {
  const siteUrl = getSiteUrl();
  const imageUrl = buildHomeOgImageUrl();

  return [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE_NAME,
      url: siteUrl,
      inLanguage: "ko-KR",
      keywords: SEO_KEYWORDS.join(", "),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: siteUrl,
      image: imageUrl,
      keywords: SEO_KEYWORDS.join(", "),
      about: [
        {
          "@type": "Thing",
          name: MAIN_KEYWORD,
        },
        {
          "@type": "Thing",
          name: "점포철거비 지원",
        },
        {
          "@type": "Thing",
          name: "폐업 철거와 원상복구",
        },
      ],
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: imageUrl,
        width: THUMBNAIL_IMAGE_WIDTH,
        height: THUMBNAIL_IMAGE_HEIGHT,
      },
      inLanguage: "ko-KR",
      isPartOf: {
        "@type": "WebSite",
        name: SITE_NAME,
        url: siteUrl,
      },
    },
    ...(faq.length > 0
      ? [
          {
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          },
        ]
      : []),
  ];
}

export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function normalizeOgText(value: string, maxLength: number): string {
  const normalized = value.trim().replace(/\s+/g, " ");

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
}

function getSeoMode(page: PageRow): SeoMode {
  const source = `${page.메인키워드} ${page.콘텐츠관점}`.toLowerCase();

  if (source.includes("원상복구") || source.includes("복구")) {
    return "restoration";
  }

  if (source.includes("비용") || source.includes("견적")) {
    return "cost";
  }

  if (source.includes("지원금") || source.includes("지원")) {
    return "support";
  }

  if (source.includes("철거")) {
    return "demolition";
  }

  return "consult";
}

function getToneMode(page: PageRow): ToneMode {
  const source = `${page.톤} ${page.매너}`;

  if (/친근|초보|대화|상담|설득|쉬운/.test(source)) {
    return "friendly";
  }

  if (/긴급|빠른|전환/.test(source)) {
    return "concise";
  }

  if (/비교|비용효율|비용|신중|리스크|체크리스트/.test(source)) {
    return "careful";
  }

  if (/실무|전문|객관|권위|격식|현장조언/.test(source)) {
    return "practical";
  }

  return "calm";
}

function getSubject(page: PageRow): string {
  if (page.page_type === "location") {
    return page.지역 || "해당 지역";
  }

  return page.업종 || "해당 업종";
}

function fallbackKeyword(page: PageRow): string {
  const subject = getSubject(page);
  return page.page_type === "location"
    ? `${subject} 폐업 철거`
    : `${subject} 폐업 철거`;
}

function pick<T>(items: T[], seed: string): T {
  return items[hashString(seed) % items.length];
}

function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function withParticle(
  value: string,
  withFinal: string,
  withoutFinal: string,
): string {
  return `${value}${hasFinalConsonant(value) ? withFinal : withoutFinal}`;
}

function hasFinalConsonant(value: string): boolean {
  const char = [...value.trim()].at(-1);

  if (!char) {
    return false;
  }

  const code = char.charCodeAt(0);

  if (code < 0xac00 || code > 0xd7a3) {
    return /[0-9A-Za-z]/.test(char);
  }

  return (code - 0xac00) % 28 !== 0;
}

function compactTitle(title: string, keyword: string): string {
  if (title.length <= 58) {
    return title;
  }

  const fallback = `${keyword} 공사 안내`;

  if (fallback.length <= 58) {
    return fallback;
  }

  return keyword.slice(0, 58);
}

function compactDescription(description: string, keyword: string): string {
  if (description.includes(keyword) && description.length <= 155) {
    return description;
  }

  const fallback = `${keyword} 진행 전 사업장 상태, 폐업 일정, 철거와 원상복구 범위를 함께 확인합니다.`;

  if (fallback.length <= 155) {
    return fallback;
  }

  return fallback.slice(0, 152);
}

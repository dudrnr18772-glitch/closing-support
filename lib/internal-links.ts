import type { PageRow } from "@/types/page";

export type InternalLink = {
  href: string;
  slug: string;
  label: string;
  title: string;
  description: string;
};

export const HOME_FEATURED_LINKS: InternalLink[] = [
  {
    href: "/seoul-demolition-support",
    slug: "seoul-demolition-support",
    label: "서울 점포철거",
    title: "서울 폐업 철거비 절감 공사",
    description:
      "폐업 일정에 맞춰 점포 철거 범위를 잡고, 점포철거비 지원 활용 가능성을 함께 검토합니다.",
  },
  {
    href: "/seoul-demolition-restoration",
    slug: "seoul-demolition-restoration",
    label: "철거·복구 공사",
    title: "서울 철거 원상복구 공사",
    description:
      "임대차 조건과 현장 상태를 기준으로 철거, 마감 정리, 원상복구 범위를 한 번에 조율합니다.",
  },
  {
    href: "/restaurant-closing-demolition-company",
    slug: "restaurant-closing-demolition-company",
    label: "음식점 철거",
    title: "음식점 폐업 철거업체",
    description:
      "주방 설비, 배기, 집기 정리처럼 음식점 현장에 맞는 철거 범위와 공사 순서를 확인합니다.",
  },
  {
    href: "/cafe-closing-restoration",
    slug: "cafe-closing-restoration",
    label: "카페 원상복구",
    title: "카페 폐업 원상복구 공사",
    description:
      "카운터, 급배수, 전기, 인테리어 마감 상태를 보고 반납 전 필요한 복구 범위를 정리합니다.",
  },
  {
    href: "/hair-salon-demolition-support",
    slug: "hair-salon-demolition-support",
    label: "미용실 철거비",
    title: "미용실 철거지원금 활용",
    description:
      "샴푸대, 배관, 전기 설비가 있는 미용실 철거 공사에서 비용 절감 가능 항목을 함께 봅니다.",
  },
  {
    href: "/academy-closing-support",
    slug: "academy-closing-support",
    label: "학원 폐업정리",
    title: "학원 폐업 정리와 철거",
    description:
      "강의실 칸막이, 바닥, 간판, 집기 정리까지 폐업 일정에 맞춘 철거 방향을 확인합니다.",
  },
];

export function buildInternalLinks(
  currentPage: PageRow,
  allPages: PageRow[],
  limit = 6,
): InternalLink[] {
  const pages = allPages.filter((page) => page.slug !== currentPage.slug);
  const currentIndex = allPages.findIndex((page) => page.slug === currentPage.slug);
  const currentTopic = getTopicGroup(currentPage.slug);

  const sameSubjectDifferentTopic = pages
    .filter((page) => isSameSubject(currentPage, page))
    .filter((page) => getTopicGroup(page.slug) !== currentTopic)
    .sort((a, b) => getTopicPriority(a) - getTopicPriority(b) || a.slug.localeCompare(b.slug));

  const sameTopicDifferentSubject = pages
    .filter((page) => getTopicGroup(page.slug) === currentTopic)
    .filter((page) => !isSameSubject(currentPage, page))
    .sort((a, b) => getSubjectDistance(currentPage, a) - getSubjectDistance(currentPage, b));

  const differentPageType = pages
    .filter((page) => page.page_type !== currentPage.page_type)
    .sort((a, b) => getTopicPriority(a) - getTopicPriority(b) || a.slug.localeCompare(b.slug));

  const mixed = buildMixedPages(currentPage, allPages, currentIndex);
  const selected = uniquePages([
    ...sameSubjectDifferentTopic.slice(0, 2),
    ...sameTopicDifferentSubject.slice(0, 1),
    ...differentPageType.slice(0, 1),
    ...mixed,
  ]);

  if (selected.length < limit) {
    selected.push(...pages.filter((page) => !selected.some((item) => item.slug === page.slug)));
  }

  return selected.slice(0, limit).map(toInternalLink);
}

function buildMixedPages(
  currentPage: PageRow,
  allPages: PageRow[],
  currentIndex: number,
): PageRow[] {
  if (allPages.length <= 1 || currentIndex < 0) {
    return [];
  }

  const seed = hashString(currentPage.slug);
  const offsets = [
    1,
    5 + (seed % Math.max(7, Math.min(131, allPages.length - 1))),
    29 + (seed % Math.max(11, Math.min(389, allPages.length - 1))),
  ];

  return offsets
    .map((offset) => allPages[(currentIndex + offset) % allPages.length])
    .filter(Boolean)
    .filter((page) => page.slug !== currentPage.slug);
}

function toInternalLink(page: PageRow): InternalLink {
  const subject =
    page.page_type === "location" ? page.지역 || "지역" : page.업종 || "업종";
  const keyword = page.메인키워드 || `${subject} 폐업 철거`;
  const service = getServiceMeta(page.slug, page.page_type);

  return {
    href: `/${page.slug}`,
    slug: page.slug,
    label: service.label,
    title: `${keyword} ${service.titleSuffix}`,
    description: buildLinkDescription(page, subject, service),
  };
}

function buildLinkDescription(
  page: PageRow,
  subject: string,
  service: ReturnType<typeof getServiceMeta>,
): string {
  if (service.topic === "demolition-support") {
    return page.page_type === "location"
      ? `${subject} 사업장의 점포철거비 적용 가능 범위와 실제 철거 공사 항목을 함께 봅니다.`
      : `${subject} 현장의 점포철거비 적용 가능 범위와 폐업 일정에 맞춘 철거 공사 방향을 정리합니다.`;
  }

  return page.page_type === "location"
    ? `${subject} 사업장의 ${service.description} 점포철거비 지원 활용 가능성과 공사 범위를 함께 봅니다.`
    : `${subject} 현장의 ${service.description} 폐업 일정에 맞춰 철거와 원상복구 방향을 정리합니다.`;
}

function getServiceMeta(
  slug: string,
  pageType: PageRow["page_type"],
): {
  topic: string;
  label: string;
  titleSuffix: string;
  description: string;
} {
  if (slug.endsWith("demolition-restoration")) {
    return {
      topic: "demolition-restoration",
      label: "철거·복구",
      titleSuffix: "공사 범위",
      description: "철거와 원상복구 공사 범위를 확인하고",
    };
  }

  if (slug.endsWith("closing-demolition-company")) {
    return {
      topic: "closing-demolition-company",
      label: pageType === "location" ? "지역 철거업체" : "업종 철거업체",
      titleSuffix: "선택 기준",
      description: "현장에 맞는 철거업체 선정 기준과",
    };
  }

  if (slug.endsWith("closing-restoration")) {
    return {
      topic: "closing-restoration",
      label: "원상복구",
      titleSuffix: "복구 공사",
      description: "임대차 반납 전 필요한 원상복구와",
    };
  }

  if (slug.endsWith("demolition-support")) {
    return {
      topic: "demolition-support",
      label: "철거비 절감",
      titleSuffix: "활용 기준",
      description: "철거비를 줄일 수 있는 공사 범위와",
    };
  }

  return {
    topic: "closing-support",
    label: pageType === "location" ? "지역 공사" : "현장 정리",
    titleSuffix: "진행 방향",
    description: "폐업 전 사업장 정리와",
  };
}

function isSameSubject(currentPage: PageRow, targetPage: PageRow): boolean {
  if (currentPage.page_type !== targetPage.page_type) {
    return false;
  }

  return currentPage.page_type === "location"
    ? Boolean(currentPage.지역 && currentPage.지역 === targetPage.지역)
    : Boolean(currentPage.업종 && currentPage.업종 === targetPage.업종);
}

function getSubjectDistance(currentPage: PageRow, targetPage: PageRow): number {
  return Math.abs(hashString(currentPage.slug) - hashString(targetPage.slug));
}

function getTopicPriority(page: PageRow): number {
  const topic = getTopicGroup(page.slug);
  const priority = [
    "demolition-support",
    "demolition-restoration",
    "closing-demolition-company",
    "closing-restoration",
    "closing-support",
  ];

  const index = priority.indexOf(topic);
  return index === -1 ? priority.length : index;
}

function uniquePages(pages: PageRow[]): PageRow[] {
  const seen = new Set<string>();
  const unique: PageRow[] = [];

  for (const page of pages) {
    if (seen.has(page.slug)) {
      continue;
    }

    seen.add(page.slug);
    unique.push(page);
  }

  return unique;
}

function getTopicGroup(slug: string): string {
  const groups = [
    "closing-demolition-company",
    "demolition-restoration",
    "demolition-support",
    "closing-restoration",
    "closing-support",
  ];

  return groups.find((group) => slug.endsWith(group)) ?? "";
}

function hashString(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

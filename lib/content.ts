import type {
  DetailCard,
  DetailSection,
  PageContent,
  PageRow,
} from "@/types/page";
import { buildSeoCopy } from "@/lib/seo";

type FocusMode = "support" | "demolition" | "restoration" | "cost" | "consult";
type ToneMode = "calm" | "friendly" | "practical" | "concise" | "careful";
type MannerMode = "consult" | "direct" | "explain" | "encourage";
type AngleMode =
  | "experience"
  | "expertise"
  | "cost"
  | "risk"
  | "comparison"
  | "process";

type ContentProfile = {
  focus: FocusMode;
  angle: AngleMode;
  tone: ToneMode;
  manner: MannerMode;
  perspective: string;
  toneLabel: string;
  mannerLabel: string;
  seed: string;
  subject: string;
  subjectPhrase: string;
  keyword: string;
};

export function buildPageContent(page: PageRow): PageContent {
  const profile = buildProfile(page);
  const pageKind = page.page_type === "location" ? "지역 공사" : "업종 공사";
  const metadata = buildSeoCopy(page);

  return {
    label: `${pageKind} 안내`,
    h1: buildH1(profile),
    heroDescription: buildHeroDescription(page, profile),
    heroBullets: buildHeroBullets(page, profile),
    summaryCards: buildSummaryCards(page, profile),
    imageAlt: `${profile.keyword} 현장 확인 전 살펴볼 폐업 철거와 원상복구 안내 이미지`,
    checkSection: buildCheckSection(page, profile),
    supportSection: buildSupportSection(page, profile),
    restoreSection: buildRestoreSection(page, profile),
    consultSection: buildConsultSection(page, profile),
    processSection: buildProcessSection(page, profile),
    faq: buildFaq(page, profile),
    finalCta: buildFinalCta(page, profile),
    metadata,
  };
}

function buildProfile(page: PageRow): ContentProfile {
  const keyword = page.메인키워드 || fallbackKeyword(page);
  const subject = page.page_type === "location" ? page.지역 : page.업종;
  const cleanSubject = subject || "사업장";

  return {
    focus: getFocusMode(page),
    angle: getAngleMode(page),
    tone: getToneMode(page),
    manner: getMannerMode(page),
    perspective: page.콘텐츠관점,
    toneLabel: page.톤,
    mannerLabel: page.매너,
    seed: `${page.slug}|${keyword}|${page.콘텐츠관점}|${page.톤}|${page.매너}`,
    subject: cleanSubject,
    subjectPhrase:
      page.page_type === "location"
        ? `${cleanSubject} 사업장`
        : `${cleanSubject} 매장`,
    keyword,
  };
}

function buildH1(profile: ContentProfile): string {
  const endings: Record<FocusMode, string[]> = {
    support: [
      "철거 전 확인해야 할 지원 활용 항목",
      "폐업 전 먼저 정리할 공사 범위",
      "철거와 원상복구까지 함께 보는 현장 확인",
    ],
    demolition: [
      "폐업 철거 전 확인해야 할 사업장 정리 항목",
      "철거 범위와 원상복구를 함께 보는 공사 안내",
      "사업장 정리 전에 살펴볼 현장 항목",
    ],
    restoration: [
      "원상복구 범위를 먼저 확인하는 공사",
      "임대차 조건과 철거 범위를 함께 보는 복구 안내",
      "폐업 전 복구 항목을 정리하는 현장 확인",
    ],
    cost: [
      "비용에 영향을 주는 범위를 확인하는 공사 안내",
      "철거와 원상복구 범위를 함께 정리하는 견적 준비",
      "사업장 상태별 확인 항목 안내",
    ],
    consult: [
      "폐업 전 현장 확인으로 보는 핵심 항목",
      "사업장 상황을 차분히 정리하는 공사 안내",
      "진행 방향을 함께 확인하는 현장 문의",
    ],
  };

  return `${profile.keyword}, ${pick(endings[profile.focus], profile.seed)}`;
}

function buildHeroDescription(page: PageRow, profile: ContentProfile): string {
  const subjectSentence =
    page.page_type === "location"
      ? `${profile.subject}에서 폐업을 앞둔 사업장은 위치, 임대차 조건, 현장 상태에 따라 확인해야 할 항목이 달라질 수 있습니다.`
      : `${profile.subject} 폐업은 영업 형태와 매장 구조, 임대차 조건에 따라 사업장 정리 범위가 달라질 수 있습니다.`;

  const focusSentences: Record<FocusMode, string[]> = {
    support: [
      "지원 가능 여부를 단정하기보다 사업자 상태, 폐업 시점, 철거와 원상복구 범위를 함께 검토하는 흐름이 필요합니다.",
      "사업장 조건에 따라 검토해야 할 항목이 달라질 수 있어 철거 전 현재 상황을 먼저 정리하는 것이 좋습니다.",
    ],
    demolition: [
      "철거를 먼저 진행하기보다 폐업 일정, 현장 상태, 임대차 원상복구 조건을 함께 확인한 뒤 방향을 잡는 것이 좋습니다.",
      "사업장 정리는 일정과 계약 조건이 맞물리므로 진행 전에 철거 범위와 확인 항목을 나누어 보는 과정이 필요합니다.",
    ],
    restoration: [
      "원상복구 범위는 계약 조건과 현장 상태에 따라 달라질 수 있으므로 폐업 전 확인이 필요합니다.",
      "임대차 조건을 먼저 살펴야 철거 범위와 복구 항목을 무리 없이 정리할 수 있습니다.",
    ],
    cost: [
      "비용은 사업장 구조와 정리 범위에 따라 달라질 수 있으므로 지원 검토와 현장 확인 항목을 함께 봐야 합니다.",
      "견적을 단정하기 전에 철거 범위, 원상복구 조건, 진행 일정을 함께 정리하는 흐름이 필요합니다.",
    ],
    consult: [
      "현장 문의를 통해 현재 상황에서 확인해야 할 항목과 다음 진행 방향을 차분히 정리합니다.",
      "폐업 전 필요한 확인 사항을 공사 전 단계에서 나누어 보면 일정과 범위를 더 명확하게 잡을 수 있습니다.",
    ],
  };

  return `${subjectSentence} ${adaptSentence(
    pick(focusSentences[profile.focus], profile.seed),
    profile,
  )}`;
}

function buildHeroBullets(page: PageRow, profile: ContentProfile): string[] {
  const base =
    page.page_type === "location"
      ? [
          `${profile.subject} 사업장 위치와 폐업 예정 흐름`,
          "임대차 조건에 따른 원상복구 확인",
        ]
      : [
          `${profile.subject} 영업 형태와 매장 구조`,
          "폐업에 따른 사업장 정리 범위",
        ];

  const focusBullets: Record<FocusMode, string[]> = {
    support: [
      "지원 검토 전 확인할 사업자 상태",
      "철거와 원상복구 범위에 따른 공사 항목",
    ],
    demolition: [
      "폐업 철거 전 확인할 현장 상태",
      "진행 일정과 임대차 조건 정리",
    ],
    restoration: [
      "계약 조건에 따른 복구 범위",
      "철거 진행 전 조율해야 할 확인 항목",
    ],
    cost: [
      "비용에 영향을 주는 사업장 정리 범위",
      "현장 확인 전 준비하면 좋은 기본 정보",
    ],
    consult: [
      "현장 문의 후 확인되는 핵심 항목",
      "현재 조건에 맞춘 다음 진행 방향",
    ],
  };

  return [...base, ...focusBullets[profile.focus]];
}

function buildSummaryCards(page: PageRow, profile: ContentProfile): DetailCard[] {
  const scopeLabel =
    page.page_type === "location" ? `${profile.subject} 기준` : `${profile.subject} 특성`;

  const focusCards: Record<FocusMode, DetailCard[]> = {
    support: [
      {
        title: "지원 검토 전 확인",
        description: `${scopeLabel}으로 사업자 상태와 폐업 시점을 먼저 살펴보고, 확인이 필요한 조건을 정리합니다.`,
      },
      {
        title: "철거 공사 범위",
        description: "사업장 정리와 원상복구 공사가 함께 검토되어야 일정과 범위를 현실적으로 잡을 수 있습니다.",
      },
      {
        title: "진행 방향 정리",
        description: "확정적인 안내가 아니라 현재 조건에서 확인해야 할 항목을 차례대로 나눕니다.",
      },
    ],
    demolition: [
      {
        title: "철거 전 현장 확인",
        description: `${scopeLabel}과 현장 상태를 바탕으로 폐업 철거 전에 살펴야 할 범위를 정리합니다.`,
      },
      {
        title: "임대차 조건 검토",
        description: "계약 조건에 따라 원상복구 범위가 달라질 수 있어 철거 전 함께 확인합니다.",
      },
      {
        title: "일정 조율",
        description: "폐업 일정, 사업장 정리 순서, 공사 진행 방향을 무리 없이 연결합니다.",
      },
    ],
    restoration: [
      {
        title: "원상복구 범위 확인",
        description: `${scopeLabel}과 계약 조건을 기준으로 복구가 필요한 범위를 먼저 나누어 봅니다.`,
      },
      {
        title: "철거와 복구 연결",
        description: "철거만 따로 보지 않고 임대차 조건과 현장 상태를 함께 검토합니다.",
      },
      {
        title: "분쟁 예방 관점",
        description: "진행 전 확인할 내용을 정리해 일정 지연이나 범위 오해를 줄이는 방향으로 안내합니다.",
      },
    ],
    cost: [
      {
        title: "비용 영향 항목",
        description: `${scopeLabel}에서 비용에 영향을 줄 수 있는 구조, 범위, 일정 요소를 함께 확인합니다.`,
      },
      {
        title: "범위별 공사 검토",
        description: "사업장 정리와 원상복구 범위를 나누어 보며 공사비에 영향을 주는 항목을 정리합니다.",
      },
      {
        title: "지원 검토 흐름",
        description: "지원 가능 여부는 단정하지 않고 현재 조건에서 확인할 내용을 차례대로 봅니다.",
      },
    ],
    consult: [
      {
        title: "현장 확인 전 기본 정리",
        description: `${scopeLabel}으로 사업장 위치, 구조, 폐업 일정을 먼저 정리하면 공사 범위가 더 선명해집니다.`,
      },
      {
        title: "확인 항목 분리",
        description: "지원 검토, 철거 범위, 원상복구 조건을 나누어 현재 상황에 맞게 살펴봅니다.",
      },
      {
        title: "다음 단계 안내",
        description: "현장 확인 내용을 바탕으로 진행 전 확인할 항목과 순서를 정리합니다.",
      },
    ],
  };

  return buildAngleSummaryCards(focusCards[profile.focus], profile);
}

function buildCheckSection(page: PageRow, profile: ContentProfile): DetailSection {
  const locationOrBusiness =
    page.page_type === "location"
      ? `${profile.subject} 지역의 특정 조건을 추측하지 않고, 실제 사업장 상황을 기준으로 확인합니다.`
      : `${profile.subject} 업종의 비용이나 지원 여부를 단정하지 않고, 매장 구조와 영업 형태를 기준으로 확인합니다.`;

  return {
    eyebrow: "확인 항목",
    title: getCheckSectionTitle(profile),
    description: `${locationOrBusiness} ${adaptSentence(
      getCheckSectionDescription(profile),
      profile,
    )}`,
    cards: buildCheckCards(profile),
  };
}

function buildSupportSection(page: PageRow, profile: ContentProfile): DetailSection {
  const titleByFocus: Record<FocusMode, string> = {
    support: "점포철거비 지원은 공사비 절감과 어떻게 연결하나요?",
    demolition: "폐업 철거를 먼저 진행하기 전에 무엇을 확인하나요?",
    restoration: "원상복구 조건은 왜 철거 전 확인해야 하나요?",
    cost: "비용을 보기 전에 어떤 범위를 나누어야 하나요?",
    consult: "현장 문의 후에는 어떤 내용을 확인하나요?",
  };

  return {
    eyebrow: "공사 기준",
    title: titleByFocus[profile.focus],
    description: adaptSentence(getSupportDescription(profile), profile),
    cards: buildSupportCards(profile),
  };
}

function buildRestoreSection(page: PageRow, profile: ContentProfile): DetailSection {
  const sectionIntro =
    page.page_type === "location"
      ? `${profile.subject} 사업장이라도 건물 구조와 임대차 조건은 서로 다를 수 있습니다.`
      : `${profile.subject} 매장이라도 영업 형태와 내부 구조에 따라 확인 항목이 달라질 수 있습니다.`;

  return {
    eyebrow: "철거와 원상복구",
    title: getRestoreSectionTitle(profile),
    description: `${sectionIntro} ${adaptSentence(
      getRestoreDescription(profile),
      profile,
    )}`,
    cards: buildRestoreCards(profile),
  };
}

function buildConsultSection(page: PageRow, profile: ContentProfile) {
  const subjectGuide =
    page.page_type === "location"
      ? `${profile.subject} 사업장 위치와 현장 상황`
      : `${profile.subject} 매장의 영업 형태와 구조`;

  return {
    eyebrow: "공사 범위",
    title: getConsultSectionTitle(profile),
    description: adaptSentence(
      getConsultDescription(profile),
      profile,
    ),
    items: buildConsultItems(subjectGuide, profile),
  };
}

function buildProcessSection(page: PageRow, profile: ContentProfile) {
  const firstStep =
    profile.manner === "direct"
      ? "현재 사업장 정보를 먼저 남깁니다."
      : "현재 상황을 남기면 현장 확인에서 볼 항목을 정리합니다.";
  const subjectStep =
    page.page_type === "location"
      ? `${profile.subject} 사업장 위치와 폐업 일정을 확인합니다.`
      : `${profile.subject} 매장 구조와 폐업 일정을 확인합니다.`;

  return {
    eyebrow: "진행 절차",
    title: `${profile.keyword} 공사는 이렇게 진행됩니다`,
    description: adaptSentence(
      "문의 후에는 사업장 상황을 기준으로 확인 항목을 나누고, 견적과 다음 진행 방향을 차례대로 정리합니다.",
      profile,
    ),
    steps: [
      {
        step: "01",
        title: getProcessStepTitle(profile, 0),
        description: firstStep,
      },
      {
        step: "02",
        title: getProcessStepTitle(profile, 1),
        description: subjectStep,
      },
      {
        step: "03",
        title: getProcessStepTitle(profile, 2),
        description: getProcessStepDescription(profile, 2),
      },
      {
        step: "04",
        title: getProcessStepTitle(profile, 3),
        description: getProcessStepDescription(profile, 3),
      },
    ],
  };
}

function buildFaq(page: PageRow, profile: ContentProfile) {
  const subjectQuestion =
    page.page_type === "location"
      ? `${profile.subject}에서도 ${profile.keyword} 공사를 문의할 수 있나요?`
      : `${profile.subject}도 ${profile.keyword} 진행이 가능한가요?`;
  const subjectAnswer =
    page.page_type === "location"
      ? `${profile.subject} 사업장도 위치와 현장 상황, 임대차 조건에 따라 공사 범위가 달라질 수 있습니다. 현장 확인에서는 지원 검토, 철거 범위, 원상복구 조건을 함께 정리합니다.`
      : `${profile.subject} 매장도 영업 형태와 내부 구조에 따라 정리해야 할 범위가 달라질 수 있습니다. 현장 확인에서는 현재 조건에서 필요한 공사 항목을 나누어 봅니다.`;
  const topicKeyword = withParticle(profile.keyword, "은", "는");

  const focusFaq = {
    support: {
      question: `${topicKeyword} 진행 전에 무엇을 준비하면 좋나요?`,
      answer:
        "사업자 상태, 폐업 예정 시점, 임대차 계약 조건, 사업장 현장 상태를 간단히 정리하면 지원 검토와 철거 범위를 함께 확인하기 쉽습니다.",
    },
    demolition: {
      question: "철거를 진행하기 전에 현장 확인이 필요한 이유는 무엇인가요?",
      answer:
        "철거 범위와 원상복구 조건은 임대차 계약과 현장 상태에 따라 달라질 수 있습니다. 진행 전에 확인하면 일정과 범위를 더 명확하게 잡을 수 있습니다.",
    },
    restoration: {
      question: "원상복구 범위는 어떻게 확인하나요?",
      answer:
        "임대차 계약 조건, 임대인 요청 사항, 현장 상태를 함께 확인합니다. 현장 확인에서는 복구가 필요한 범위를 단정하지 않고 현재 조건에 맞춰 살펴봅니다.",
    },
    cost: {
      question: "철거 비용은 바로 확정되나요?",
      answer:
        "비용은 사업장 구조, 정리 범위, 원상복구 조건에 따라 달라질 수 있습니다. 현장 확인에서는 비용에 영향을 주는 항목을 먼저 확인합니다.",
    },
    consult: {
      question: "문의 후에는 어떤 순서로 진행되나요?",
      answer:
        "남겨 주신 내용을 기준으로 사업장 상태와 폐업 일정을 확인하고, 철거와 원상복구 범위, 지원 검토에 필요한 항목을 차례대로 정리합니다.",
    },
  }[profile.focus];

  return [
    {
      question: subjectQuestion,
      answer: adaptSentence(subjectAnswer, profile),
    },
    focusFaq,
    {
      question: "지원 가능 여부를 바로 알 수 있나요?",
      answer:
        "지원 가능 여부는 사업장 상황과 기준에 따라 달라질 수 있어 단정할 수 없습니다. 현장 확인에서는 현재 조건에서 검토해야 할 내용을 먼저 확인합니다.",
    },
    {
      question: "폐업 철거와 원상복구를 함께 진행할 수 있나요?",
      answer:
        "두 항목은 임대차 조건과 현장 상태에 함께 영향을 받는 경우가 많습니다. 함께 확인하면 폐업 일정과 사업장 정리 범위를 더 안정적으로 잡을 수 있습니다.",
    },
  ];
}

function buildFinalCta(page: PageRow, profile: ContentProfile) {
  const lead =
    page.page_type === "location"
      ? `${profile.subject}에서 폐업을 앞두고 있다면`
      : `${profile.subject} 폐업을 앞두고 있다면`;

  return {
    title: `${profile.keyword} 공사 범위가 필요하다면 현장부터 확인하세요`,
    description: adaptSentence(
      `${lead} 지원 검토, 폐업 철거, 원상복구 범위를 따로 판단하기보다 현재 사업장 상황을 기준으로 함께 확인하고 공사비 부담을 줄일 방향을 잡는 것이 좋습니다.`,
      profile,
    ),
    buttonLabel: "공사 문의하기",
  };
}

function getAngleMode(page: PageRow): AngleMode {
  const perspective = page.콘텐츠관점;
  const tone = page.톤;
  const manner = page.매너;
  const source = `${perspective} ${tone} ${manner}`;

  if (/비용효율|비용|견적|절감/.test(tone)) {
    return "cost";
  }

  if (/신중|리스크|위험|주의|분쟁/.test(`${tone} ${manner}`)) {
    return "risk";
  }

  if (/비교/.test(`${tone} ${manner}`)) {
    return "comparison";
  }

  if (/긴급|단계|체크리스트|절차|진행/.test(`${tone} ${manner}`)) {
    return "process";
  }

  if (/전문성|권위성|전문|실무|객관|격식/.test(source)) {
    return "expertise";
  }

  return "experience";
}

function buildAngleSummaryCards(
  cards: DetailCard[],
  profile: ContentProfile,
): DetailCard[] {
  const angleCard: Record<AngleMode, DetailCard> = {
    experience: {
      title: "현장 경험 기준",
      description: `${profile.subjectPhrase}에서 자주 놓치는 철거 범위와 반납 전 조율 항목을 먼저 짚습니다.`,
    },
    expertise: {
      title: "실무 기준 정리",
      description: "지원 검토, 철거 범위, 원상복구 조건을 분리해 공사 판단에 필요한 기준을 세웁니다.",
    },
    cost: {
      title: "비용 절감 포인트",
      description: "점포철거비 지원 활용 가능성과 공사비에 영향을 주는 범위를 함께 확인합니다.",
    },
    risk: {
      title: "분쟁 예방 항목",
      description: "임대차 반납, 원상복구 요청, 공사 일정이 어긋나지 않도록 위험 요소를 먼저 봅니다.",
    },
    comparison: {
      title: "범위 비교 기준",
      description: "필수 철거, 선택 정리, 원상복구 항목을 나누어 견적 비교가 가능하게 정리합니다.",
    },
    process: {
      title: "진행 순서 설계",
      description: "문의, 현장 확인, 지원 검토, 공사 일정 조율까지 필요한 순서를 연결합니다.",
    },
  };

  return [cards[0], cards[1], angleCard[profile.angle]].map((card) => ({
    title: adaptTitle(card.title, profile),
    description: adaptSentence(card.description, profile),
  }));
}

function adaptTitle(title: string, profile: ContentProfile): string {
  if (profile.manner === "direct" && title.endsWith("확인")) {
    return title.replace(/확인$/, "점검");
  }

  if (profile.tone === "friendly" && title.includes("기준")) {
    return title.replace("기준", "체크");
  }

  if (profile.tone === "careful" && !title.includes("점검")) {
    return `${title} 점검`;
  }

  return title;
}

function getCheckSectionTitle(profile: ContentProfile): string {
  const titles: Record<AngleMode, string> = {
    experience: `${profile.keyword} 현장에서 자주 확인하는 항목`,
    expertise: `${profile.keyword} 진행 전 실무 기준`,
    cost: `${profile.keyword} 비용을 좌우하는 확인 항목`,
    risk: `${profile.keyword} 전 놓치면 부담되는 항목`,
    comparison: `${profile.keyword} 견적 전에 비교할 범위`,
    process: `${profile.keyword} 진행 순서별 확인 항목`,
  };

  return titles[profile.angle];
}

function getCheckSectionDescription(profile: ContentProfile): string {
  const descriptions: Record<AngleMode, string> = {
    experience:
      "폐업 전에는 현장에서 실제로 문제가 되는 시설, 마감, 반납 조건을 함께 정리해야 합니다.",
    expertise:
      "폐업 전에는 사업자 상태, 임대차 조건, 철거와 원상복구 범위를 기준에 맞춰 정리해야 합니다.",
    cost:
      "폐업 전에는 공사비에 영향을 주는 철거 범위, 지원 활용 가능성, 원상복구 조건을 함께 정리해야 합니다.",
    risk:
      "폐업 전에는 일정 지연이나 임대차 분쟁으로 이어질 수 있는 철거와 원상복구 범위를 함께 정리해야 합니다.",
    comparison:
      "폐업 전에는 포함할 공사와 제외할 정리 항목을 나누어 견적 비교가 가능하도록 정리해야 합니다.",
    process:
      "폐업 전에는 문의, 현장 확인, 지원 검토, 공사 일정 순서가 어긋나지 않게 정리해야 합니다.",
  };

  return descriptions[profile.angle];
}

function buildCheckCards(profile: ContentProfile): DetailCard[] {
  const commonSubject = profile.subjectPhrase;
  const cards: Record<AngleMode, DetailCard[]> = {
    experience: [
      {
        title: "기존 시설 상태",
        description: `${commonSubject}에 남아 있는 설비, 집기, 마감 상태를 기준으로 철거 난이도를 봅니다.`,
      },
      {
        title: "임대인 요청 범위",
        description: "계약서 외 요청 사항이 있는지 확인해 반납 전 조율할 항목을 분리합니다.",
      },
      {
        title: "현장 동선과 작업 조건",
        description: "엘리베이터, 공용부, 작업 가능 시간처럼 실제 공사에 영향을 주는 조건을 봅니다.",
      },
      {
        title: "반납 전 마감 상태",
        description: "철거 후 남겨야 할 마감과 복구해야 할 부분을 현장 기준으로 정리합니다.",
      },
    ],
    expertise: [
      {
        title: "사업자 상태와 폐업 시점",
        description: "지원 검토와 공사 일정에 영향을 주는 기본 상태를 먼저 확인합니다.",
      },
      {
        title: "임대차 계약 조건",
        description: "계약서상 원상복구 조항과 임대인 요청 사항을 기준으로 범위를 나눕니다.",
      },
      {
        title: "철거 공사 범위",
        description: "내부 철거, 집기 반출, 마감 정리 중 필요한 공사 항목을 구분합니다.",
      },
      {
        title: "증빙과 진행 순서",
        description: "지원 활용을 고려할 때 공사 전후 확인해야 할 절차와 자료를 정리합니다.",
      },
    ],
    cost: [
      {
        title: "공사비 영향 범위",
        description: "철거 면적, 설비 종류, 폐기물 양처럼 견적에 바로 영향을 주는 항목을 확인합니다.",
      },
      {
        title: "지원 활용 가능성",
        description: "점포철거비 지원을 활용할 수 있는 조건과 공사 범위의 연결 지점을 봅니다.",
      },
      {
        title: "추가 비용 변수",
        description: "야간 작업, 공용부 보호, 특수 설비 철거처럼 비용이 늘 수 있는 요소를 분리합니다.",
      },
      {
        title: "견적 전 정리 항목",
        description: "필수 철거와 선택 정리를 나누어 불필요한 공사비가 섞이지 않게 합니다.",
      },
    ],
    risk: [
      {
        title: "반납 지연 가능성",
        description: "철거 일정과 임대차 종료일이 충돌하지 않도록 먼저 확인합니다.",
      },
      {
        title: "원상복구 분쟁 요소",
        description: "복구 범위가 모호한 벽체, 바닥, 전기, 급배수 항목을 따로 봅니다.",
      },
      {
        title: "공용부 작업 제한",
        description: "건물 관리 규정과 작업 시간 제한이 공사 일정에 미치는 영향을 확인합니다.",
      },
      {
        title: "지원 검토 누락",
        description: "철거를 먼저 진행해 지원 활용이 어려워지는 상황을 피하도록 순서를 점검합니다.",
      },
    ],
    comparison: [
      {
        title: "포함 공사 범위",
        description: "견적에 들어가야 할 내부 철거, 반출, 폐기, 복구 항목을 구분합니다.",
      },
      {
        title: "제외 정리 항목",
        description: "직접 정리할 수 있는 항목과 업체 공사가 필요한 항목을 비교합니다.",
      },
      {
        title: "원상복구 수준",
        description: "전체 복구인지 일부 마감 정리인지 기준을 세워 견적 차이를 확인합니다.",
      },
      {
        title: "지원 적용 범위",
        description: "지원 활용이 가능한 공사와 일반 비용으로 볼 항목을 나누어 봅니다.",
      },
    ],
    process: [
      {
        title: "문의 시점",
        description: "폐업 예정일과 임대차 종료일을 기준으로 현장 확인 일정을 잡습니다.",
      },
      {
        title: "현장 확인",
        description: "사업장 구조, 설비, 마감, 반납 조건을 확인해 공사 범위를 정합니다.",
      },
      {
        title: "지원 검토",
        description: "점포철거비 지원 활용 가능성과 필요한 준비 항목을 함께 확인합니다.",
      },
      {
        title: "공사 일정",
        description: "철거, 폐기, 원상복구, 마무리 확인 순서로 진행 방향을 맞춥니다.",
      },
    ],
  };

  return cards[profile.angle].map((card) => ({
    title: adaptTitle(card.title, profile),
    description: adaptSentence(card.description, profile),
  }));
}

function getSupportDescription(profile: ContentProfile): string {
  const descriptions: Record<AngleMode, string> = {
    experience: `${profile.subjectPhrase}에서 자주 발생하는 철거 변수와 지원 활용 가능성을 현장 기준으로 함께 확인합니다.`,
    expertise: `${profile.subjectPhrase}의 폐업 철거는 현재 조건에서 필요한 공사 범위와 지원 활용 항목을 기준에 맞춰 확인하는 방식으로 진행됩니다.`,
    cost: `${profile.subjectPhrase}의 공사비를 줄이려면 지원 검토와 견적 범위를 같은 기준에서 봐야 합니다.`,
    risk: `${profile.subjectPhrase}의 철거를 서두르기 전에 지원 누락, 반납 지연, 원상복구 분쟁 가능성을 함께 확인합니다.`,
    comparison: `${profile.subjectPhrase}의 철거 견적은 포함 범위와 지원 적용 범위를 나누어 볼수록 판단이 쉬워집니다.`,
    process: `${profile.subjectPhrase}의 폐업 일정에 맞춰 현장 확인, 지원 검토, 견적, 공사 순서를 연결합니다.`,
  };

  return descriptions[profile.angle];
}

function buildSupportCards(profile: ContentProfile): DetailCard[] {
  const cards: Record<AngleMode, DetailCard[]> = {
    experience: [
      {
        title: "현장 변수",
        description: "기존 인테리어, 설비, 폐기물 상태를 보고 공사 난이도를 확인합니다.",
      },
      {
        title: "지원 활용 지점",
        description: "점포철거비 지원이 공사비 절감과 연결될 수 있는 범위를 살펴봅니다.",
      },
      {
        title: "반납 전 조율",
        description: "임대인 요청과 실제 복구 범위를 비교해 진행 전 조율할 부분을 정리합니다.",
      },
    ],
    expertise: [
      {
        title: "지원 검토 기준",
        description: "사업자 상태, 폐업 시점, 사업장 조건처럼 공사 전 확인할 기본 항목을 정리합니다.",
      },
      {
        title: "철거 진행 범위",
        description: "사업장 정리와 원상복구가 어떻게 연결되는지 확인하고 진행 전 유의할 내용을 봅니다.",
      },
      {
        title: "현장별 변수",
        description: "위치, 구조, 계약 조건에 따라 달라질 수 있는 항목을 과장 없이 확인합니다.",
      },
    ],
    cost: [
      {
        title: "절감 가능 항목",
        description: "지원 활용 가능성과 견적에서 줄일 수 있는 범위를 함께 확인합니다.",
      },
      {
        title: "견적 산정 기준",
        description: "철거 면적, 폐기물, 설비 철거, 복구 마감을 기준으로 비용 변수를 나눕니다.",
      },
      {
        title: "추가 비용 방지",
        description: "처음 견적에 빠지기 쉬운 공용부 보호, 야간 작업, 마감 복구를 미리 확인합니다.",
      },
    ],
    risk: [
      {
        title: "지원 누락 방지",
        description: "공사를 먼저 진행해 확인이 어려워지는 항목이 생기지 않도록 순서를 봅니다.",
      },
      {
        title: "반납 조건 검토",
        description: "임대차 종료 전 요구되는 복구 수준과 공사 가능 일정을 확인합니다.",
      },
      {
        title: "현장 책임 범위",
        description: "철거 후 마감 상태와 남겨야 할 시설을 분명히 나누어 분쟁 가능성을 줄입니다.",
      },
    ],
    comparison: [
      {
        title: "견적 비교 기준",
        description: "철거, 폐기, 복구, 마감 항목이 같은 기준으로 포함됐는지 확인합니다.",
      },
      {
        title: "업체 선택 기준",
        description: "현장 확인 방식과 지원 활용 이해도를 기준으로 업체 판단 기준을 세웁니다.",
      },
      {
        title: "공사 범위 비교",
        description: "전체 철거와 일부 정리, 원상복구 포함 여부를 나누어 봅니다.",
      },
    ],
    process: [
      {
        title: "현장 확인",
        description: "사진과 기본 정보만으로 부족한 부분을 실제 공사 범위 기준으로 확인합니다.",
      },
      {
        title: "지원 검토",
        description: "점포철거비 지원 활용 가능성과 필요한 준비 항목을 공사 전에 봅니다.",
      },
      {
        title: "일정 조율",
        description: "폐업일, 반납일, 공사 가능 시간을 맞춰 진행 순서를 잡습니다.",
      },
    ],
  };

  return cards[profile.angle].map((card) => ({
    title: adaptTitle(card.title, profile),
    description: adaptSentence(card.description, profile),
  }));
}

function getRestoreSectionTitle(profile: ContentProfile): string {
  const titles: Record<AngleMode, string> = {
    experience: `${profile.subjectPhrase} 반납 전 실제로 확인할 복구 범위`,
    expertise: `${profile.subjectPhrase} 철거와 원상복구 기준`,
    cost: `${profile.subjectPhrase} 복구 범위와 비용 변수`,
    risk: `${profile.subjectPhrase} 원상복구 분쟁을 줄이는 확인 항목`,
    comparison: `${profile.subjectPhrase} 철거와 복구 범위 비교`,
    process: `${profile.subjectPhrase} 정리와 복구 진행 순서`,
  };

  return titles[profile.angle];
}

function getRestoreDescription(profile: ContentProfile): string {
  const descriptions: Record<AngleMode, string> = {
    experience:
      "철거 후 남는 마감, 설비 흔적, 임대인 요청 범위를 함께 확인해야 반납 전 부담을 줄일 수 있습니다.",
    expertise:
      "철거 범위와 원상복구 조건은 함께 확인해야 폐업 일정에 맞춘 진행 방향을 잡을 수 있습니다.",
    cost:
      "복구 수준에 따라 공사비가 달라지므로 필요한 범위와 제외 가능한 항목을 나누어 봐야 합니다.",
    risk:
      "복구 범위가 불명확하면 일정 지연이나 추가 비용으로 이어질 수 있어 공사 전에 기준을 맞춰야 합니다.",
    comparison:
      "철거만 필요한 항목과 복구까지 필요한 항목을 나누면 견적 비교가 더 명확해집니다.",
    process:
      "철거, 폐기, 마감 복구, 반납 확인 순서를 맞춰야 폐업 일정에 무리가 없습니다.",
  };

  return descriptions[profile.angle];
}

function buildRestoreCards(profile: ContentProfile): DetailCard[] {
  const cards: Record<AngleMode, DetailCard[]> = {
    experience: [
      {
        title: "마감 훼손 상태",
        description: "바닥, 벽체, 천장 마감 상태를 보고 복구가 필요한 수준을 확인합니다.",
      },
      {
        title: "설비 철거 흔적",
        description: "배관, 전기, 덕트, 고정물 제거 후 남는 흔적을 복구 범위에 포함할지 봅니다.",
      },
      {
        title: "반납 전 확인",
        description: "임대인 확인 전에 정리할 항목을 잡아 추가 요청 가능성을 줄입니다.",
      },
    ],
    expertise: [
      {
        title: "계약서상 복구 조건",
        description: "임대차 계약의 복구 조항과 요청 사항을 확인해 범위 오해를 줄입니다.",
      },
      {
        title: "현장 상태 확인",
        description: "기존 시설, 마감 상태, 사업장 구조를 함께 보고 정리해야 할 범위를 파악합니다.",
      },
      {
        title: "진행 전 조율",
        description: "폐업 일정과 현장 정리 순서가 어긋나지 않도록 공사 전 필요한 항목을 정리합니다.",
      },
    ],
    cost: [
      {
        title: "복구 비용 범위",
        description: "전체 복구와 부분 복구 중 어떤 방식이 필요한지 비용 기준으로 나누어 봅니다.",
      },
      {
        title: "마감재 변수",
        description: "바닥, 벽체, 천장 마감재 종류에 따라 달라질 수 있는 견적 변수를 확인합니다.",
      },
      {
        title: "불필요한 복구 제외",
        description: "계약 조건상 필요하지 않은 항목이 견적에 섞이지 않도록 범위를 조정합니다.",
      },
    ],
    risk: [
      {
        title: "임대인 요청 확인",
        description: "구두 요청과 계약서 조건이 다른 경우를 대비해 복구 기준을 먼저 맞춥니다.",
      },
      {
        title: "추가 청구 가능성",
        description: "철거 후 남는 마감 문제로 추가 비용이 생길 수 있는 부분을 확인합니다.",
      },
      {
        title: "일정 지연 요소",
        description: "복구 공정이 반납일을 넘기지 않도록 작업 순서와 확인 시점을 잡습니다.",
      },
    ],
    comparison: [
      {
        title: "철거만 필요한 항목",
        description: "집기 반출과 내부 철거만으로 정리되는 범위를 먼저 분리합니다.",
      },
      {
        title: "복구까지 필요한 항목",
        description: "철거 후 마감 보수나 설비 원복이 필요한 항목을 따로 봅니다.",
      },
      {
        title: "견적 비교 포인트",
        description: "폐기, 마감, 설비, 청소 포함 여부를 같은 기준으로 비교합니다.",
      },
    ],
    process: [
      {
        title: "복구 기준 확인",
        description: "계약서와 현장 요청을 기준으로 원상복구 수준을 먼저 확인합니다.",
      },
      {
        title: "철거 후 점검",
        description: "철거 뒤 남는 흔적과 마감 상태를 보고 복구 공정을 이어갑니다.",
      },
      {
        title: "반납 전 마무리",
        description: "임대인 확인 전 정리와 보완이 필요한 항목을 마지막으로 점검합니다.",
      },
    ],
  };

  return cards[profile.angle].map((card) => ({
    title: adaptTitle(card.title, profile),
    description: adaptSentence(card.description, profile),
  }));
}

function getConsultSectionTitle(profile: ContentProfile): string {
  const titles: Record<AngleMode, string> = {
    experience: "현장 경험 기준으로 먼저 볼 내용",
    expertise: "공사 전 실무 기준으로 정리할 내용",
    cost: "공사비 절감을 위해 확인할 내용",
    risk: "문제가 생기기 전에 점검할 내용",
    comparison: "견적 비교 전에 맞춰야 할 기준",
    process: "문의 후 진행 순서에 맞춰 볼 내용",
  };

  return titles[profile.angle];
}

function getConsultDescription(profile: ContentProfile): string {
  const descriptions: Record<AngleMode, string> = {
    experience:
      "현장 확인은 실제 공사에서 자주 생기는 변수와 반납 전 조율 항목을 먼저 정리하는 과정입니다.",
    expertise:
      "현장 확인은 현재 상황에서 공사 범위와 비용 변수를 기준에 맞춰 정리하는 과정입니다.",
    cost:
      "현장 확인은 견적을 확정하기 전에 공사비를 키우는 항목과 줄일 수 있는 항목을 나누는 과정입니다.",
    risk:
      "현장 확인은 일정 지연, 복구 분쟁, 지원 누락 가능성을 공사 전에 줄이는 과정입니다.",
    comparison:
      "현장 확인은 여러 견적을 같은 기준으로 비교할 수 있도록 포함 범위를 맞추는 과정입니다.",
    process:
      "현장 확인은 문의부터 공사 마무리까지 필요한 순서를 놓치지 않도록 정리하는 과정입니다.",
  };

  return descriptions[profile.angle];
}

function buildConsultItems(subjectGuide: string, profile: ContentProfile): string[] {
  const angleItems: Record<AngleMode, string[]> = {
    experience: [
      "기존 시설과 마감 상태",
      "임대인 요청과 반납 전 조율 항목",
      "현장 작업 동선과 공사 가능 시간",
      "철거 후 남을 수 있는 보완 항목",
    ],
    expertise: [
      "사업자 상태와 폐업 예정 흐름",
      "철거와 원상복구가 필요한 사업장 정리 범위",
      "임대차 조건에 따라 달라질 수 있는 확인 항목",
      "공사 진행 전에 준비하면 좋은 정보",
    ],
    cost: [
      "공사비에 영향을 주는 면적과 설비 상태",
      "점포철거비 지원 활용 가능 항목",
      "추가 비용이 생길 수 있는 작업 조건",
      "견적 전 분리해야 할 필수 공사와 선택 정리",
    ],
    risk: [
      "반납일과 공사 일정 충돌 가능성",
      "원상복구 범위가 모호한 항목",
      "지원 검토 전에 진행하면 불리한 순서",
      "임대인 확인 전 보완할 현장 상태",
    ],
    comparison: [
      "견적에 포함되는 철거와 폐기 범위",
      "복구 공사 포함 여부",
      "업체별 현장 확인 방식",
      "지원 활용을 고려한 비용 비교 기준",
    ],
    process: [
      "문의 시 남기면 좋은 기본 정보",
      "현장 확인에서 보는 공사 범위",
      "지원 검토와 견적 산정 순서",
      "공사 일정 조율과 반납 전 확인",
    ],
  };

  return [subjectGuide, ...angleItems[profile.angle]];
}

function getProcessStepTitle(profile: ContentProfile, index: number): string {
  const byManner: Record<MannerMode, string[]> = {
    consult: ["현장 문의", "사업장 확인", "범위 정리", "견적·일정 안내"],
    direct: ["정보 접수", "현장 조건 확인", "공사 범위 확정", "견적·일정 조율"],
    explain: ["기본 정보 확인", "현장 상태 설명", "철거·복구 범위 정리", "진행 순서 안내"],
    encourage: ["문의 남기기", "현장 함께 보기", "지원 활용 검토", "공사 일정 잡기"],
  };

  return byManner[profile.manner][index];
}

function getProcessStepDescription(profile: ContentProfile, index: number): string {
  const descriptions: Record<AngleMode, string[]> = {
    experience: [
      "",
      "",
      "기존 시설, 설비, 마감 상태를 기준으로 철거와 복구 범위를 나눕니다.",
      "현장에서 생길 수 있는 변수를 반영해 견적과 공사 일정을 조율합니다.",
    ],
    expertise: [
      "",
      "",
      "임대차 조건, 현장 상태, 사업장 정리 범위를 함께 확인합니다.",
      "확인된 내용을 바탕으로 공사비와 다음 진행 단계를 안내합니다.",
    ],
    cost: [
      "",
      "",
      "지원 활용 가능 항목과 비용이 커질 수 있는 공사 범위를 나눕니다.",
      "공사비 부담을 줄일 수 있는 방향으로 견적과 일정을 조율합니다.",
    ],
    risk: [
      "",
      "",
      "반납 지연, 복구 분쟁, 지원 누락 가능성이 있는 항목을 먼저 정리합니다.",
      "위험 요소를 줄이는 순서로 견적과 공사 일정을 맞춥니다.",
    ],
    comparison: [
      "",
      "",
      "견적 비교가 가능하도록 포함 공사와 제외 항목을 구분합니다.",
      "같은 기준으로 업체와 공사 범위를 비교할 수 있게 안내합니다.",
    ],
    process: [
      "",
      "",
      "문의 내용과 현장 확인 결과를 바탕으로 진행 순서를 정리합니다.",
      "폐업 일정에 맞춰 견적, 지원 검토, 공사 일정을 연결합니다.",
    ],
  };

  return descriptions[profile.angle][index];
}

function getFocusMode(page: PageRow): FocusMode {
  const source = `${page.메인키워드} ${page.콘텐츠관점}`;

  if (/원상복구|복구/.test(source)) {
    return "restoration";
  }

  if (/비용|견적|비용효율/.test(source)) {
    return "cost";
  }

  if (/지원금|지원/.test(source)) {
    return "support";
  }

  if (/철거|업체/.test(source)) {
    return "demolition";
  }

  if (/상담|준비|신뢰|경험|전문|권위/.test(source)) {
    return "consult";
  }

  return "support";
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

function getMannerMode(page: PageRow): MannerMode {
  const source = page.매너;

  if (/단계|객관|격식|체크리스트|체크|리스크/.test(source)) {
    return "direct";
  }

  if (/초보자안내|초보|비교설명|설명/.test(source)) {
    return "explain";
  }

  if (/현장조언|설득|권유|부드/.test(source)) {
    return "encourage";
  }

  if (/상담|대화/.test(source)) {
    return "consult";
  }

  return "consult";
}

function adaptSentence(sentence: string, profile: ContentProfile): string {
  if (profile.tone === "friendly" && profile.manner === "explain") {
    return sentence.replace("확인합니다.", "쉽게 확인합니다.");
  }

  if (profile.tone === "practical" || profile.manner === "direct") {
    return sentence.replace("좋습니다.", "필요합니다.");
  }

  if (profile.tone === "concise") {
    return sentence.replace("차례대로 ", "").replace("함께 ", "");
  }

  if (profile.tone === "careful") {
    return sentence.replace("확인합니다.", "신중하게 확인합니다.");
  }

  if (profile.manner === "encourage") {
    return sentence.replace("필요합니다.", "확인해 보세요.");
  }

  return sentence;
}

function fallbackKeyword(page: PageRow): string {
  const subject = page.page_type === "location" ? page.지역 : page.업종;
  return subject ? `${subject} 폐업 철거` : "폐업 철거";
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

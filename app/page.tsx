import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { HOME_FEATURED_LINKS } from "@/lib/internal-links";
import {
  HOME_DESCRIPTION,
  HOME_THUMBNAIL_ALT,
  HOME_TITLE,
  MAIN_KEYWORD,
  SEO_KEYWORDS,
  SITE_NAME,
  THUMBNAIL_IMAGE_HEIGHT,
  THUMBNAIL_IMAGE_WIDTH,
  buildHomeOgImagePath,
  buildHomeJsonLd,
  serializeJsonLd,
} from "@/lib/seo";

const consultationFormUrl =
  "https://docs.google.com/forms/d/e/1FAIpQLSfdzNitwdwclnvlcy6wj8D73z8kBuRSHsiyCp-L3XB9agx9bQ/viewform?usp=header";

export const metadata: Metadata = {
  title: {
    absolute: HOME_TITLE,
  },
  description: HOME_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    images: [
      {
        url: buildHomeOgImagePath(),
        width: THUMBNAIL_IMAGE_WIDTH,
        height: THUMBNAIL_IMAGE_HEIGHT,
        alt: HOME_THUMBNAIL_ALT,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    images: [
      {
        url: buildHomeOgImagePath(),
        alt: HOME_THUMBNAIL_ALT,
      },
    ],
  },
};

type CardItem = {
  title: string;
  description: string;
};

type StepItem = CardItem & {
  step: string;
};

type ServiceItem = CardItem & {
  href: string;
  label: string;
  imageSrc: string;
  imageAlt: string;
};

type FaqItem = {
  question: string;
  answer: string;
};

const heroChecks = [
  "소상공인 폐업지원금 대상 조건",
  "사업장 위치와 폐업 예정 시점",
  "점포철거비 지원 활용 가능성",
  "임대차 원상복구 범위",
];

const summaryCards: CardItem[] = [
  {
    title: "소상공인 폐업지원금 조건 확인",
    description:
      "사업자 상태, 폐업 시점, 지원사업 기준을 먼저 보고 신청 전 확인 항목을 정리합니다.",
  },
  {
    title: "점포철거비 지원 범위 검토",
    description:
      "매장 구조와 철거 범위를 기준으로 점포철거비 지원 활용 가능성을 함께 봅니다.",
  },
  {
    title: "철거·원상복구 공사 정리",
    description:
      "임대차 조건과 현장 상태를 기준으로 반납 전 필요한 복구 범위를 나눕니다.",
  },
];

const checkCards: CardItem[] = [
  {
    title: "소상공인 폐업지원금 대상 조건에 맞는지",
    description:
      "사업자 상태, 폐업 예정일, 사업장 운영 이력처럼 신청 전 확인해야 할 기본 조건을 살펴봅니다.",
  },
  {
    title: "점포철거비 지원을 활용할 수 있는지",
    description:
      "폐업 시점과 사업장 조건에 따라 철거 공사비 절감 가능 항목을 함께 검토합니다.",
  },
  {
    title: "원상복구 공사까지 함께 필요한지",
    description:
      "임대차 계약과 현장 상태를 기준으로 반납 전 복구 범위를 정리합니다.",
  },
  {
    title: "폐업 일정에 맞춰 공사를 진행할 수 있는지",
    description:
      "철거 일정, 현장 정리 순서, 지원 검토 시점을 함께 맞춰 봅니다.",
  },
];

const restorationCards: CardItem[] = [
  {
    title: "임대차 계약상 원상복구가 필요한 경우",
    description: "계약 조건과 현장 상태를 기준으로 필요한 복구 공사를 확인합니다.",
  },
  {
    title: "폐업 일정에 맞춰 사업장을 정리해야 하는 경우",
    description: "일정 지연을 줄이기 위해 철거와 반납 순서를 정리합니다.",
  },
  {
    title: "철거 견적과 지원 가능 여부를 함께 확인해야 하는 경우",
    description: "공사비와 지원 검토 항목을 함께 보며 비용 절감 방향을 잡습니다.",
  },
  {
    title: "매장 상태에 따라 원상복구 범위가 달라지는 경우",
    description: "현장 상태와 임대차 조건에 맞춰 필요한 공사 범위를 살펴봅니다.",
  },
];

const consultationChecks = [
  "소상공인 폐업지원금 신청 전 확인 항목",
  "폐업 철거와 원상복구 공사 범위",
  "점포철거비 지원 활용 가능성",
  "현장 상태에 따른 공사 일정과 비용 변수",
  "임대차 원상복구 조건에 따른 공사 범위",
];

const processSteps: StepItem[] = [
  {
    step: "01",
    title: "폐업지원금 상담 문의",
    description:
      "사업장 위치, 폐업 예정일, 매장 상태와 지원금 확인이 필요한 내용을 남겨 주세요.",
  },
  {
    step: "02",
    title: "지원 조건과 현장 확인",
    description:
      "소상공인 폐업지원금 검토에 필요한 조건과 철거·원상복구 범위를 함께 확인합니다.",
  },
  {
    step: "03",
    title: "점포철거비 활용 검토",
    description:
      "점포철거비 지원을 활용해 공사비 부담을 줄일 수 있는지 살펴봅니다.",
  },
  {
    step: "04",
    title: "철거·복구 진행",
    description: "확인된 범위에 맞춰 견적과 공사 일정을 조율합니다.",
  },
];

const serviceCardMedia = [
  {
    imageSrc: "/case-region.png",
    imageAlt: "상가 외관 사례 이미지",
  },
  {
    imageSrc: "/case-industry.png",
    imageAlt: "정리된 매장 내부 사례 이미지",
  },
  {
    imageSrc: "/case-restoration.png",
    imageAlt: "사무실 내부 원상복구 사례 이미지",
  },
  {
    imageSrc: "/case-lease.png",
    imageAlt: "상업 공간 내부 정리 사례 이미지",
  },
  {
    imageSrc: "/case-schedule.png",
    imageAlt: "정리된 빈 매장 내부 사례 이미지",
  },
  {
    imageSrc: "/case-scope.png",
    imageAlt: "건물 공용부와 현장 동선 사례 이미지",
  },
];

const serviceCards: ServiceItem[] = HOME_FEATURED_LINKS.map((link, index) => ({
  ...link,
  imageSrc: serviceCardMedia[index].imageSrc,
  imageAlt: serviceCardMedia[index].imageAlt,
}));

const faqs: FaqItem[] = [
  {
    question: "소상공인 폐업지원금은 누구나 받을 수 있나요?",
    answer:
      "모든 사업장이 동일하게 지원되는 것은 아닙니다. 사업자 상태, 폐업 시점, 지원사업 기준, 점포철거 조건 등에 따라 달라질 수 있으므로 공사 전 현재 상황을 먼저 확인하는 것이 좋습니다.",
  },
  {
    question: "소상공인 폐업지원금과 점포철거비 지원은 같은 건가요?",
    answer:
      "점포철거비 지원은 소상공인 폐업지원금에서 많이 확인하는 항목 중 하나입니다. 실제 활용 가능 여부는 지원사업 기준, 폐업 시점, 사업장 상태, 철거 범위에 따라 달라질 수 있습니다.",
  },
  {
    question: "점포철거비 지원은 폐업 전에 확인해야 하나요?",
    answer:
      "철거를 먼저 진행한 뒤에는 확인이 어려운 항목이 생길 수 있습니다. 폐업 일정, 사업장 상태, 임대차 조건을 기준으로 먼저 현장 범위를 확인하는 것이 좋습니다.",
  },
  {
    question: "폐업 전에 철거업체를 먼저 정해도 되나요?",
    answer:
      "사업장 상황에 따라 확인해야 할 조건이 있을 수 있습니다. 지원 가능 여부, 철거 범위, 원상복구 조건을 먼저 확인한 뒤 공사 방향을 정하는 것이 안전합니다.",
  },
  {
    question: "원상복구 공사도 함께 진행할 수 있나요?",
    answer:
      "네. 임대차 계약 조건과 현장 상태에 따라 원상복구 범위가 달라질 수 있으므로 폐업 철거와 함께 확인하는 것이 좋습니다.",
  },
  {
    question: "문의 후에는 어떻게 진행되나요?",
    answer:
      "문의 내용을 기준으로 사업장 위치, 폐업 준비 상태, 철거와 원상복구가 필요한 범위를 확인한 뒤 견적과 진행 방향을 안내합니다.",
  },
];

function InfoCard({ title, description }: CardItem) {
  return (
    <article className="info-card">
      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}

function ServiceCard({
  href,
  label,
  title,
  description,
  imageSrc,
  imageAlt,
}: ServiceItem) {
  return (
    <Link className="service-card" href={href}>
      <div className="service-card-image">
        <Image
          className="service-card-photo"
          src={imageSrc}
          alt={imageAlt}
          width={512}
          height={512}
          sizes="(max-width: 720px) calc(100vw - 32px), (max-width: 1040px) calc((100vw - 66px) / 2), 361px"
          loading="lazy"
        />
      </div>
      <div className="service-card-body">
        <span className="service-card-label">{label}</span>
        <strong>{title}</strong>
        <p>{description}</p>
        <span className="service-card-cta">공사 범위 보기</span>
      </div>
    </Link>
  );
}

export default function Home() {
  const jsonLd = buildHomeJsonLd({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    faq: faqs,
  });

  return (
    <main className="site-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(jsonLd),
        }}
      />
      <div className="top-band">
        <header className="site-header">
          <Link className="brand" href="/" aria-label={`${SITE_NAME} 홈`}>
            {SITE_NAME}
          </Link>
          <a
            className="button button-small"
            href={consultationFormUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            공사 문의
          </a>
        </header>

        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-content">
            <p className="eyebrow">{MAIN_KEYWORD} 핵심 확인</p>
            <h1 id="hero-title">
              소상공인 폐업지원금
              <br />
              점포철거비 지원
              <br />
              원상복구 확인
            </h1>
            <p className="hero-description">
              소상공인 폐업지원금은 폐업 시점, 사업장 상태, 지원사업 기준,
              철거 범위에 따라 확인할 내용이 달라집니다. 희망리턴패키지
              점포철거비 지원을 활용할 수 있는지 살펴보고, 매장 철거와
              원상복구 공사 범위까지 함께 정리해 공사비 부담을 줄이는 방향을
              잡습니다.
            </p>
            <div className="hero-actions">
              <a
                className="button"
                href={consultationFormUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                폐업지원금 문의하기
              </a>
            </div>
          </div>
          <aside className="hero-panel" aria-label="폐업지원금 확인 항목">
            <div className="hero-infographic" aria-hidden="true">
              <span>01</span>
              <i />
              <span>02</span>
              <i />
              <span>03</span>
            </div>
            <p className="panel-label">폐업지원금 확인 항목</p>
            <ul>
              {heroChecks.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <p className="panel-note">
              지원 가능 여부와 지원 범위는 사업장 상황과 최신 기준에 따라 달라질 수 있습니다.
            </p>
          </aside>
        </section>

        <section className="summary-grid" aria-label="소상공인 폐업지원금 핵심 요약">
          {summaryCards.map((card) => (
            <article className="summary-card" key={card.title}>
              <h2>{card.title}</h2>
              <p>{card.description}</p>
            </article>
          ))}
        </section>
      </div>

      <section className="section check-section" id="check-list">
        <div className="section-heading">
          <p className="eyebrow">확인 항목</p>
          <h2>소상공인 폐업지원금 신청 전 먼저 확인해야 할 항목</h2>
          <p>
            소상공인 폐업지원금 신청 가능성만 보고 철거를 따로 진행하면 일정,
            증빙, 원상복구 범위에서 문제가 생길 수 있습니다. 폐업 전에는 현장
            상태, 공사 범위, 임대차 원상복구 조건, 점포철거비 지원 활용
            가능성을 함께 확인하는 것이 필요합니다.
          </p>
        </div>
        <div className="card-grid">
          {checkCards.map((card) => (
            <InfoCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="section split-section" aria-labelledby="support-title">
        <div className="section-heading">
          <p className="eyebrow">지원 검토</p>
          <h2 id="support-title">소상공인 폐업지원금은 공사비 절감과 어떻게 연결될까요?</h2>
        </div>
        <div className="text-panel">
          <p>
            희망리턴패키지 등 소상공인 폐업지원금에서 많이 확인하는
            점포철거비 지원은 철거와 원상복구 공사비 부담을 줄이는 데 활용할
            수 있습니다. 다만 사업장 상태, 폐업 시점, 임대차 조건, 실제 공사
            범위에 따라 확인해야 할 내용이 달라집니다.
          </p>
          <p>
            따라서 철거를 먼저 진행하기보다 현장 확인을 통해 필요한 공사 범위를
            잡고, 소상공인 폐업지원금 활용 가능성을 함께 검토하는 것이
            좋습니다. 그래야 폐업 일정, 견적, 원상복구 범위를 맞춰 실제 공사
            진행 방향을 정할 수 있습니다.
          </p>
        </div>
      </section>

      <section className="section restoration-section" aria-labelledby="restoration-title">
        <div className="section-heading">
          <p className="eyebrow">사업장 정리</p>
          <h2 id="restoration-title">폐업지원금 검토와 함께 철거·원상복구가 필요한 경우</h2>
        </div>
        <div className="case-grid">
          {restorationCards.map((card) => (
            <article className="case-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section checklist-section" aria-labelledby="consulting-title">
        <div className="section-heading">
          <p className="eyebrow">공사 범위</p>
          <h2 id="consulting-title">현장 확인으로 정리할 수 있는 폐업지원금 관련 내용</h2>
        </div>
        <ul className="check-list">
          {consultationChecks.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section process-section" aria-labelledby="process-title">
        <div className="section-heading">
          <p className="eyebrow">진행 절차</p>
          <h2 id="process-title">문의 후 공사는 이렇게 진행됩니다</h2>
        </div>
        <div className="process-grid">
          {processSteps.map((item) => (
            <article className="process-card" key={item.step}>
              <span>{item.step}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section service-section" aria-labelledby="service-title">
        <div className="section-heading">
          <p className="eyebrow">지역·업종별 공사 항목</p>
          <h2 id="service-title">소상공인 폐업지원금과 연결되는 공사 항목을 확인해 보세요</h2>
          <p>
            지역별 점포철거, 업종별 현장 정리, 원상복구 공사, 점포철거비 지원
            활용처럼 실제 폐업 현장에서 이어지는 서비스를 모았습니다. 각
            항목에서 소상공인 폐업지원금 확인에 필요한 공사 범위와 비용 절감
            방향을 확인할 수 있습니다.
          </p>
        </div>
        <div className="service-grid">
          {serviceCards.map((card) => (
            <ServiceCard key={card.title} {...card} />
          ))}
        </div>
      </section>

      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title">자주 묻는 질문</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <article className="faq-item" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta" aria-labelledby="final-cta-title">
        <div>
          <p className="eyebrow">공사 문의</p>
          <h2 id="final-cta-title">
            소상공인 폐업지원금 신청 전, 공사 범위부터 확인하세요
          </h2>
          <p>
            폐업 철거와 원상복구 공사는 사업장 구조와 임대차 조건에 따라
            달라집니다. 현장 범위를 먼저 확인하고 소상공인 폐업지원금과
            점포철거비 지원 활용 가능성을 함께 검토해 공사비 부담을 줄이는
            방향으로 진행하세요.
          </p>
        </div>
        <a
          className="button button-light"
          href={consultationFormUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          폐업지원금 문의하기
        </a>
      </section>
    </main>
  );
}

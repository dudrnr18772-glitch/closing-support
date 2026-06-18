import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LongLandingImage } from "@/components/LongLandingImage";
import { SiteHeader } from "@/components/SiteHeader";
import { buildPageContent } from "@/lib/content";
import {
  buildInternalLinks,
  type InternalLink,
} from "@/lib/internal-links";
import {
  CONSULTATION_FORM_URL,
  buildCanonicalUrl,
  buildDetailMetadata,
  buildDetailOgImageUrl,
  buildJsonLd,
  serializeJsonLd,
} from "@/lib/seo";
import {
  getPageBySlug,
  getPublishedPages,
} from "@/lib/pages";
import type {
  DetailListSection,
  DetailProcessSection,
  DetailSection,
  PageContent,
} from "@/types/page";

type DetailPageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 300;

export async function generateStaticParams() {
  const pages = await getPublishedPages();

  return pages.map((page) => ({
    slug: page.slug,
  }));
}

export async function generateMetadata({
  params,
}: DetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    return {
      title: { absolute: "페이지를 찾을 수 없습니다 | 폐업철거 지원" },
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const content = buildPageContent(page);
  return buildDetailMetadata(page, content.metadata);
}

export default async function DetailPage({ params }: DetailPageProps) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  const content = buildPageContent(page);
  const allPages = await getPublishedPages();
  const internalLinks = buildInternalLinks(page, allPages);
  const canonicalUrl = buildCanonicalUrl(page.slug);
  const jsonLd = buildJsonLd({
    title: content.metadata.title,
    description: content.metadata.description,
    canonicalUrl,
    faq: content.faq,
    imageUrl: buildDetailOgImageUrl(page, content.metadata),
  });

  return (
    <div className="detail-page">
      <SiteHeader />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(jsonLd),
          }}
        />
        <section className="detail-hero" aria-labelledby="detail-title">
          <div className="detail-container detail-hero-grid">
            <div className="detail-hero-copy">
              <p className="detail-eyebrow">{content.label}</p>
              <h1 id="detail-title">{content.h1}</h1>
              <p className="detail-hero-description">
                {content.heroDescription}
              </p>
              <ul className="detail-hero-bullets" aria-label="핵심 확인 항목">
                {content.heroBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <div className="detail-actions">
                <ConsultationButton label="공사 문의하기" />
              </div>
            </div>

            <div className="detail-summary-panel" aria-label="공사 요약">
              {content.summaryCards.map((card) => (
                <article className="detail-summary-card" key={card.title}>
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <LongLandingImage alt={content.imageAlt} />

        <CardSection section={content.checkSection} />
        <CardSection section={content.supportSection} variant="soft" />
        <CardSection section={content.restoreSection} />
        <ListSection section={content.consultSection} />
        <ProcessSection section={content.processSection} />
        <InternalLinksSection links={internalLinks} />
        <FaqSection content={content} />
        <FinalCta content={content} />
      </main>
    </div>
  );
}

function CardSection({
  section,
  variant = "white",
}: {
  section: DetailSection;
  variant?: "white" | "soft";
}) {
  return (
    <section className={`detail-section detail-section-${variant}`}>
      <div className="detail-container">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />
        <div
          className={
            section.cards.length === 4
              ? "detail-card-grid detail-card-grid-balanced"
              : "detail-card-grid"
          }
        >
          {section.cards.map((card) => (
            <article className="detail-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ListSection({ section }: { section: DetailListSection }) {
  return (
    <section className="detail-section detail-section-soft">
      <div className="detail-container detail-split">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />
        <ul className="detail-check-list">
          {section.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ProcessSection({ section }: { section: DetailProcessSection }) {
  return (
    <section className="detail-section">
      <div className="detail-container">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
        />
        <div className="detail-process-grid">
          {section.steps.map((step) => (
            <article className="detail-process-card" key={step.step}>
              <span>{step.step}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function InternalLinksSection({ links }: { links: InternalLink[] }) {
  if (links.length === 0) {
    return null;
  }

  return (
    <section
      className="detail-section detail-section-soft"
      aria-labelledby="detail-internal-links-title"
    >
      <div className="detail-container">
        <SectionHeading
          eyebrow="관련 서비스"
          title="함께 확인하면 좋은 철거·복구 서비스"
          description="현재 페이지와 다른 지역, 업종, 공사 유형을 함께 볼 수 있도록 점포철거비 지원 활용, 철거업체 선택, 원상복구 공사 항목을 섞어 연결했습니다."
        />
        <div className="detail-internal-link-grid">
          {links.map((link) => (
            <Link
              className="detail-internal-link-card"
              href={link.href}
              key={link.slug}
            >
              <span>{link.label}</span>
              <strong>{link.title}</strong>
              <p>{link.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ content }: { content: PageContent }) {
  return (
    <section className="detail-section detail-section-soft">
      <div className="detail-container">
        <SectionHeading eyebrow="FAQ" title="자주 묻는 질문" />
        <div className="detail-faq-list">
          {content.faq.map((faq) => (
            <article className="detail-faq-item" key={faq.question}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalCta({ content }: { content: PageContent }) {
  return (
    <section className="detail-final-cta">
      <div className="detail-container detail-final-cta-inner">
        <div>
          <p className="detail-eyebrow detail-eyebrow-invert">공사 문의</p>
          <h2>{content.finalCta.title}</h2>
          <p>{content.finalCta.description}</p>
        </div>
        <ConsultationButton label={content.finalCta.buttonLabel} light />
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="detail-section-heading">
      <p className="detail-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

function ConsultationButton({
  label,
  light = false,
}: {
  label: string;
  light?: boolean;
}) {
  return (
    <a
      className={light ? "detail-button detail-button-light" : "detail-button"}
      href={CONSULTATION_FORM_URL}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label}
    </a>
  );
}

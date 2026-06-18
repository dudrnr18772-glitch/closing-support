export type PageType = "location" | "business";

export type PageRow = {
  slug: string;
  page_type: PageType;
  지역: string;
  업종: string;
  메인키워드: string;
  콘텐츠관점: string;
  톤: string;
  매너: string;
  status: string;
  created_at: string;
};

export type DetailCard = {
  title: string;
  description: string;
};

export type DetailStep = DetailCard & {
  step: string;
};

export type DetailFaq = {
  question: string;
  answer: string;
};

export type DetailSection = {
  eyebrow: string;
  title: string;
  description: string;
  cards: DetailCard[];
};

export type DetailListSection = {
  eyebrow: string;
  title: string;
  description: string;
  items: string[];
};

export type DetailProcessSection = {
  eyebrow: string;
  title: string;
  description: string;
  steps: DetailStep[];
};

export type DetailMetadata = {
  title: string;
  description: string;
};

export type PageContent = {
  label: string;
  h1: string;
  heroDescription: string;
  heroBullets: string[];
  summaryCards: DetailCard[];
  imageAlt: string;
  checkSection: DetailSection;
  supportSection: DetailSection;
  restoreSection: DetailSection;
  consultSection: DetailListSection;
  processSection: DetailProcessSection;
  faq: DetailFaq[];
  finalCta: {
    title: string;
    description: string;
    buttonLabel: string;
  };
  metadata: DetailMetadata;
};

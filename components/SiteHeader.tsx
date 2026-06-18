import Link from "next/link";
import { CONSULTATION_FORM_URL } from "@/lib/seo";

export function SiteHeader() {
  return (
    <header className="support-header">
      <div className="support-header-inner">
        <Link className="support-brand" href="/" aria-label="폐업철거 지원 홈">
          폐업철거 지원
        </Link>
        <a
          className="support-header-cta"
          href={CONSULTATION_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          공사 문의
        </a>
      </div>
    </header>
  );
}

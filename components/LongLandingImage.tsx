import Image from "next/image";

type LongLandingImageProps = {
  alt: string;
};

export function LongLandingImage({ alt }: LongLandingImageProps) {
  return (
    <section className="detail-image-section" aria-label="상담 안내 이미지">
      <div className="detail-container">
        <Image
          className="long-landing-image"
          src="/closing-support.webp"
          alt={alt}
          width={1080}
          height={7560}
          sizes="(max-width: 1168px) calc(100vw - 32px), 1120px"
        />
      </div>
    </section>
  );
}

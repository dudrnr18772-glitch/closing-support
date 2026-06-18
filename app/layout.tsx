import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import {
  HOME_DESCRIPTION,
  HOME_TITLE,
  SEO_KEYWORDS,
  SITE_URL,
  SITE_NAME,
  THUMBNAIL_IMAGE_ALT,
  THUMBNAIL_IMAGE_HEIGHT,
  THUMBNAIL_IMAGE_PATH,
  THUMBNAIL_IMAGE_WIDTH,
} from "@/lib/seo";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: HOME_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: HOME_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SEO_KEYWORDS,
  verification: {
    google: "838eo6Gckysvid4iFBUIV3zZJf-CuVtXBw9dNaj20JE",
    other: {
      "naver-site-verification": "7d2efde9e5b05b38fc28f2a103883bb465fb3f33",
      "msvalidate.01": "7CC2274F4DAA4C8A93EB5F4D8259E6A3",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    images: [
      {
        url: `${SITE_URL}${THUMBNAIL_IMAGE_PATH}`,
        width: THUMBNAIL_IMAGE_WIDTH,
        height: THUMBNAIL_IMAGE_HEIGHT,
        alt: THUMBNAIL_IMAGE_ALT,
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
        url: `${SITE_URL}${THUMBNAIL_IMAGE_PATH}`,
        alt: THUMBNAIL_IMAGE_ALT,
      },
    ],
  },
  other: {
    thumbnail: `${SITE_URL}${THUMBNAIL_IMAGE_PATH}`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { REPO_URL, SITE_URL, SITE_VERSION } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE_TITLE = "OWL-ORCA — AI Gateway with Stream Racing, Protocol Translation & Circuit Breakers";
const SITE_DESCRIPTION =
  "Self-hosted AI gateway that aggregates free-tier providers into a single OpenAI-compatible endpoint. Race multiple providers, first byte wins. Circuit Breaker Demos, Protocol Translation Visualization, proxy comparison.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  keywords: [
    "OWL-ORCA",
    "AI gateway",
    "stream racing",
    "circuit breakers",
    "protocol translation",
    "free AI",
    "OpenAI compatible",
    "proxy comparison",
  ],
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: "OWL-ORCA",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/architecture-schematic.png",
        width: 1200,
        height: 600,
        alt: "OWL-ORCA Architecture Schematic — clients through proxy and router to AI providers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/architecture-schematic.png"],
  },
};

/* JSON-LD structured data for search engines and social crawlers */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OWL-ORCA",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  codeRepository: REPO_URL,
  license: "https://opensource.org/licenses/MIT",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Linux (Ubuntu 22.04/24.04 LTS, systemd)",
  softwareVersion: SITE_VERSION,
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-background text-foreground">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}

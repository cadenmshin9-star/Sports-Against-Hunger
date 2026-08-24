import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const canonicalUrl = "https://www.sportsagainsthunger.org";
const organizationLogo = `${canonicalUrl}/sports-against-hunger-icon-512.png`;
const organizationStructuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${canonicalUrl}/#organization`,
    name: "Sports Against Hunger",
    alternateName: "Sports Against Hunger - VHS",
    url: canonicalUrl,
    logo: {
      "@type": "ImageObject",
      url: organizationLogo,
      contentUrl: organizationLogo,
      width: 512,
      height: 512,
    },
    email: "sportsagainsthunger@gmail.com",
    foundingDate: "2026",
    sameAs: ["https://www.instagram.com/sportsagainsthunger.vhs/"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${canonicalUrl}/#website`,
    url: canonicalUrl,
    name: "Sports Against Hunger",
    alternateName: "Sports Against Hunger - VHS",
    publisher: { "@id": `${canonicalUrl}/#organization` },
  },
];

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const siteUrl = `${protocol}://${host}`;
  const socialImage = `${protocol}://${host}/og.png`;

  return {
    title: "Sports Against Hunger | Game-Day Hunger Relief",
    description:
      "A student-led program connecting high school athletics, local business sponsors, and food partners to turn verified game-day achievements into support for local families.",
    keywords: [
      "Sports Against Hunger",
      "student-led community service",
      "game-day giving",
      "local hunger relief",
      "food pantry partnerships",
      "business sponsorships",
      "high school athletics",
      "local food systems",
      "Valencia High School",
    ],
    alternates: { canonical: siteUrl },
    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        {
          url: "/sports-against-hunger-icon-48.png",
          sizes: "48x48",
          type: "image/png",
        },
        {
          url: "/sports-against-hunger-icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/sports-against-hunger-icon-512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      shortcut: "/sports-against-hunger-icon-48.png",
      apple: [
        {
          url: "/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
    },
    appleWebApp: {
      capable: true,
      title: "Sports Against Hunger",
      statusBarStyle: "black-translucent",
    },
    robots: { index: true, follow: true },
    openGraph: {
      title: "Sports Against Hunger | Game-Day Hunger Relief",
      description:
        "High school athletics, local sponsors, and food partners moving together for local families.",
      type: "website",
      url: siteUrl,
      siteName: "Sports Against Hunger",
      images: [{ url: socialImage, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Sports Against Hunger | Game-Day Hunger Relief",
      description:
        "Every play can feed a family through verified, community-led support.",
      images: [socialImage],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationStructuredData).replace(
              /</g,
              "\\u003c",
            ),
          }}
          type="application/ld+json"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

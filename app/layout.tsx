import type { Metadata } from "next";
import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

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
      "A student-led pilot connecting high school athletics, local business sponsors, and food partners to turn verified game-day achievements into support for local families.",
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
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ServiceWorkerRegistrar from "@/components/ServiceWorkerRegistrar";
import BrowserNotificationListener from "@/components/BrowserNotificationListener";
import InviteAnnouncementGate from "@/components/InviteAnnouncementGate";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Prepper Community for Blackouts, Off-Grid Living, and Emergency Readiness`,
  description: siteConfig.description,
  metadataBase: new URL("https://www.blackout-network.com"),
  openGraph: {
    title: `${siteConfig.name} | Prepper Community for Blackouts, Off-Grid Living, and Emergency Readiness`,
    description: siteConfig.description,
    url: "https://www.blackout-network.com",
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "https://www.blackout-network.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "Blackout Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Prepper Community for Blackouts, Off-Grid Living, and Emergency Readiness`,
    description: siteConfig.description,
    images: ["https://www.blackout-network.com/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-background text-text antialiased">
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-FTZY69G833" strategy="afterInteractive" />
        <Script id="google-analytics" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-FTZY69G833');`}
        </Script>
        <ServiceWorkerRegistrar />
        <BrowserNotificationListener />
        <Nav />
        <InviteAnnouncementGate />
        {children}
        <Footer />
      </body>
    </html>
  );
}

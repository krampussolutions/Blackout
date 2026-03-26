import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} | Preparedness Community`,
  description: siteConfig.description,
  metadataBase: new URL("https://www.blackout-network.com"),
  openGraph: {
    title: `${siteConfig.name} | Preparedness Community`,
    description: siteConfig.description,
    url: "https://www.blackout-network.com",
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: "https://www.blackout-network.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Blackout Network",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Preparedness Community`,
    description: siteConfig.description,
    images: ["https://www.blackout-network.com/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-background text-text antialiased">
        <Nav />
        {children}
        <Footer />
      </body>
    </html>
  );
}
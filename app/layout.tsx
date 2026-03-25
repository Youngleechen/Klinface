import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// Import header and footer
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Klinface", // Your app name
  description: "Get your glow back", // Custom description
  openGraph: {
    title: "Klinface",
    description: "Get your glow back",
    url: "https://klinface.com",
    siteName: "Klinface",
    images: [
      {
        url: "/og-image.png", // Add your custom image to public folder
        width: 1200,
        height: 630,
        alt: "Klinface",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Klinface",
    description: "Get yout glow back",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Global Header */}
        <Header />

        {/* Page Content */}
        <main>
          {children}
        </main>

        {/* Global Footer */}
        <Footer />
      </body>
    </html>
  );
}
import type { Metadata } from "next";
import { Gabarito, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const gabarito = Gabarito({
  variable: "--font-gabarito",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Study by MR",
  description: "A minimalist study timer and analytics dashboard to help you stay focused and track your progress.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${gabarito.variable} ${geistMono.variable} h-full antialiased font-(family-name:--font-gabarito)`}
      suppressHydrationWarning
    >
      <body className="min-h-full scroll-smooth flex flex-col" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MaxWidthWrapper from "./components/maxWidthWrapper";
import Link from "next/link";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HC Brands Experimental AI",
  description: "HC Brands Experimental AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <header className="sticky top-0 z-50 bg-transparent backdrop-blur border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between max-w-6xl mx-auto px-4 py-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-start to-end bg-clip-text text-transparent">HC Brands</h1>
            <nav className="flex space-x-6">
              <Link href="/openAi" className="text-lg font-medium bg-gradient-to-r from-start to-end bg-clip-text text-transparent hover:underline">
                OpenAI
              </Link>
              <Link href="/gemini" className="text-lg font-medium bg-gradient-to-r from-start to-end bg-clip-text text-transparent hover:underline">
                Gemini
              </Link>
            </nav>
          </div>
        </header>
        <main>
          <MaxWidthWrapper>
            <Toaster />
            {children}
          </MaxWidthWrapper>
        </main>
      </body>
    </html>
  );
}

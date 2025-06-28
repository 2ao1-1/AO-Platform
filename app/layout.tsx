import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Art Gallery",
  description: "A collection of beautiful art pieces",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="max-w-7xl h-full flex flex-col font-geist-sans">
        <header className="flex justify-between items-center p-4">
          <Image src="/next.svg" width={80} height={80} alt="logo" />
          <nav>
            <ul className="flex justify-between items-center gap-4">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Link href="/profile">your profile</Link>
              </li>
              <li>
                <Link href="/feed">explore</Link>
              </li>
            </ul>
          </nav>
        </header>
        <main className="flex-1 relative bg-amber-500 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

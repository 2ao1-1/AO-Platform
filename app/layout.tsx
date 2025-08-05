import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en" suppressHydrationWarning={true}>
      {/* <head /> */}
      <body className="h-full flex flex-col min-h-screen bg-tertiary relative">
        {children}
      </body>
    </html>
  );
}

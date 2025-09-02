import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "X Finance - Financial Management Platform",
  description:
    "A comprehensive finance management platform for tracking income, expenses, and debt management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="min-h-screen bg-background font-sans antialiased"
        suppressHydrationWarning={true}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}

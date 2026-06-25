import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Daraj Search Demo — AI vs Normal",
  description: "Semantic search demo showing AI-powered vs exact match search",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
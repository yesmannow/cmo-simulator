import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMO Simulator - Marketing Strategy Game",
  description: "An advanced educational marketing strategy game built with Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

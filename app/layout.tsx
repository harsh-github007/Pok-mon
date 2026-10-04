import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PokéLedger · Your collection, in perspective",
  description: "Explore English and Japanese Pokémon cards, release years, USD prices, and your personal collection.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

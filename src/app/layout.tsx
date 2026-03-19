import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Background Remover",
  description: "Free automated image background removal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

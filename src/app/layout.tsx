import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/context/ModalContext";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Rydra - Super Admin & Web Platform",
  description: "Enterprise management and analytics dashboard for the Rydra platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} font-sans h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ModalProvider>{children}</ModalProvider>
      </body>
    </html>
  );
}

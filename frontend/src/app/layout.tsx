import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Devoxa | Enterprise AI Review",
  description: "Next-gen code analysis platform.",
};

import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import ScrollProgress from "@/components/ScrollProgress";
import { AuthProvider } from "@/context/AuthContext";
import PageTransition from "@/components/PageTransition";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased bg-black text-white min-h-screen`}>
        <SmoothScrollProvider>
          <AuthProvider>
            <ScrollProgress />
            <PageTransition>
              {children}
            </PageTransition>
          </AuthProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}

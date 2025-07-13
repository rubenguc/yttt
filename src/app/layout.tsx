import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Image from "next/image";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YT Transcription Tool",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-dvh`}
      >
        <header className="border-b-2 py-2 flex items-center mx-auto justify-center w-full">
          <Image src="/logo.png" alt="Logo" width={80} height={80} />
          <h1 className="text-center text-3xl">YT Transcription Tool</h1>
        </header>
        <main className="flex flex-col flex-1">{children}</main>
      </body>
      <footer className="border-t-2 py-2 flex items-center mx-auto justify-center w-full">
        <Image src="/logo.png" alt="Logo footer" width={60} height={60} />
        <span>{`2025, IA still don't detroy us :)`}</span>
      </footer>
    </html>
  );
}

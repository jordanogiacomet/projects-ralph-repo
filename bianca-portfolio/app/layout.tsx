import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://biancasato.com"),
  title: "Bianca Sato — UI/UX & Brand Designer",
  description:
    "Transforming ideas into stunning visuals — UI/UX and brand design that captivates, engages, and delivers results.",
  openGraph: {
    title: "Bianca Sato — UI/UX & Brand Designer",
    description:
      "Transforming ideas into stunning visuals — UI/UX and brand design that captivates, engages, and delivers results.",
    images: ["/images/og-image.jpg"],
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

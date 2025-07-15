import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: {
    default: "La'vie Pet - Banho Self-Service para Pets",
    template: "%s | La'vie Pet"
  },
  description: "Sistema de autoatendimento para banho de pets em containers. Agende seu horário, pague online e receba QR Code para acesso aos containers de banho self-service em Tambaú/SP.",
  keywords: [
    "pet",
    "banho",
    "self-service",
    "autoatendimento",
    "pets",
    "cães",
    "gatos",
    "Tambaú",
    "São Paulo",
    "container",
    "agendamento",
    "QR Code"
  ],
  authors: [{ name: "La'vie Pet" }],
  creator: "La'vie Pet",
  publisher: "La'vie Pet",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lavie-pet.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://lavie-pet.vercel.app',
    title: "La'vie Pet - Banho Self-Service para Pets",
    description: "Sistema de autoatendimento para banho de pets em containers. Agende online e tenha acesso via QR Code.",
    siteName: "La'vie Pet",
  },
  twitter: {
    card: 'summary_large_image',
    title: "La'vie Pet - Banho Self-Service para Pets",
    description: "Sistema de autoatendimento para banho de pets em containers. Agende online e tenha acesso via QR Code.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="32x32" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className={`${inter.variable} ${poppins.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

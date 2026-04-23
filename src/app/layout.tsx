import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { AIAssistant } from "@/components/common/ai-assistant";
import { ThemeProvider } from "@/components/common/theme-provider";
import { ServiceWorkerRegister } from "@/components/common/sw-register";
import { InstallPrompt } from "@/components/common/install-prompt";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: {
    default: "Marketplace · Bénin",
    template: "%s · Marketplace",
  },
  description:
    "Marketplace multi-vendeurs au Bénin : achetez et vendez produits, services et ebooks. Paiement MTN MoMo, Moov Money, Celtiis Cash.",
  keywords: [
    "marketplace bénin",
    "achat en ligne bénin",
    "cotonou",
    "mtn momo",
    "moov money",
    "celtiis cash",
    "ebook",
    "services",
  ],
  openGraph: {
    title: "Marketplace · Bénin",
    description:
      "Achetez et vendez facilement au Bénin. Produits, services, ebooks. Paiement mobile.",
    type: "website",
    locale: "fr_BJ",
  },
  applicationName: "Marketplace Bénin",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Marketplace",
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;if(t==='dark'||(!t&&m)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans pb-16 md:pb-0`}>
        <ThemeProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <MobileBottomNav />
          <AIAssistant />
          <InstallPrompt />
          <ServiceWorkerRegister />
          <Toaster position="top-center" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}

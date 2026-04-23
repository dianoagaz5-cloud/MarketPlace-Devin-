import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marketplace Bénin",
    short_name: "Marketplace",
    description:
      "Marketplace multi-vendeurs au Bénin : achetez et vendez produits, services et ebooks. Paiement MTN MoMo, Moov Money, Celtiis Cash.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    lang: "fr",
    categories: ["shopping", "business", "lifestyle"],
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Boutique",
        short_name: "Boutique",
        url: "/boutique",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Services",
        short_name: "Services",
        url: "/services",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Ebooks",
        short_name: "Ebooks",
        url: "/ebooks",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "Mon compte",
        short_name: "Compte",
        url: "/compte",
        icons: [{ src: "/icon-192.png", sizes: "192x192" }],
      },
    ],
  };
}

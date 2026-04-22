import type { Metadata } from "next";
import Link from "next/link";
import { Heart, ShieldCheck, Store, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "Marketplace multi-vendeurs au Bénin : notre mission, notre vision, comment ça marche.",
};

const values = [
  {
    icon: <ShieldCheck size={22} />,
    title: "Confiance",
    desc: "Vendeurs vérifiés, paiements sécurisés, transactions tracées.",
  },
  {
    icon: <Store size={22} />,
    title: "Entrepreneuriat local",
    desc: "Chaque boutique a sa place, du créateur indépendant à la PME.",
  },
  {
    icon: <Truck size={22} />,
    title: "Livraison Bénin",
    desc: "Cotonou, Abomey-Calavi, Porto-Novo, Parakou, et au national.",
  },
  {
    icon: <Heart size={22} />,
    title: "Made in Bénin",
    desc: "Une plateforme pensée pour les usages mobiles et les paiements locaux.",
  },
];

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-16 max-w-5xl">
      <div className="mb-10 text-center">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Notre histoire
        </span>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
          La marketplace du Bénin, <span className="gradient-text">pour tous</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
          Marketplace connecte acheteurs et vendeurs partout au Bénin : produits
          physiques, services et ebooks. Paiements MTN MoMo, Moov Money et Celtiis Cash.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-12">
        {values.map((v) => (
          <div
            key={v.title}
            className="rounded-xl border bg-card p-5 shadow-sm"
          >
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {v.icon}
            </div>
            <h3 className="font-semibold">{v.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
          </div>
        ))}
      </div>

      <section className="rounded-2xl border bg-card p-6 md:p-10 shadow-sm">
        <h2 className="text-xl md:text-2xl font-bold">Notre mission</h2>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Donner à chaque commerçant, artisan, freelance et créateur du Bénin un
          espace simple pour vendre en ligne, recevoir des paiements mobiles et
          livrer ses clients. Côté acheteur : trouver des produits et services
          locaux en quelques clics, payer en toute sécurité et suivre ses
          commandes.
        </p>

        <h2 className="mt-8 text-xl md:text-2xl font-bold">Comment ça marche</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted-foreground list-decimal pl-5">
          <li>Créez votre compte vendeur et personnalisez votre boutique.</li>
          <li>Publiez vos produits, services ou ebooks (validation admin).</li>
          <li>
            Recevez des commandes, discutez avec vos clients et encaissez en
            FCFA.
          </li>
          <li>
            Demandez un retrait dès que votre solde dépasse 15 000 FCFA.
          </li>
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/inscription">
            <Button>Créer un compte</Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline">Nous contacter</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

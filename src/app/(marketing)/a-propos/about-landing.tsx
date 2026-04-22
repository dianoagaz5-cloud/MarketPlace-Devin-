"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Check,
  CircleDollarSign,
  Headphones,
  MessageSquare,
  Package,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

const MARQUEE_ROWS = [
  ["VENDEZ.", "BOUTIQUE.", "CLIENTS.", "REVENUS.", "STOCK.", "MOMO.", "BÉNIN."],
  ["GRANDISSEZ.", "COTONOU.", "COMMANDES.", "LIVRAISON.", "MARKETPLACE.", "EBOOKS."],
  ["ENCAISSEZ.", "MOBILE MONEY.", "BOUTIQUE.", "BÉNIN.", "FCFA.", "SERVICES."],
  ["LANCEZ-VOUS.", "VENDEZ.", "GRANDISSEZ.", "CLIENTS.", "CROISSANCE.", "LOCAL."],
];

function Marquee({
  words,
  reverse = false,
  speed = 40,
}: {
  words: string[];
  reverse?: boolean;
  speed?: number;
}) {
  const content = Array.from({ length: 12 }).flatMap((_, i) =>
    words.map((w, j) => (
      <span key={`${i}-${j}`} className="mx-6 inline-block">
        {w}
      </span>
    )),
  );
  return (
    <div className="overflow-hidden whitespace-nowrap py-2 select-none">
      <div
        className="inline-flex animate-marquee text-5xl md:text-7xl font-black tracking-tight text-foreground/5 dark:text-foreground/10"
        style={{
          animationDirection: reverse ? "reverse" : "normal",
          animationDuration: `${speed}s`,
        }}
      >
        {content}
      </div>
    </div>
  );
}

function SectionHeading({
  kicker,
  title,
  subtitle,
}: {
  kicker?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="max-w-3xl">
      {kicker && (
        <span className="inline-block rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
          {kicker}
        </span>
      )}
      <h2 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight leading-[1.05]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FadeUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function DashboardMock() {
  return (
    <div className="rounded-2xl border bg-card shadow-xl overflow-hidden">
      <div className="flex items-center gap-1.5 border-b bg-muted/40 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <span className="ml-3 text-[10px] text-muted-foreground font-mono">
          marketplace-devin1.vercel.app/vendeur
        </span>
      </div>
      <div className="grid grid-cols-12 gap-0">
        <aside className="col-span-4 md:col-span-3 border-r bg-muted/20 p-3 space-y-1 text-xs">
          <div className="font-semibold text-foreground/80 mb-2">Boutique Awa</div>
          {["Tableau de bord", "Produits", "Commandes", "Messages", "Retraits", "Profil"].map(
            (l, i) => (
              <div
                key={l}
                className={`rounded-md px-2 py-1.5 ${
                  i === 0 ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground"
                }`}
              >
                {l}
              </div>
            ),
          )}
        </aside>
        <main className="col-span-8 md:col-span-9 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground">Bienvenue</div>
              <div className="text-sm font-semibold">Tableau de bord</div>
            </div>
            <span className="rounded-md bg-accent/10 px-2 py-1 text-[10px] font-medium text-accent">
              Vérifié
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { l: "Revenu (mois)", v: "193 641", u: "FCFA" },
              { l: "Commandes", v: "42", u: "cette semaine" },
              { l: "Produits actifs", v: "15", u: "en ligne" },
              { l: "Solde", v: "22 500", u: "disponible" },
            ].map((s) => (
              <div key={s.l} className="rounded-lg border bg-background p-2.5">
                <div className="text-[10px] text-muted-foreground">{s.l}</div>
                <div className="mt-0.5 text-sm font-bold text-primary">{s.v}</div>
                <div className="text-[10px] text-muted-foreground">{s.u}</div>
              </div>
            ))}
          </div>
          <div className="rounded-lg border bg-background p-3">
            <div className="flex items-end gap-1 h-14">
              {[30, 45, 28, 55, 70, 50, 80].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-gradient-to-t from-primary/60 to-primary"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
              {["lun", "mar", "mer", "jeu", "ven", "sam", "dim"].map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function PaymentMock() {
  return (
    <div className="rounded-2xl border bg-card shadow-xl p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">Finaliser la commande</div>
        <span className="text-[10px] font-mono text-muted-foreground">#MKT-2847</span>
      </div>
      <div className="rounded-lg border bg-background p-3">
        <div className="text-xs font-medium">Mode de paiement</div>
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[
            { k: "MTN MoMo", c: "bg-yellow-400/20 text-yellow-700 dark:text-yellow-400" },
            { k: "Moov", c: "bg-blue-400/20 text-blue-700 dark:text-blue-400" },
            { k: "Celtiis", c: "bg-red-400/20 text-red-700 dark:text-red-400" },
          ].map((m, i) => (
            <div
              key={m.k}
              className={`rounded-md px-2 py-2 text-[10px] font-semibold text-center ${
                i === 0
                  ? "border-2 border-primary " + m.c
                  : "border border-border text-muted-foreground"
              }`}
            >
              {m.k}
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-lg bg-muted/50 p-3 space-y-1 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Articles</span>
          <span>18 500 FCFA</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Livraison Cotonou</span>
          <span>1 500 FCFA</span>
        </div>
        <div className="flex justify-between border-t pt-1 font-semibold">
          <span>Total</span>
          <span className="text-primary">20 000 FCFA</span>
        </div>
      </div>
      <div className="rounded-lg bg-accent text-accent-foreground px-3 py-2.5 text-xs font-semibold text-center">
        Payer 20 000 FCFA avec MTN MoMo
      </div>
    </div>
  );
}

function OrderMock() {
  return (
    <div className="rounded-2xl border bg-card shadow-xl p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[10px] text-muted-foreground font-mono">#MKT-2847</div>
          <div className="text-sm font-semibold">3 articles · 20 000 FCFA</div>
        </div>
        <span className="rounded-full bg-green-500/15 text-green-600 dark:text-green-400 px-2 py-0.5 text-[10px] font-semibold">
          Payée
        </span>
      </div>
      <div className="space-y-1.5">
        {[
          { c: "Commandée", d: "Nouvelle commande reçue" },
          { c: "Payée", d: "MTN MoMo confirmé" },
          { c: "En préparation", d: "Vendeur a confirmé" },
          { c: "Expédiée", d: "Livreur en route" },
        ].map((s, i) => (
          <div key={s.c} className="flex items-start gap-2">
            <div
              className={`mt-0.5 h-4 w-4 shrink-0 rounded-full grid place-items-center ${
                i < 3 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {i < 3 ? <Check size={10} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium">{s.c}</div>
              <div className="text-[10px] text-muted-foreground">{s.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AboutLanding() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  return (
    <div className="relative overflow-hidden">
      {/* Marquee bands background layer */}
      <div className="absolute inset-x-0 top-0 z-0 pointer-events-none">
        <Marquee words={MARQUEE_ROWS[0]} speed={60} />
        <Marquee words={MARQUEE_ROWS[1]} reverse speed={70} />
        <Marquee words={MARQUEE_ROWS[2]} speed={55} />
        <Marquee words={MARQUEE_ROWS[3]} reverse speed={65} />
      </div>

      {/* HERO */}
      <motion.section
        ref={heroRef}
        style={{ scale: heroScale, opacity: heroOpacity }}
        className="relative z-10 container pt-16 md:pt-24 pb-12 md:pb-16"
      >
        <FadeUp>
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Sparkles size={12} /> Disponible maintenant — Achetez et vendez au Bénin
          </span>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h1 className="mt-5 text-5xl md:text-7xl font-bold tracking-tight leading-[0.95]">
            Créez votre boutique.
            <br />
            <span className="gradient-text">On s&apos;occupe du reste.</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.2}>
          <p className="mt-5 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed">
            Marketplace connecte acheteurs et vendeurs partout au Bénin — produits,
            services et ebooks. Paiements MTN MoMo, Moov Money et Celtiis Cash. Une
            seule plateforme, pour tout le commerce local.
          </p>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/inscription">
              <Button size="lg" className="gap-2">
                Créer ma boutique <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/boutique">
              <Button size="lg" variant="outline">
                Explorer la marketplace
              </Button>
            </Link>
          </div>
        </FadeUp>
        <FadeUp delay={0.4}>
          <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
            {[
              { v: "100%", l: "Local Bénin" },
              { v: "3", l: "Opérateurs mobile" },
              { v: "8%", l: "Commission" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-2xl md:text-3xl font-bold gradient-text">{s.v}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </FadeUp>

        {/* Floating dashboard preview */}
        <FadeUp delay={0.5} className="mt-12 md:mt-16">
          <motion.div
            initial={{ y: 40 }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-4xl mx-auto"
          >
            <DashboardMock />
          </motion.div>
        </FadeUp>
      </motion.section>

      {/* Alternating feature sections */}
      <div className="relative z-10 bg-background/80 backdrop-blur">
        {/* Dashboard section (reprise) */}
        <section className="container py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <FadeUp>
            <SectionHeading
              kicker="Tableau de bord vendeur"
              title={
                <>
                  Tout pour gérer
                  <br />
                  <span className="gradient-text">votre commerce.</span>
                </>
              }
              subtitle="Un seul endroit pour voir vos commandes, vos revenus et vos clients. Fini de jongler entre WhatsApp, un cahier et votre téléphone."
            />
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Vos stats en temps réel : revenus, commandes, produits actifs",
                "Graphiques simples pour voir vos meilleurs jours",
                "Un coup d'œil pour savoir où vous en êtes",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shrink-0">
                    <Check size={12} />
                  </span>
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={0.15}>
            <DashboardMock />
          </FadeUp>
        </section>

        {/* Payments section */}
        <section className="container py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <FadeUp className="md:order-2">
            <SectionHeading
              kicker="Paiements"
              title={
                <>
                  Encaissez comme
                  <br />
                  <span className="gradient-text">vos clients paient.</span>
                </>
              }
              subtitle="Vos clients paient avec leur téléphone — MTN, Moov, Celtiis. Pas de carte bancaire, pas de friction. L'argent arrive sur votre solde dès confirmation."
            />
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "3 opérateurs mobile money pris en charge dès le départ",
                "Pas besoin de carte bancaire côté client",
                "Votre solde crédité automatiquement après chaque vente",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shrink-0">
                    <Check size={12} />
                  </span>
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={0.15} className="md:order-1">
            <PaymentMock />
          </FadeUp>
        </section>

        {/* Orders section */}
        <section className="container py-20 md:py-28 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <FadeUp>
            <SectionHeading
              kicker="Commandes"
              title={
                <>
                  Chaque commande,
                  <br />
                  <span className="gradient-text">suivie de A à Z.</span>
                </>
              }
              subtitle="Finies les commandes perdues dans WhatsApp. Chaque vente a sa fiche : qui a commandé, ce qu'il a pris, où ça en est. Votre client est informé à chaque étape."
            />
            <ul className="mt-6 space-y-3 text-sm">
              {[
                "Statut clair pour vous et pour le client : payée, préparée, expédiée",
                "L'historique complet de vos ventes en quelques secondes",
                "Chat intégré pour répondre aux questions sans changer d'app",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white shrink-0">
                    <Check size={12} />
                  </span>
                  <span className="text-muted-foreground">{t}</span>
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp delay={0.15}>
            <OrderMock />
          </FadeUp>
        </section>
      </div>

      {/* Feature grid */}
      <section className="relative z-10 bg-muted/30 border-y py-20 md:py-28">
        <div className="container">
          <FadeUp>
            <SectionHeading
              kicker="Fonctionnalités"
              title={
                <>
                  Tout ce dont vous avez besoin.
                  <br />
                  <span className="gradient-text">Rien de superflu.</span>
                </>
              }
            />
          </FadeUp>
          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <Store size={20} />,
                title: "Votre boutique, votre marque",
                desc: "Un profil vendeur dédié avec logo, bannière et vos produits. Les acheteurs voient votre identité.",
              },
              {
                icon: <Package size={20} />,
                title: "Produits, services, ebooks",
                desc: "Vendez du physique, des prestations ou des fichiers — stock et livraison gérés automatiquement.",
              },
              {
                icon: <Smartphone size={20} />,
                title: "Paiements mobiles",
                desc: "MTN MoMo, Moov Money, Celtiis Cash. Les acheteurs paient en 3 clics depuis leur téléphone.",
              },
              {
                icon: <Truck size={20} />,
                title: "Livraison Bénin",
                desc: "Cotonou, Abomey-Calavi, Porto-Novo, Parakou et autres villes du Bénin. Tarifs affichés avant paiement.",
              },
              {
                icon: <MessageSquare size={20} />,
                title: "Chat intégré",
                desc: "Répondez à vos clients sans quitter la plateforme. Toutes les conversations en un endroit.",
              },
              {
                icon: <BadgeCheck size={20} />,
                title: "Avis vérifiés",
                desc: "Seuls les acheteurs qui ont reçu leur commande peuvent noter. Zéro faux avis.",
              },
              {
                icon: <CircleDollarSign size={20} />,
                title: "Retraits Mobile Money",
                desc: "Demandez un retrait dès que votre solde dépasse 15 000 FCFA. Directement sur votre numéro.",
              },
              {
                icon: <BookOpen size={20} />,
                title: "Ebooks sécurisés",
                desc: "Liens de téléchargement uniques, expiration 7 jours, limite d'essais anti-piratage.",
              },
              {
                icon: <Users size={20} />,
                title: "Vendeur ET acheteur",
                desc: "Un seul compte, les deux rôles. Achetez sur d'autres boutiques pendant que la vôtre tourne.",
              },
            ].map((f, i) => (
              <FadeUp key={f.title} delay={i * 0.05}>
                <div className="group rounded-2xl border bg-card p-6 h-full hover:border-primary/50 transition-colors">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Security / trust section */}
      <section className="relative z-10 container py-20 md:py-28">
        <FadeUp>
          <SectionHeading
            kicker="Confiance"
            title={
              <>
                Votre commerce,
                <br />
                <span className="gradient-text">en sécurité.</span>
              </>
            }
            subtitle="Marketplace est conçue pour que vous puissiez vous concentrer sur votre business — pas sur la logistique ou les problèmes de paiement."
          />
        </FadeUp>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {[
            {
              icon: <ShieldCheck size={22} />,
              title: "Vos paiements sont protégés",
              desc: "Chaque transaction est tracée. Les vendeurs sont vérifiés par notre équipe avant d'apparaître sur la marketplace.",
            },
            {
              icon: <Package size={22} />,
              title: "Stocks à jour en temps réel",
              desc: "Dès qu'une commande est validée, votre stock est ajusté. Plus de survente ni de commandes impossibles.",
            },
            {
              icon: <Briefcase size={22} />,
              title: "Pensé pour le Bénin",
              desc: "Les opérateurs, les villes, les prix de livraison, les habitudes d'achat — tout est calibré pour Cotonou et le Bénin.",
            },
            {
              icon: <CircleDollarSign size={22} />,
              title: "Votre argent vous appartient",
              desc: "Votre solde est crédité après chaque vente confirmée. Retrait Mobile Money quand vous le souhaitez.",
            },
          ].map((t, i) => (
            <FadeUp key={t.title} delay={i * 0.08}>
              <div className="flex gap-4 rounded-2xl border bg-card p-6">
                <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  {t.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{t.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="relative z-10 border-t bg-muted/20 py-20 md:py-28">
        <div className="container max-w-3xl">
          <FadeUp>
            <SectionHeading kicker="FAQ" title="Questions fréquentes." />
          </FadeUp>
          <div className="mt-10 space-y-3">
            {[
              {
                q: "Quels modes de paiement sont acceptés ?",
                a: "MTN MoMo, Moov Money et Celtiis Cash. Les trois principaux opérateurs mobile money du Bénin sont intégrés dès le départ.",
              },
              {
                q: "Comment je reçois mes gains ?",
                a: "Votre solde est crédité après chaque vente confirmée (commission de 8% prélevée). Vous pouvez demander un retrait dès 15 000 FCFA, directement sur votre numéro Mobile Money.",
              },
              {
                q: "Quelle commission Marketplace prélève-t-elle ?",
                a: "8% sur chaque vente. Pas de frais d'inscription, pas d'abonnement, pas de frais cachés — vous ne payez que quand vous vendez.",
              },
              {
                q: "Combien de temps pour ouvrir ma boutique ?",
                a: "Inscription en 2 minutes, puis validation par notre équipe sous 24h. Une fois approuvée, vous pouvez mettre vos produits en ligne immédiatement.",
              },
              {
                q: "Puis-je vendre des services ou des ebooks ?",
                a: "Oui. Marketplace gère trois types d'articles : produits physiques (avec stock et livraison), services (prestations), et ebooks (téléchargement sécurisé).",
              },
            ].map((item, i) => (
              <FadeUp key={item.q} delay={i * 0.04}>
                <details className="group rounded-xl border bg-card p-4 open:shadow-sm">
                  <summary className="flex cursor-pointer items-center justify-between font-medium text-sm">
                    {item.q}
                    <span className="ml-4 inline-flex h-6 w-6 items-center justify-center rounded-full bg-muted group-open:bg-primary group-open:text-white transition-colors">
                      <ArrowRight
                        size={12}
                        className="transition-transform group-open:rotate-90"
                      />
                    </span>
                  </summary>
                  <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </details>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 container py-24 md:py-32 text-center">
        <FadeUp>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
            Prêt à lancer
            <br />
            <span className="gradient-text">votre boutique ?</span>
          </h2>
          <p className="mt-5 mx-auto max-w-xl text-muted-foreground">
            Créez votre compte gratuitement et commencez à vendre dès aujourd&apos;hui.
            Des milliers d&apos;acheteurs au Bénin vous attendent.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/inscription">
              <Button size="lg" className="gap-2">
                Créer ma boutique <ArrowRight size={16} />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="gap-2">
                <Headphones size={16} /> Nous contacter
              </Button>
            </Link>
          </div>
        </FadeUp>
      </section>
    </div>
  );
}

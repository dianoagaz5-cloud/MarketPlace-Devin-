"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ArrowUpRight, ShoppingBag, BookOpen, Wrench } from "lucide-react";

const ease = [0.32, 0.72, 0, 1] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="hero-ambient absolute inset-0 -z-10" aria-hidden />
      <div
        className="absolute inset-x-0 top-0 -z-10 h-[1px] bg-gradient-to-r from-transparent via-border to-transparent"
        aria-hidden
      />

      <div className="container relative grid gap-12 py-14 md:grid-cols-12 md:py-20 lg:py-28">
        <div className="md:col-span-7 flex flex-col justify-center">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="eyebrow w-fit"
          >
            <span className="size-1.5 rounded-full bg-primary" />
            Marketplace n°1 au Bénin
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.05 }}
            className="font-display mt-5 text-[2.5rem] leading-[1.02] tracking-tightest font-extrabold sm:text-6xl md:text-7xl"
          >
            Tout ce dont
            <br />
            vous avez besoin,
            <br />
            <span className="text-primary">en un clic.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.12 }}
            className="mt-6 max-w-[55ch] text-base text-muted-foreground md:text-lg"
          >
            Produits, services et ebooks de vendeurs vérifiés. Paiement MTN MoMo,
            Moov Money, Celtiis Cash. Livraison Cotonou, Calavi, Porto-Novo et
            partout au Bénin.
          </motion.p>

          <motion.form
            action="/boutique"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.18 }}
            className="mt-8 max-w-xl rounded-2xl border bg-card/80 p-1.5 shadow-soft backdrop-blur"
          >
            <div className="relative flex items-center">
              <Search
                size={18}
                className="pointer-events-none absolute left-4 text-muted-foreground"
              />
              <input
                name="q"
                type="search"
                placeholder="Rechercher un produit, service, ebook…"
                className="h-12 w-full rounded-xl bg-transparent pl-11 pr-3 text-sm outline-none placeholder:text-muted-foreground/70"
              />
              <button
                type="submit"
                className="press group inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-foreground pl-4 pr-2 text-sm font-medium text-background transition hover:opacity-90"
              >
                Rechercher
                <span className="grid size-7 place-items-center rounded-lg bg-background/15 transition-all duration-500 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={14} />
                </span>
              </button>
            </div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.24 }}
            className="mt-5 flex flex-wrap items-center gap-2 text-xs"
          >
            <span className="text-muted-foreground">Populaire :</span>
            {[
              { label: "Mode Wax", href: "/boutique" },
              { label: "Smartphones", href: "/boutique" },
              { label: "Dév web", href: "/services" },
              { label: "Ebooks business", href: "/ebooks" },
              { label: "Beauté", href: "/boutique" },
            ].map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="press rounded-full border bg-card px-3 py-1.5 transition hover:border-primary/50 hover:text-primary"
              >
                {c.label}
              </Link>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.32 }}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <Link
              href="/inscription?role=VENDEUR"
              className="press group inline-flex items-center gap-2 rounded-full bg-primary pl-5 pr-2 py-2 text-sm font-medium text-primary-foreground shadow-soft transition hover:bg-primary/90"
            >
              Commencer à vendre
              <span className="grid size-7 place-items-center rounded-full bg-primary-foreground/15 transition-all duration-500 ease-smooth group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowUpRight size={14} />
              </span>
            </Link>
            <Link
              href="/boutique"
              className="press inline-flex items-center gap-2 rounded-full border bg-card px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              Explorer la boutique
            </Link>
          </motion.div>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-muted-foreground">
            <span className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={i}
                  src={`https://picsum.photos/seed/av-${i}/80/80`}
                  alt=""
                  className="size-7 rounded-full border-2 border-card object-cover"
                />
              ))}
            </span>
            <span>
              <span className="tabular font-semibold text-foreground">
                +5 000
              </span>{" "}
              acheteurs satisfaits
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Vendeurs actifs aujourd&rsquo;hui
            </span>
          </div>
        </div>

        <div className="md:col-span-5 relative hidden md:block">
          <FloatingArtboard />
        </div>
      </div>
    </section>
  );
}

function FloatingArtboard() {
  const items: Array<{
    img: string;
    title: string;
    price: string;
    eyebrow: string;
    icon: React.ReactNode;
    pos: string;
    rot: string;
    delay: number;
  }> = [
    {
      img: "https://picsum.photos/seed/hero-a/600/600",
      title: "Robe Wax moderne",
      price: "18 500",
      eyebrow: "Mode",
      icon: <ShoppingBag size={12} />,
      pos: "top-0 left-0 w-56",
      rot: "-rotate-2",
      delay: 0,
    },
    {
      img: "https://picsum.photos/seed/hero-b/600/600",
      title: "Smartphone Pro 128 Go",
      price: "135 000",
      eyebrow: "Électronique",
      icon: <ShoppingBag size={12} />,
      pos: "top-20 right-0 w-60",
      rot: "rotate-2",
      delay: 0.12,
    },
    {
      img: "https://picsum.photos/seed/hero-c/600/600",
      title: "Lancer son business",
      price: "5 000",
      eyebrow: "Ebook",
      icon: <BookOpen size={12} />,
      pos: "bottom-12 left-4 w-56",
      rot: "rotate-1",
      delay: 0.22,
    },
    {
      img: "https://picsum.photos/seed/hero-d/600/600",
      title: "Création site web pro",
      price: "250 000",
      eyebrow: "Service",
      icon: <Wrench size={12} />,
      pos: "bottom-0 right-6 w-60",
      rot: "-rotate-1",
      delay: 0.32,
    },
  ];

  return (
    <div className="relative h-[520px] w-full">
      {items.map((it, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease, delay: it.delay }}
          className={`absolute ${it.pos} ${it.rot}`}
        >
          {/* Doppelrand: outer shell + inner core */}
          <div className="rounded-[1.4rem] border bg-card/60 p-1.5 shadow-lift backdrop-blur">
            <div className="overflow-hidden rounded-[calc(1.4rem-0.375rem)] bg-card">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={it.img} alt="" className="h-32 w-full object-cover" />
              <div className="p-3">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-medium text-primary">
                    {it.icon} {it.eyebrow}
                  </span>
                </div>
                <div className="mt-1.5 line-clamp-1 text-sm font-semibold">
                  {it.title}
                </div>
                <div className="mt-1 text-sm font-semibold tabular text-foreground">
                  {it.price}{" "}
                  <span className="text-xs font-normal text-muted-foreground">
                    FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

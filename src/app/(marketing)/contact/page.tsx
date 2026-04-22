import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Marketplace Bénin : support, partenariats, presse.",
};

export default function ContactPage() {
  return (
    <div className="container py-12 md:py-16 max-w-5xl">
      <div className="mb-10 text-center">
        <span className="inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          Nous contacter
        </span>
        <h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight">
          On est là pour vous
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
          Une question sur une commande, un partenariat, ou un retour ? Notre équipe
          répond du lundi au samedi.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-5">
        <div className="md:col-span-2 space-y-3">
          <InfoCard
            icon={<Phone size={18} />}
            title="Téléphone"
            value="+229 97 00 00 00"
            note="Lun–Sam, 8h–19h"
          />
          <InfoCard
            icon={<Mail size={18} />}
            title="Email"
            value="support@marketplace.bj"
            note="Réponse sous 24h"
          />
          <InfoCard
            icon={<MessageCircle size={18} />}
            title="WhatsApp"
            value="+229 97 00 00 00"
            note="Messages & audio"
          />
          <InfoCard
            icon={<MapPin size={18} />}
            title="Adresse"
            value="Cotonou, Bénin"
            note="Cadjèhoun"
          />
        </div>

        <div className="md:col-span-3 rounded-2xl border bg-card p-6 md:p-8 shadow-sm">
          <h2 className="text-lg font-semibold">Envoyez-nous un message</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            On vous répond à l&apos;adresse fournie.
          </p>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  value,
  note,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  note?: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
          {icon}
        </div>
        <div>
          <div className="text-xs font-semibold uppercase text-muted-foreground">
            {title}
          </div>
          <div className="text-sm font-medium">{value}</div>
          {note && <div className="text-xs text-muted-foreground">{note}</div>}
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SYSTEM_PROMPT = `Tu es l'assistant IA officiel de **Marketplace Bénin**, une marketplace multi-vendeurs basée au Bénin. Tu réponds en français, de manière claire, concise et professionnelle (tutoiement amical). Tu utilises le FCFA (XOF) pour les prix. Tu n'inventes rien : si une info n'est pas dans la base de connaissance ci-dessous, dis-le et propose de contacter le support via /contact.

# À propos de la plateforme
Marketplace Bénin permet aux Béninois d'acheter et vendre des **produits physiques**, des **services** et des **ebooks PDF**. Elle regroupe plusieurs vendeurs vérifiés sous une seule plateforme, avec paiement Mobile Money local, livraison nationale et téléchargement sécurisé d'ebooks.

# Pour les acheteurs
- **Parcours d'achat** : /boutique (produits), /services, /ebooks. Clique un article → "Ajouter au panier" → /panier → "Passer au paiement".
- **Comptes** : inscription en 1 min (/inscription). Possible aussi en invité (checkout sans compte) — on demande juste un email pour l'ebook et le suivi.
- **Paiements** : MTN Mobile Money, Moov Money, Celtiis Cash. Tu saisis ton numéro, tu valides sur ton téléphone, la commande est payée instantanément.
- **Livraison** : Cotonou, Abomey-Calavi, Porto-Novo, Ouidah, Parakou et "Autre (national)". Tarifs variables selon la ville. Délai 24-72h.
- **Ebooks** : après paiement, un lien de téléchargement sécurisé est envoyé par email et disponible dans "Mon compte" (compte/téléchargements). Lien valide 7 jours, max 3 téléchargements.
- **Suivi commande** : /commande/[id] montre le statut (Payée → Préparée → Expédiée → Livrée).
- **Favoris** : clic sur le cœur sur un article → visible dans /compte/favoris (stocké sur ton navigateur).
- **Chat vendeur** : bouton "Discuter avec le vendeur" sur chaque fiche (nécessite d'être connecté).
- **Avis** : tu peux noter un vendeur après avoir reçu ta commande.

# Pour les vendeurs
- **Inscription vendeur** : /vendeur-inscription. Choisis "Je veux vendre", renseigne le nom et la description de ta boutique. Validation manuelle par l'admin sous 24h.
- **Dashboard** : /vendeur — résumé des ventes, solde, commandes, messages.
- **Créer une annonce** : /vendeur/produits/nouveau (ou /services, /ebooks). Upload direct de photos (JPG/PNG/WebP jusqu'à 8 Mo) et vidéos (MP4/WebM jusqu'à 30 Mo) — glisser-déposer ou clic. Jusqu'à 6 fichiers par annonce. Pour les ebooks : upload direct de la couverture + PDF.
- **Validation** : chaque annonce créée passe en PENDING et doit être validée par l'admin avant d'être visible.
- **Commission** : 8 % par vente, déduite automatiquement. Le vendeur reçoit 92 % sur son solde.
- **Retraits** : minimum 15 000 FCFA. Demande depuis /vendeur/retraits → validation admin sous 24h → virement MoMo.
- **Coupons** : chaque vendeur peut créer ses propres codes promo (/vendeur/coupons).

# Sécurité et confiance
- Vendeurs validés manuellement avant d'être autorisés à publier.
- Tous les produits passent par une modération admin.
- Ne paie jamais en direct au vendeur — uniquement via la plateforme.
- Pour tout problème : /contact, ou chat avec le vendeur pour garder une trace.

# Comptes de démo (MVP)
- Admin : admin@marketplace.bj / admin1234
- Client : client@demo.bj / password
- Vendeur : awa@boutique.bj / password

# Style
- Réponses courtes et concrètes (3-8 lignes idéalement). Utilise des listes à puces quand c'est une procédure.
- Indique les chemins d'URL pertinents (ex: "va sur /panier") pour aider la navigation.
- Jamais d'info médicale, juridique ou financière hors du périmètre de la marketplace.
- Si la question est hors sujet (météo, politique, etc.) : redirige gentiment vers le périmètre de la plateforme.`;

type Rule = { match: RegExp; reply: string };

const FALLBACK_RULES: Rule[] = [
  {
    match: /(à quoi sert|c'?est quoi|présente|explique.*plateforme|what is|what does|about)/i,
    reply: `Marketplace Bénin est une plateforme qui regroupe plusieurs vendeurs béninois en un seul endroit. Tu peux y :
• Acheter des **produits** physiques (mode, tech, maison…)
• Commander des **services** locaux
• Télécharger des **ebooks** PDF
Paiement en Mobile Money (MTN, Moov, Celtiis), livraison nationale, vendeurs vérifiés. N'importe qui peut devenir vendeur via /vendeur-inscription.`,
  },
  {
    match: /(acheter|comment\s+ach|je\s+veux\s+acheter)/i,
    reply: `Pour acheter :
1. Parcours /boutique, /services ou /ebooks
2. Clique un article → "Ajouter au panier"
3. Va sur /panier → "Passer au paiement"
4. Choisis MTN MoMo, Moov Money ou Celtiis Cash et valide
Tu recevras une confirmation immédiate et, pour un ebook, un lien de téléchargement.`,
  },
  {
    match: /(vendre|vendeur|devenir\s+vendeur|inscription\s+vendeur|ouvrir\s+boutique)/i,
    reply: `Pour devenir vendeur :
1. Va sur /vendeur-inscription
2. Renseigne le nom et la description de ta boutique
3. L'admin valide ton compte sous 24h
4. Depuis /vendeur, ajoute tes produits, services ou ebooks (photos/vidéos en upload direct)
Commission : 8 % par vente. Retrait possible dès 15 000 FCFA.`,
  },
  {
    match: /(paie|mtn|momo|moov|celtiis|mobile money|payment)/i,
    reply: `Moyens de paiement :
• MTN Mobile Money
• Moov Money
• Celtiis Cash
Au checkout tu saisis ton numéro, tu confirmes sur ton téléphone, et la commande est validée instantanément.`,
  },
  {
    match: /(livraison|livré|expédition|délai)/i,
    reply: `Livraison à Cotonou, Abomey-Calavi, Porto-Novo, Ouidah, Parakou et partout au Bénin. Délai moyen 24-72h selon la ville. Frais de livraison affichés au checkout.`,
  },
  {
    match: /(ebook|pdf|t[eé]l[eé]charger|download)/i,
    reply: `Les ebooks sont livrés en PDF. Après paiement :
• Un lien de téléchargement sécurisé est envoyé par email
• Dispo aussi dans /compte/telechargements
• Lien valide 7 jours, 3 téléchargements max`,
  },
  {
    match: /(commission|frais|% ?de ?vente|royalties)/i,
    reply: `Commission Marketplace : **8 %** par vente. Le vendeur reçoit 92 % automatiquement sur son solde. Retrait possible dès 15 000 FCFA via /vendeur/retraits.`,
  },
  {
    match: /(retrait|payout|withdraw|virement)/i,
    reply: `Retrait vendeur : depuis /vendeur/retraits, demande un versement (min 15 000 FCFA). Validation admin sous 24h puis virement sur ton numéro MoMo.`,
  },
  {
    match: /(chat|message|contacter\s+vendeur|discuter)/i,
    reply: `Clic sur "Discuter avec le vendeur" sur n'importe quelle fiche (produit/service/boutique). Tu dois être connecté pour envoyer des messages.`,
  },
  {
    match: /(favoris|aimer|like|coeur|cœur)/i,
    reply: `Clique sur le cœur d'un article pour l'ajouter aux favoris. Retrouve-les dans /compte/favoris (stocké sur ton navigateur).`,
  },
  {
    match: /(s[eé]curit|fraude|arnaque|confiance|safe)/i,
    reply: `Vendeurs validés manuellement, produits modérés par l'admin. Paie toujours via la plateforme — jamais en direct. Utilise le chat pour garder une trace. Problème ? /contact`,
  },
  {
    match: /(bonjour|salut|hello|bonsoir|hey|coucou)/i,
    reply: "Salut 👋 ! Je suis l'assistant Marketplace. Pose-moi n'importe quelle question sur la plateforme : acheter, vendre, paiement, livraison, ebooks, retraits, etc.",
  },
  {
    match: /(merci|super|parfait|cool|ok)/i,
    reply: "Avec plaisir 🙌 Dis-moi si tu as d'autres questions !",
  },
  {
    match: /(contact|support|aide|help)/i,
    reply: `Support : envoie un message via /contact — on répond sous 24h. Pour un problème sur une commande, utilise aussi le chat avec le vendeur concerné.`,
  },
];

function fallbackReply(message: string): string {
  for (const r of FALLBACK_RULES) {
    if (r.match.test(message)) return r.reply;
  }
  return `Je peux t'aider sur :
• Acheter sur la plateforme
• Devenir vendeur
• Paiement Mobile Money (MTN / Moov / Celtiis)
• Livraison et délais
• Ebooks et téléchargements
• Commission et retraits
• Favoris, chat vendeur, sécurité

Reformule ta question ou clique sur /contact pour parler au support 🙂`;
}

async function callOpenAI(message: string, history: ChatMessage[]): Promise<string | null> {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;

  const messages = [
    { role: "system" as const, content: SYSTEM_PROMPT },
    ...history.slice(-8).map((h) => ({
      role: h.role === "assistant" ? ("assistant" as const) : ("user" as const),
      content: h.content,
    })),
    { role: "user" as const, content: message },
  ];

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4o-mini",
        messages,
        temperature: 0.3,
        max_tokens: 500,
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content;
    return typeof text === "string" && text.trim().length > 0 ? text.trim() : null;
  } catch {
    clearTimeout(timeout);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = String(body?.message || "").slice(0, 2000);
    const historyRaw = Array.isArray(body?.history) ? body.history : [];
    const history: ChatMessage[] = historyRaw
      .filter(
        (m: unknown): m is ChatMessage =>
          !!m &&
          typeof m === "object" &&
          (("role" in m && (m as { role: string }).role === "user") ||
            ("role" in m && (m as { role: string }).role === "assistant")) &&
          "content" in m &&
          typeof (m as { content: unknown }).content === "string",
      )
      .slice(-10);

    if (!message.trim()) {
      return NextResponse.json({ reply: "Dis-moi ce que tu cherches 🙂" });
    }

    const llm = await callOpenAI(message, history);
    const reply = llm ?? fallbackReply(message);
    return NextResponse.json({ reply, source: llm ? "llm" : "rules" });
  } catch {
    return NextResponse.json(
      { reply: "Je n'ai pas pu traiter ta demande, réessaie." },
      { status: 500 },
    );
  }
}

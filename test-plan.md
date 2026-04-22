# Plan de test — Marketplace MVP v1 (PR #1)

## Ce qui change (intention du prompt user)
Construire une marketplace multi-vendeurs Bénin complète en un seul PR : home moderne, catalogues produits/services/ebooks, panier + checkout FCFA avec mocks MoMo/Moov/Celtiis, dashboard vendeur, admin, téléchargement ebook sécurisé, chat intégré.

## Environnement
- Local : `http://localhost:3000` (dev server déjà démarré).
- DB : SQLite seedée (`npm run db:reset` déjà exécuté).
- Comptes utilisés :
  - Client : `client@demo.bj / password`
  - Vendeur : `awa@boutique.bj / password` (boutique approuvée, produits seedés)
  - Admin : `admin@marketplace.bj / admin1234`

## Flow principal — parcours acheteur end-to-end
**Pourquoi ce flow** : c'est l'acte de valeur de la marketplace. S'il casse, la PR est inutile. Il touche : rendu home (dynamic data), catalogue, fiche produit, panier `localStorage`, checkout, calcul livraison FCFA, paiement mock, persistance commande, mise à jour stock + solde vendeur.

### Étapes & assertions

1. **Ouvrir `/`** (anonyme, fenêtre maximisée)
   - Assertion : le header affiche "Marketplace", le hero contient le mot "Bénin" ou "FCFA", au moins **une carte produit** réelle s'affiche dans "Produits populaires" (preuve que `prisma.product.findMany` remonte des données seedées, pas un placeholder).
   - Si cassé : la section serait vide ou afficherait un fallback.

2. **Se connecter via `/connexion`** avec `client@demo.bj / password`
   - Assertion : redirection vers `/` et le header montre un lien "Mon compte" (preuve que `createSession` + cookie JWT fonctionnent).

3. **Cliquer sur une carte produit** → atterrir sur `/produit/[slug]`
   - Assertion : la page affiche le nom du produit, un prix **formaté en FCFA** (regex `\d+ FCFA` ou `\d+\s*F`), un bouton "Ajouter au panier" actif, et le panneau chat vendeur.

4. **Cliquer "Ajouter au panier"**
   - Assertion : l'icône panier du header affiche le badge **"1"** (preuve que le panier localStorage est bien hooké au header via event `storage`).

5. **Aller sur `/panier`**
   - Assertion : une ligne correspondant au produit ajouté, avec le **prix unitaire en FCFA** et un sous-total. Le bouton "Commander" est cliquable.

6. **Cliquer "Commander"** → `/checkout`
   - Assertion : formulaire avec sélection ville (Cotonou, Calavi, Porto-Novo, Ouidah, Parakou, Autre) ; sélection ville "Cotonou" met les frais de livraison à **1500 FCFA** visibles dans le résumé (preuve que la table de tarifs Bénin est branchée).
   - Sélectionner paiement "MTN Mobile Money" ; entrer téléphone `96123456`.

7. **Soumettre la commande**
   - Assertion : redirection vers `/commande/[id]` et badge de statut **"Payée"** visible (preuve que `initiateMockPayment` a retourné `ok`, commande persistée avec `status=PAID`, et solde vendeur crédité).
   - Assertion : la référence de paiement affichée contient "MTN-" (preuve que la ref vient bien du mock MoMo et pas d'un fallback générique).
   - Si cassé : redirection échouerait, ou la commande resterait en `PENDING`, ou la ref serait vide.

## Flow secondaire — solde vendeur reflète la vente
**Pourquoi** : le prompt demande explicitement "revenus FCFA" côté vendeur et "commission configurable". Sans cette vérification, on ne peut pas affirmer que l'intégration commission→crédit solde marche.

8. **Se déconnecter, se connecter avec `awa@boutique.bj / password`**, aller sur `/vendeur`
   - Assertion : le KPI "Solde" affiche un montant en FCFA **strictement supérieur au solde seedé initial** (preuve que `seller.balance` a été incrémenté post-paiement avec `price * qty * (1 - commissionPct)`).
   - Assertion : la liste "Commandes récentes" contient une entrée datée d'aujourd'hui avec statut "Payée".

## Non testé dans cette passe (transparence)
- Upload vidéo produit (placeholder only dans le MVP).
- Téléchargement ebook sécurisé (token signé) — couvert par les API/types mais pas par la démo vidéo pour garder la durée courte.
- Chat temps réel multi-onglets (polling 4s testable mais redondant avec la démo principale).
- Deploy Vercel — **échoue par design** car SQLite ne tourne pas sur Vercel serverless. Nécessite bascule Postgres (option B refusée par l'user).

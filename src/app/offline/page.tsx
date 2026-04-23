import Link from "next/link";
import { WifiOff } from "lucide-react";

export const metadata = { title: "Hors ligne" };

export default function OfflinePage() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center py-16 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
        <WifiOff size={36} />
      </div>
      <h1 className="text-2xl font-bold">Vous êtes hors ligne</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Vérifiez votre connexion Internet puis réessayez. Les pages déjà visitées restent
        accessibles sans connexion.
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
      >
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}

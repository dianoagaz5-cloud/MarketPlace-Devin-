"use client";

import { useEffect, useState } from "react";
import { Download, X, Smartphone } from "lucide-react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

const DISMISS_KEY = "pwa_install_dismissed_at";
const DISMISS_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export function InstallPrompt() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [iosHint, setIosHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissedAt = Number(localStorage.getItem(DISMISS_KEY) || 0);
    if (dismissedAt && Date.now() - dismissedAt < DISMISS_TTL_MS) return;

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window.navigator as any).standalone === true;
    if (standalone) return;

    const ua = window.navigator.userAgent;
    const isIOS = /iPad|iPhone|iPod/.test(ua) && !/CriOS|FxiOS/.test(ua);

    const onBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setVisible(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);

    if (isIOS) {
      const t = window.setTimeout(() => {
        setIosHint(true);
        setVisible(true);
      }, 4000);
      return () => {
        window.removeEventListener("beforeinstallprompt", onBeforeInstall);
        window.clearTimeout(t);
      };
    }

    return () => window.removeEventListener("beforeinstallprompt", onBeforeInstall);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      localStorage.setItem(DISMISS_KEY, String(Date.now()));
    } catch {}
  }

  async function install() {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-96 z-40 rounded-xl border bg-card shadow-lg p-4 animate-in slide-in-from-bottom-2">
      <div className="flex items-start gap-3">
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
          <Smartphone size={20} />
        </div>
        <div className="flex-1 text-sm">
          <div className="font-semibold">Installer l&apos;application</div>
          {iosHint ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Appuyez sur <span className="font-semibold">Partager</span> dans Safari, puis{" "}
              <span className="font-semibold">&quot;Sur l&apos;écran d&apos;accueil&quot;</span>.
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">
              Ajoute Marketplace Bénin sur ton écran d&apos;accueil pour un accès rapide et une
              expérience plein écran.
            </p>
          )}
          {!iosHint && deferred && (
            <button
              onClick={install}
              className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
            >
              <Download size={14} /> Installer
            </button>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="text-muted-foreground hover:text-foreground"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

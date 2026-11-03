"use client";

import { useEffect, useState } from "react";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export function PwaClient() {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((registration) => registration.update())
      .catch((error: unknown) => {
        console.error("SHAKH service worker registration failed:", error);
      });
  }, []);

  useEffect(() => {
    const handleInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
      setDismissed(false);
    };

    const handleInstalled = () => {
      setInstallPrompt(null);
    };

    const handleOffline = () => setOffline(true);
    const handleOnline = () => setOffline(false);

    // Defer the first browser-state sync until after the effect has committed.
    // The offline/online listeners handle all later connectivity transitions.
    const initialConnectivitySync = window.setTimeout(() => {
      setOffline(!navigator.onLine);
    }, 0);

    window.addEventListener("beforeinstallprompt", handleInstallPrompt);
    window.addEventListener("appinstalled", handleInstalled);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.clearTimeout(initialConnectivitySync);
      window.removeEventListener("beforeinstallprompt", handleInstallPrompt);
      window.removeEventListener("appinstalled", handleInstalled);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  async function installApp() {
    if (!installPrompt) return;

    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted" || choice.outcome === "dismissed") {
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error("SHAKH PWA installation prompt failed:", error);
      setInstallPrompt(null);
    }
  }

  return (
    <>
      {offline && (
        <div className="pwa-offline-notice" role="status" aria-live="polite">
          پەیوەندی ئینتەرنێت نییە؛ هەندێک خزمەتگوزاری بەردەست نابێت.
        </div>
      )}

      {installPrompt && !dismissed && (
        <aside className="pwa-install-banner" aria-label="دامەزراندنی ئەپی SHAKH">
          <span className="pwa-install-mark" aria-hidden="true">ش</span>
          <span className="pwa-install-copy">
            <strong>SHAKH وەک ئەپ دابمەزرێنە</strong>
            <small>بە خێرایی لە شاشەی سەرەکی دەستت پێی دەگات.</small>
          </span>
          <button type="button" className="pwa-install-action" onClick={installApp}>
            دامەزراندن
          </button>
          <button
            type="button"
            className="pwa-install-dismiss"
            onClick={() => setDismissed(true)}
            aria-label="داخستنی پێشنیاری دامەزراندن"
          >
            ×
          </button>
        </aside>
      )}
    </>
  );
}

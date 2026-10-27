import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef } from "react";
import { CHECKOUT_CONFIG } from "@/config/checkout";

export const Route = createFileRoute("/")({
  component: TesteNumerologicoApp,
});

export function TesteNumerologicoApp() {
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set global Stripe checkout link for access across scripts
    (window as any).STRIPE_CHECKOUT_URL = CHECKOUT_CONFIG.stripeCheckoutUrl;

    // Global Stripe Checkout Redirection Interceptor
    const handleGlobalClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest("a, button");
      if (!target) return;

      const href = (target as HTMLAnchorElement).href || "";

      // Intercept any clicks on legacy payment links and redirect directly to Stripe
      const isLegacyCheckout =
        href.includes("pay.assiny.com.br") ||
        href.includes("kirvano.com") ||
        href.includes("hotmart.com") ||
        href.includes("kiwify.com");

      if (isLegacyCheckout) {
        e.preventDefault();
        e.stopPropagation();
        const url = (window as any).STRIPE_CHECKOUT_URL || CHECKOUT_CONFIG.stripeCheckoutUrl;
        if (CHECKOUT_CONFIG.openInNewTab) {
          window.open(url, "_blank");
        } else {
          window.location.href = url;
        }
      }
    };

    document.addEventListener("click", handleGlobalClick, true);

    // Fallback execution in case deferred scripts took longer or navigated client-side
    const timer = setTimeout(() => {
      const isMounted =
        document.querySelector(".quiz-container") || document.querySelector(".eh90427");
      if (!isMounted && !isLoadedRef.current) {
        isLoadedRef.current = true;
        const s1 = document.createElement("script");
        s1.src = "/js/chunk-vendors.99370500.js";
        s1.async = false;
        s1.onload = () => {
          const s2 = document.createElement("script");
          s2.src = "/js/app.3fcf828d.js";
          s2.async = false;
          document.body.appendChild(s2);
        };
        document.body.appendChild(s1);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleGlobalClick, true);
    };
  }, []);

  return (
    <div className="relative min-h-screen">
      <div
        id="app-root-wrapper"
        dangerouslySetInnerHTML={{ __html: '<div id="app"></div>' }}
        suppressHydrationWarning
      />
    </div>
  );
}

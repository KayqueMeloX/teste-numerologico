import { createFileRoute } from "@tanstack/react-router";
import React, { useEffect, useRef } from "react";

export const Route = createFileRoute("/")({
  component: TesteNumerologicoApp,
});

export function TesteNumerologicoApp() {
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure fallback execution in case deferred scripts took longer or navigated client-side
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

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      id="app-root-wrapper"
      dangerouslySetInnerHTML={{ __html: '<div id="app"></div>' }}
      suppressHydrationWarning
    />
  );
}


"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

const onboardingRoutes = ["/", "/demo", "/get-started", "/login"];

export function OnboardingTransitions() {
  const pathname = usePathname();
  const router = useRouter();
  const navigating = useRef(false);

  useEffect(() => {
    navigating.current = false;
    document.documentElement.classList.remove("onboarding-exiting");
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        navigating.current
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!anchor || anchor.target || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href);

      if (url.origin !== window.location.origin) return;

      const destination = url.pathname;

      if (
        !onboardingRoutes.includes(pathname) ||
        !onboardingRoutes.includes(destination) ||
        destination === pathname
      ) {
        return;
      }

      event.preventDefault();
      navigating.current = true;

      const nextUrl = `${url.pathname}${url.search}${url.hash}`;

      const doc = document as Document & {
        startViewTransition?: (callback: () => void) => unknown;
      };

      if (
        doc.startViewTransition &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        doc.startViewTransition(() => {
          router.push(nextUrl);
        });
      } else if (
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        router.push(nextUrl);
      } else {
        document.documentElement.classList.add("onboarding-exiting");

        window.setTimeout(() => {
          router.push(nextUrl);
        }, 180);
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname, router]);

  return null;
}

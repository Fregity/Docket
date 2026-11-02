
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const onboardingRoutes = ["/", "/demo", "/get-started", "/login"];

export function OnboardingTransitions() {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (
        !anchor ||
        anchor.target ||
        anchor.hasAttribute("download")
      ) {
        return;
      }

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

      const nextUrl = `${url.pathname}${url.search}${url.hash}`;

      const doc = document as Document & {
        startViewTransition?: (callback: () => void) => unknown;
      };

      if (doc.startViewTransition) {
        doc.startViewTransition(() => {
          router.push(nextUrl);
        });
      } else {
        router.push(nextUrl);
      }
    }

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [pathname, router]);

  return null;
}

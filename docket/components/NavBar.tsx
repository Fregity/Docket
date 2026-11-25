"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS = [
  { href: "/dashboard", label: "Home" },
  { href: "/classes", label: "Classes" },
  { href: "/history", label: "History" },
  { href: "/settings", label: "Settings" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main navigation"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-hairline bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md"
    >
      <div className="mx-auto flex min-h-16 w-full max-w-2xl">
        {ITEMS.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-16 min-w-0 flex-1 items-center justify-center px-1 py-3 text-center text-xs transition-colors sm:text-sm ${
                active ? "font-medium text-ink" : "text-faint hover:text-ink"
              }`}
            >
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

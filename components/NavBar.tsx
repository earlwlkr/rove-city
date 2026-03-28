"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavBar() {
  const pathname = usePathname();

  const primaryLinks = [
    { href: "/", label: "Feed" },
    { href: "/map", label: "Map" },
  ];
  const secondaryLinks = [
    { href: "/profile", label: "Profile" },
    { href: "/post/new", label: "New Post" },
  ];

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1320px] items-center justify-between px-4 pt-4 sm:px-6 sm:pt-6 lg:px-8">
        <div className="flex items-center gap-0.5 rounded-full border border-stone-200/90 bg-[#f3f3f2] p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          {primaryLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[14px] leading-none tracking-[-0.02em] transition-all sm:px-8 sm:py-2.5 ${
                  active
                    ? "bg-white font-medium text-stone-900 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
                    : "font-normal text-stone-400 hover:text-stone-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {secondaryLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-[14px] leading-none tracking-[-0.02em] transition-colors ${
                  active
                    ? "font-medium text-stone-900"
                    : "font-medium text-stone-900/92 hover:text-stone-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

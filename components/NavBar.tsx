"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavBar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Feed", icon: "📰" },
    { href: "/map", label: "Map", icon: "🗺️" },
    { href: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 bg-white/90 backdrop-blur-lg border-t border-stone-200 md:top-0 md:bottom-auto">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="hidden md:flex items-center gap-2 text-lg font-bold tracking-tight text-stone-900"
        >
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ background: "var(--teal)" }}
          >
            R
          </span>
          Rove
        </Link>

        <div className="flex items-center gap-1 md:gap-2 mx-auto md:mx-0">
          {links.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-stone-500 hover:text-stone-900 hover:bg-stone-100"
                }`}
                style={isActive ? { background: "var(--teal)" } : undefined}
              >
                <span className="text-base">{link.icon}</span>
                <span className="hidden sm:inline">{link.label}</span>
              </Link>
            );
          })}
        </div>

        <Link
          href="/post/new"
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold text-white transition-colors hover:opacity-90"
          style={{ background: "var(--burnt-orange)" }}
        >
          <span className="text-lg leading-none">+</span>
          <span className="hidden sm:inline">New Post</span>
        </Link>
      </div>
    </nav>
  );
}

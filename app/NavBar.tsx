"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Layers,
  Ticket,
  Circle,
  Image as ImageIcon,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Homepage: Home,
  Home: Home,
  Overview: Home,
  "Sub-Events": Layers,
  Gallery: ImageIcon,
  Registration: Ticket,
  Register: Ticket,
};

export function NavBar({
  items,
  className,
  defaultActive = "Homepage",
}: {
  items: { name: string; url: string }[];
  className?: string;
  defaultActive?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(defaultActive);

  if (pathname.startsWith("/admin")) return null;

  const isActiveItem = (name: string) => {
    if (pathname.startsWith("/events")) return name === "Sub-Events";
    if (pathname.startsWith("/gallery")) return name === "Gallery";
    if (pathname.startsWith("/register")) return name === "Registration" || name === "Register";
    if (pathname !== "/") return false;
    return (
      activeTab === name ||
      ((name.toLowerCase() === "homepage" || name.toLowerCase() === "overview") &&
        (activeTab === "Homepage" || activeTab === "Overview" || activeTab === "Home"))
    );
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    item: { name: string; url: string }
  ) => {
    setActiveTab(item.name);

    const isHomepage =
      item.name.toLowerCase() === "homepage" ||
      item.name.toLowerCase() === "overview" ||
      item.name.toLowerCase() === "home" ||
      item.url === "/#top" ||
      item.url === "/";

    if (isHomepage) {
      e.preventDefault();

      if (pathname === "/") {
        // Direct instant jump without reverse scroll & reset scroll journey
        if (typeof window !== "undefined") {
          if ((window as any).__resetScrollJourney) {
            (window as any).__resetScrollJourney();
          } else {
            if ((window as any).__lenis) {
              (window as any).__lenis.scrollTo(0, { immediate: true });
              (window as any).__lenis.velocity = 0;
            }
            window.scrollTo({ top: 0, left: 0, behavior: "instant" });
          }
          window.history.replaceState(null, "", "/#top");
        }
      } else {
        // Navigate directly to homepage
        router.push("/");
      }
      return;
    }
  };

  return (
    <header
      className={cn("fixed top-4 right-0 left-0 z-[9990] px-4", className)}
    >
      <div className="relative mx-auto flex max-w-[1400px] items-center justify-center">
        {/* CIE Logo — the homepage hero has its own CIE lockup while it's in view, so skip the duplicate there */}
        {pathname !== "/" && (
          <a
            href="/"
            aria-label="Centre for Innovation & Entrepreneurship"
            className="absolute left-0 hidden items-center sm:flex"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/cie-full-white.png"
              alt="MLR CIE — Centre for Innovation & Entrepreneurship"
              className="h-10 w-auto max-w-[220px] object-contain"
            />
          </a>
        )}

        {/* Center Nav Navigation */}
        <motion.nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 rounded-full border-2 border-white/40 bg-[#0B2D6D]/90 p-1.5 shadow-2xl backdrop-blur-md"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {items.map((item) => {
            const Icon = ICONS[item.name] ?? Circle;
            const isActive = isActiveItem(item.name);
            const isRegistration = item.name.toLowerCase().includes("regist");

            if (isRegistration) {
              return (
                <a
                  key={item.name}
                  href={item.url}
                  onClick={(e) => handleNavClick(e, item)}
                  className={cn(
                    "relative ml-1 flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-black transition-all shadow-md sm:px-4",
                    isActive
                      ? "bg-[#33FF67] text-[#141414] ring-2 ring-[#33FF67]/50 scale-[1.02]"
                      : "bg-[#33FF67] text-[#141414] hover:bg-[#5aff87] hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </a>
              );
            }

            return (
              <a
                key={item.name}
                href={item.url}
                onClick={(e) => handleNavClick(e, item)}
                aria-label={item.name}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition sm:px-4",
                  isActive
                    ? "bg-[#F9D47B] text-[#282828] shadow-md"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{item.name}</span>
              </a>
            );
          })}
        </motion.nav>
      </div>
    </header>
  );
}

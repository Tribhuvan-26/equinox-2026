"use client";

import { useEffect, useRef, useState } from "react";
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

const SHORT_NAMES: Record<string, string> = {
  Homepage: "Home",
  Home: "Home",
  Overview: "Home",
  "Sub-Events": "Events",
  Gallery: "Gallery",
  Registration: "Register",
  Register: "Register",
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
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const scrollingDown = y > lastY.current;
      setHidden(scrollingDown && y > 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  const isActiveItem = (name: string) => {
    if (pathname.startsWith("/events")) return name === "Sub-Events" || name === "Events";
    if (pathname.startsWith("/gallery")) return name === "Gallery";
    if (pathname.startsWith("/register")) return name === "Registration" || name === "Register";
    if (pathname !== "/") return false;
    return (
      activeTab === name ||
      ((name.toLowerCase() === "homepage" || name.toLowerCase() === "overview" || name.toLowerCase() === "home") &&
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
        // Direct intentional jump to top of homepage
        try {
          sessionStorage.removeItem("equinox_home_scroll");
          sessionStorage.removeItem("equinox_scroll_y");
          sessionStorage.removeItem("equinox_restore_pending");
        } catch {}
        if (typeof window !== "undefined") {
          if ((window as any).__resetScrollJourney) {
            (window as any).__resetScrollJourney();
          } else if ((window as any).__lenis) {
            (window as any).__lenis.scrollTo(0, { immediate: true });
            (window as any).__lenis.velocity = 0;
            window.scrollTo({ top: 0, behavior: "instant" });
          } else {
            window.scrollTo({ top: 0, behavior: "instant" });
          }
          window.history.replaceState(null, "", "/#top");
        }
      } else {
        // If returning from a sub-event, preserve restoration state
        if (pathname.startsWith("/events")) {
          try {
            sessionStorage.setItem("equinox_restore_pending", "true");
          } catch {}
        }
        // Navigate directly to homepage
        router.push("/");
      }
      return;
    }
  };

  return (
    <header
      className={cn(
        "fixed top-4 right-0 left-0 z-[9990] px-2 sm:px-4 transition-transform duration-300",
        hidden ? "-translate-y-24" : "translate-y-0",
        className
      )}
    >
      <div className="relative mx-auto flex max-w-[1400px] items-center justify-center">
        {/* CIE Logo — the homepage hero has its own CIE lockup while it's in view, so skip the duplicate there */}
        {pathname !== "/" && (
          <a
            href="https://mlritcie.in/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Centre for Innovation & Entrepreneurship"
            className="absolute left-0 hidden items-center lg:flex transition-opacity hover:opacity-85"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logos/cie-full-white.png"
              alt="MLR CIE — Centre for Innovation & Entrepreneurship"
              className="h-10 w-auto max-w-[220px] object-contain"
            />
          </a>
        )}

        {/* Center Nav Navigation — now visible across mobile and desktop */}
        <motion.nav
          aria-label="Primary"
          className="flex items-center gap-0.5 sm:gap-1 rounded-full border border-white/20 sm:border-2 bg-[#151515]/90 p-1 sm:p-1.5 shadow-2xl backdrop-blur-md max-w-[96vw] overflow-x-auto"
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
                    "relative ml-0.5 sm:ml-1 flex items-center gap-1 sm:gap-1.5 rounded-full px-2.5 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-black transition-all shadow-md shrink-0",
                    isActive
                      ? "bg-[#33FF67] text-[#141414] ring-2 ring-[#33FF67]/50 scale-[1.02]"
                      : "bg-[#33FF67] text-[#141414] hover:bg-[#5aff87] hover:scale-[1.02] active:scale-[0.98]"
                  )}
                >
                  <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                  <span className="sm:hidden">{SHORT_NAMES[item.name] ?? item.name}</span>
                  <span className="hidden sm:inline">{item.name}</span>
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
                  "relative flex items-center gap-1 sm:gap-1.5 rounded-full px-2 py-1.5 sm:px-4 sm:py-2 text-[11px] sm:text-xs font-bold transition shrink-0",
                  isActive
                    ? "bg-[#7484FE] text-[#2A2A2A] shadow-md font-black"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                )}
              >
                <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                <span className="sm:hidden">{SHORT_NAMES[item.name] ?? item.name}</span>
                <span className="hidden sm:inline">{item.name}</span>
              </a>
            );
          })}
        </motion.nav>
      </div>
    </header>
  );
}

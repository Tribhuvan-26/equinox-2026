"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Info,
  Calendar,
  Layers,
  Phone,
  Circle,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  Prospectus: FileText,
  About: Info,
  "Sub-Events": Layers,
  Impact: Calendar,
  Contact: Phone,
};

export function NavBar({
  items,
  className,
  defaultActive = "Prospectus",
}: {
  items: { name: string; url: string }[];
  className?: string;
  defaultActive?: string;
}) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState(defaultActive);

  const isActiveItem = (name: string) => {
    if (pathname.startsWith("/events")) return name === "Sub-Events";
    if (pathname !== "/") return false;
    return activeTab === name;
  };

  return (
    <header
      className={cn("fixed top-4 right-0 left-0 z-[9990] px-4", className)}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between">
        {/* Brand Mark Link */}
        <Link
          href="/#top"
          className="group flex items-center gap-2 rounded-full border border-white/40 bg-[#0f35b5]/80 px-4 py-2 backdrop-blur-md transition hover:bg-white hover:text-[#174ae8]"
        >
          <span className="font-mono text-xs font-black tracking-widest text-white group-hover:text-[#174ae8] uppercase">
            EQUINOX
          </span>
          <span className="rounded bg-white px-1 py-0.2 text-[10px] font-black text-[#0d0e15] group-hover:bg-[#174ae8] group-hover:text-white">
            2.0
          </span>
        </Link>

        {/* Center Nav Navigation */}
        <motion.nav
          aria-label="Primary"
          className="hidden md:flex items-center gap-1 rounded-full border-2 border-white/50 bg-[#0d2d99]/85 p-1.5 shadow-2xl backdrop-blur-md"
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {items.map((item) => {
            const Icon = ICONS[item.name] ?? Circle;
            const isActive = isActiveItem(item.name);

            return (
              <a
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition",
                  isActive
                    ? "bg-white text-[#174ae8] shadow-md"
                    : "text-white/85 hover:bg-white/15 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </motion.nav>

        {/* Mobile Sub-Events CTA & Date Badge */}
        <div className="flex items-center gap-2">
          <a
            href="/#events"
            className="flex items-center gap-1.5 rounded-full border-2 border-white bg-white px-4 py-2 text-xs font-bold text-[#174ae8] shadow-md transition hover:bg-white/90"
          >
            <span>10 Events</span>
          </a>
        </div>
      </div>
    </header>
  );
}

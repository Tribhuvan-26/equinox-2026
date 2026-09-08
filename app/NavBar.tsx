"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
  Overview: FileText,
  About: Info,
  "Sub-Events": Layers,
  Impact: Calendar,
  Contact: Phone,
};

export function NavBar({
  items,
  className,
  defaultActive = "Overview",
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
      <div className="mx-auto flex max-w-[1400px] items-center justify-center">
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

            return (
              <a
                key={item.name}
                href={item.url}
                onClick={() => setActiveTab(item.name)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition",
                  isActive
                    ? "bg-[#F9D47B] text-[#282828] shadow-md"
                    : "text-white/90 hover:bg-white/15 hover:text-white"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{item.name}</span>
              </a>
            );
          })}
        </motion.nav>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Sidebar, type AdminView } from "./Sidebar";

export function MobileMenu({
  activeView,
  onViewChange,
}: {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}) {
  const [open, setOpen] = useState(false);

  function handleChange(view: AdminView) {
    onViewChange(view);
    setOpen(false);
  }

  return (
    <>
      <div className="fixed top-4 left-4 z-50 lg:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="rounded-lg border border-white/20 bg-[#2A2A2A] p-2 text-[#F7F2F6] shadow-lg"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <Sidebar activeView={activeView} onViewChange={handleChange} forceVisible />
        </div>
      )}
    </>
  );
}

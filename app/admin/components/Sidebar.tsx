"use client";

import { Home, Users, BarChart3, Clock, CheckCircle, XCircle, ChevronsLeft, ChevronsRight } from "lucide-react";

export type AdminView = "dashboard" | "participants" | "analytics" | "pending" | "approved" | "rejected";

const MENU_ITEMS: { id: AdminView; label: string; icon: typeof Home }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "participants", label: "Teams", icon: Users },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "pending", label: "Pending", icon: Clock },
  { id: "approved", label: "Approved", icon: CheckCircle },
  { id: "rejected", label: "Rejected", icon: XCircle },
];

export function Sidebar({
  activeView,
  onViewChange,
  forceVisible = false,
  collapsed = false,
  onToggleCollapsed,
}: {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
  forceVisible?: boolean;
  collapsed?: boolean;
  onToggleCollapsed?: () => void;
}) {
  return (
    <div
      className={`fixed left-0 top-0 z-30 h-screen flex-col border-r border-white/15 bg-[#2A2A2A] transition-[width] duration-300 ${
        collapsed ? "w-20" : "w-60"
      } ${forceVisible ? "flex" : "hidden lg:flex"}`}
    >
      <div className="flex items-center justify-between border-b border-white/15 p-6">
        {!collapsed && (
          <div>
            <h1 className="heading text-lg font-black text-[#F7F2F6]">Equinox Admin</h1>
            <p className="mt-1 text-xs text-[#F7F2F6]/60">CIE MLRIT</p>
          </div>
        )}
        {onToggleCollapsed && (
          <button
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-lg p-1.5 text-[#F7F2F6]/60 hover:bg-white/10 hover:text-[#F7F2F6]"
          >
            {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </button>
        )}
      </div>
      <nav className="mt-4 flex flex-col">
        {MENU_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-6 py-3 text-left text-sm font-bold transition-colors ${
                collapsed ? "justify-center px-0" : ""
              } ${
                active
                  ? "border-r-2 border-[#33FF67] bg-[#33FF67]/10 text-[#33FF67]"
                  : "text-[#F7F2F6]/70 hover:bg-white/5 hover:text-[#F7F2F6]"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

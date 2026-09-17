"use client";

import { Users, Clock, CheckCircle, TrendingUp } from "lucide-react";
import type { RegistrationRecord } from "@/lib/registration/types";

export function DashboardStats({ registrations }: { registrations: RegistrationRecord[] }) {
  const total = registrations.length;
  const pending = registrations.filter((r) => r.status === "pending").length;
  const approved = registrations.filter((r) => r.status === "approved").length;
  const revenue = registrations
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + r.total_amount, 0);

  const stats = [
    { title: "Total Teams", value: total, icon: Users, color: "text-[#7484FE]", bg: "bg-[#7484FE]/10" },
    { title: "Pending Verification", value: pending, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { title: "Approved", value: approved, icon: CheckCircle, color: "text-[#33FF67]", bg: "bg-[#33FF67]/10" },
    { title: "Approved Revenue", value: `₹${revenue.toLocaleString("en-IN")}`, icon: TrendingUp, color: "text-[#33FF67]", bg: "bg-[#33FF67]/10" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.title} className="rounded-xl border border-white/15 bg-black/20 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/50">{stat.title}</p>
                <p className={`mt-1 text-2xl font-black ${stat.color}`}>{stat.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${stat.bg}`}>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

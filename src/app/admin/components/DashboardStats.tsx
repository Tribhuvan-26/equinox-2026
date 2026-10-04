"use client";

import { Users, UsersRound, Clock, CheckCircle, XCircle, UserMinus, UserPlus, TrendingUp } from "lucide-react";
import type { RegistrationRecord } from "@/lib/registration/types";
import type { AdminTeam } from "../AdminDashboard";

export function DashboardStats({
  registrations,
  teams,
}: {
  registrations: RegistrationRecord[];
  teams: AdminTeam[];
}) {
  // Rejected registrations aren't really in, so they don't count toward people.
  const people = registrations
    .filter((r) => r.status !== "rejected")
    .reduce((sum, r) => sum + r.participant_count, 0);
  const pending = registrations.filter((r) => r.status === "pending").length;
  const approved = registrations.filter((r) => r.status === "approved").length;
  const rejected = registrations.filter((r) => r.status === "rejected").length;
  const noTeam = registrations.filter((r) => !r.team_id && r.status !== "rejected").length;
  const joinRequests = registrations.filter((r) => r.requested_team_id && r.status !== "rejected").length;
  const revenue = registrations
    .filter((r) => r.status === "approved")
    .reduce((sum, r) => sum + r.total_amount, 0);

  const stats = [
    { title: "People Registered", value: people, icon: Users, color: "text-[#7484FE]", bg: "bg-[#7484FE]/10" },
    { title: "Total Teams", value: teams.length, icon: UsersRound, color: "text-[#7484FE]", bg: "bg-[#7484FE]/10" },
    { title: "Pending Verification", value: pending, icon: Clock, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { title: "Approved", value: approved, icon: CheckCircle, color: "text-[#33FF67]", bg: "bg-[#33FF67]/10" },
    { title: "Not Approved", value: rejected, icon: XCircle, color: "text-red-400", bg: "bg-red-400/10" },
    { title: "Paid, No Team", value: noTeam, icon: UserMinus, color: "text-yellow-400", bg: "bg-yellow-400/10" },
    { title: "Join Requests", value: joinRequests, icon: UserPlus, color: "text-[#7484FE]", bg: "bg-[#7484FE]/10" },
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

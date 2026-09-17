"use client";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, startOfDay, eachDayOfInterval, subDays } from "date-fns";
import type { RegistrationRecord } from "@/lib/registration/types";

export function RegistrationChart({ registrations }: { registrations: RegistrationRecord[] }) {
  const last7Days = eachDayOfInterval({ start: subDays(new Date(), 6), end: new Date() });

  const dailyData = last7Days.map((day) => {
    const dayStart = startOfDay(day);
    const dayRegs = registrations.filter(
      (r) => startOfDay(parseISO(r.created_at)).getTime() === dayStart.getTime()
    );
    return {
      date: format(day, "MMM dd"),
      total: dayRegs.length,
      approved: dayRegs.filter((r) => r.status === "approved").length,
      pending: dayRegs.filter((r) => r.status === "pending").length,
    };
  });

  const statusData = [
    { name: "Approved", value: registrations.filter((r) => r.status === "approved").length, color: "#33FF67" },
    { name: "Pending", value: registrations.filter((r) => r.status === "pending").length, color: "#facc15" },
    { name: "Rejected", value: registrations.filter((r) => r.status === "rejected").length, color: "#ef4444" },
  ].filter((d) => d.value > 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-xl border border-white/15 bg-black/20 p-6">
        <h3 className="text-sm font-bold text-[#F7F2F6]">Daily Registrations (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="date" stroke="#F7F2F6" fontSize={12} />
            <YAxis stroke="#F7F2F6" fontSize={12} allowDecimals={false} />
            <Tooltip contentStyle={{ background: "#2A2A2A", border: "1px solid rgba(255,255,255,0.2)" }} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#7484FE" strokeWidth={2} name="Total" />
            <Line type="monotone" dataKey="approved" stroke="#33FF67" strokeWidth={2} name="Approved" />
            <Line type="monotone" dataKey="pending" stroke="#facc15" strokeWidth={2} name="Pending" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-xl border border-white/15 bg-black/20 p-6">
        <h3 className="text-sm font-bold text-[#F7F2F6]">Registration Status</h3>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={90}
              dataKey="value"
            >
              {statusData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: "#2A2A2A", border: "1px solid rgba(255,255,255,0.2)" }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

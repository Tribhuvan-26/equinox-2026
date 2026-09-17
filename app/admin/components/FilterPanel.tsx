"use client";

import { useEffect, useState } from "react";
import { Search, Filter, X } from "lucide-react";
import type { RegistrationRecord, RegistrationStatus } from "@/lib/registration/types";

export function FilterPanel({
  registrations,
  onFilterChange,
}: {
  registrations: RegistrationRecord[];
  onFilterChange: (filtered: RegistrationRecord[]) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RegistrationStatus | "">("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    let filtered = registrations;
    const term = search.trim().toLowerCase();

    if (term) {
      filtered = filtered.filter((r) => {
        if (r.confirmation_number?.toLowerCase().includes(term)) return true;
        if (`eq-${String(r.team_seq).padStart(3, "0")}`.includes(term)) return true;
        if (r.utr_number.toLowerCase().includes(term)) return true;
        return r.participants.some(
          (p) =>
            p.name.toLowerCase().includes(term) ||
            p.email.toLowerCase().includes(term) ||
            p.mobile.includes(term) ||
            p.college.toLowerCase().includes(term)
        );
      });
    }

    if (status) filtered = filtered.filter((r) => r.status === status);

    if (dateRange.start) {
      filtered = filtered.filter((r) => new Date(r.created_at) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      filtered = filtered.filter((r) => new Date(r.created_at) <= new Date(`${dateRange.end}T23:59:59`));
    }

    onFilterChange(filtered);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, status, dateRange, registrations]);

  function clearFilters() {
    setSearch("");
    setStatus("");
    setDateRange({ start: "", end: "" });
  }

  const hasFilters = search || status || dateRange.start || dateRange.end;

  return (
    <div className="rounded-xl border border-white/15 bg-black/20 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-[#F7F2F6]">Filters</h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-[#F7F2F6]/80 hover:bg-white/15"
        >
          <Filter className="h-3.5 w-3.5" />
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      <div className="relative mt-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#F7F2F6]/40" />
        <input
          type="text"
          placeholder="Search by name, email, mobile, college, confirmation or team number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-white/20 bg-black/20 py-3 pl-10 pr-4 text-sm text-[#F7F2F6] outline-none focus:border-[#7484FE]"
        />
      </div>

      {showFilters && (
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/60">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as RegistrationStatus | "")}
              className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-[#F7F2F6] outline-none focus:border-[#7484FE]"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/60">From Date</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-[#F7F2F6] outline-none focus:border-[#7484FE]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[#F7F2F6]/60">To Date</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
              className="w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-[#F7F2F6] outline-none focus:border-[#7484FE]"
            />
          </div>
        </div>
      )}

      {hasFilters && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-[#F7F2F6]/70 hover:bg-white/10 hover:text-[#F7F2F6]"
          >
            <X className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}

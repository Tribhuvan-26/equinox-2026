/** Shown the instant sign-in navigates here, while the dashboard data loads. */
export default function AdminLoading() {
  return (
    <main className="min-h-screen bg-[#2A2A2A] px-4 py-12 text-[#F7F2F6] sm:px-8">
      <div className="mx-auto max-w-6xl animate-pulse lg:pl-60" aria-busy="true" aria-label="Loading dashboard">
        <h1 className="heading text-3xl font-black">Registration Verification</h1>
        <div className="mt-8 h-7 w-48 rounded-lg bg-white/10" />
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="h-24 rounded-xl border border-white/10 bg-white/5" />
          ))}
        </div>
      </div>
    </main>
  );
}

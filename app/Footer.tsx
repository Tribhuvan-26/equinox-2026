import Link from "next/link";
import { event, nav, socials, contact } from "@/lib/content";

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="relative overflow-hidden border-t-2 border-white/20 bg-[#0B2D6D] pt-20 pb-12 text-white brochure-grid-dense"
    >
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-12 px-4 sm:px-8">
        {/* Top Section */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-black tracking-widest text-[#EB547C] uppercase">
                THE
              </span>
              <span className="font-mono text-2xl font-black tracking-widest text-[#F9D47B] uppercase">
                EQUINOX
              </span>
              <span className="rounded border border-white/50 bg-[#EB547C] px-2 py-0.5 font-mono text-xs font-black text-white">
                2.0
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-white/80">
              The flagship entrepreneurship summit at MLR Institute of Technology, organized by the Centre for Innovation and Entrepreneurship (CIE).
            </p>
            <p className="mt-2 font-mono text-xs font-bold text-[#F9D47B]">
              # WHERE PASSION MEETS PERSEVERANCE
            </p>
          </div>

          <div className="flex flex-wrap gap-12">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#F9D47B]">
                Site Index
              </p>
              <ul className="mt-4 space-y-2">
                {nav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm font-medium text-white/80 transition hover:text-[#F9D47B] hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#F9D47B]">
                Official Connect
              </p>
              <ul className="mt-4 space-y-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-white/80 transition hover:text-[#F9D47B] hover:underline"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm font-medium text-white/80 transition hover:text-[#F9D47B] hover:underline"
                  >
                    Email Organizers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Massive Footer Wordmark */}
        <div className="border-t border-white/20 pt-8 text-center md:text-left">
          <p className="font-display-title text-5xl font-black tracking-tighter text-[#F9D47B]/20 sm:text-7xl md:text-8xl lg:text-[10rem]">
            THE EQUINOX
          </p>
        </div>

        {/* Bottom Legal / Institutional Bar */}
        <div className="flex flex-col justify-between gap-4 border-t border-white/20 pt-6 text-xs text-white/70 sm:flex-row">
          <p>© 2026 The Equinox 2.0 · Centre for Innovation &amp; Entrepreneurship (CIE), MLRIT.</p>
          <p>Dundigal Police Station Road, Hyderabad – 500 043, Telangana, India.</p>
        </div>
      </div>
    </footer>
  );
}

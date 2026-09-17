import Link from "next/link";
import { event, nav, socials, contact } from "@/lib/content";

export function Footer() {
  return (
    <footer
      id="site-footer"
      className="relative overflow-hidden border-t border-white/20 bg-[#2A2A2A] pt-20 pb-12 text-[#F7F2F6] brochure-grid-dense"
    >
      <div className="relative mx-auto flex max-w-[1400px] flex-col gap-12 px-4 sm:px-8">
        {/* Top Section */}
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
          <div className="max-w-md">
            <img
              src="/equinox-logo.svg"
              alt="The Equinox 2.0"
              className="h-16 w-auto object-contain object-left sm:h-20"
            />
            <p className="mt-3 text-sm leading-relaxed text-[#F7F2F6]/80">
              The flagship entrepreneurship summit at MLR Institute of Technology, organized by the Centre for Innovation and Entrepreneurship (CIE).
            </p>
            <p className="mt-2 font-mono text-xs font-bold text-[#33FF67]">
              # WHERE PASSION MEETS PERSEVERANCE
            </p>
            <div className="mt-6 flex items-center gap-6">
              <img src="/logos/cie-white.png" alt="MLR CIE — Centre for Innovation & Entrepreneurship" className="h-10 w-auto object-contain" />
            </div>
          </div>

          <div className="flex flex-wrap gap-12">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#33FF67]">
                Site Index
              </p>
              <ul className="mt-4 space-y-2">
                {nav.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-sm font-medium text-[#F7F2F6]/80 transition hover:text-[#7484FE] hover:underline"
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-wider text-[#33FF67]">
                Official Connect
              </p>
              <ul className="mt-4 space-y-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#F7F2F6]/80 transition hover:text-[#7484FE] hover:underline"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-sm font-medium text-[#F7F2F6]/80 transition hover:text-[#7484FE] hover:underline"
                  >
                    Email Organizers
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Legal / Institutional Bar */}
        <div className="flex flex-col justify-between gap-4 border-t border-white/20 pt-6 text-xs text-[#F7F2F6]/70 sm:flex-row">
          <p>© 2026 The Equinox 2.0 · Centre for Innovation &amp; Entrepreneurship (CIE), MLRIT.</p>
          <p>Dundigal Police Station Road, Hyderabad – 500 043, Telangana, India.</p>
        </div>
      </div>
    </footer>
  );
}

import { event, socials } from "@/lib/content";

export function FooterMinimal() {
  return (
    <footer
      id="contact"
      className="grain relative overflow-hidden bg-[radial-gradient(90%_130%_at_50%_130%,#2e1b54_0%,#150f2b_45%,#07060e_80%)] pt-24 pb-10"
    >
      {/* Gutter inside the cap, matching every body section — with it outside,
          the footer's content edge sits 32px wider than the page above it. */}
      <div className="@container relative mx-auto flex max-w-[1400px] flex-col gap-12 px-4 sm:px-8">

        {/* The sign-off restates the thesis: one wordmark, lit on top, dark
            below, split on a hard line. */}
        {/* Sized in cqw, not vw — past 1400px the container stops growing and a
            vw-sized wordmark ran off the right edge. */}
        <p className="display bg-[linear-gradient(to_bottom,#edeaf5_0_50%,#3a2d63_50%_100%)] bg-clip-text text-[13cqw] text-transparent">
          {event.name.toUpperCase()}
        </p>

        <div className="label flex flex-col justify-between gap-4 border-t border-fg/15 pt-6 text-fg/70 sm:flex-row sm:items-center">
          <p>
            © {event.year} {event.name}. All rights reserved.
          </p>

          {/* Minimal Social Links - Screenshot Style */}
          <div className="flex items-center gap-4">
            {socials.map((social, index) => (
              <div key={social.label} className="flex items-center gap-4">
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label text-fg/85 transition-opacity duration-200 hover:text-beam hover:opacity-70"
                >
                  {social.label.toUpperCase()}
                </a>
                {index < socials.length - 1 && (
                  <span className="text-fg/30">/</span>
                )}
              </div>
            ))}
          </div>

          <p className="hidden sm:block">{event.host}</p>
        </div>
      </div>
    </footer>
  );
}

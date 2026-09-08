import {
  Arrow,
  ContactCard,
  PageTransition,
  SectionHeading,
} from "../ui";
import { board, contact, event } from "@/lib/content";

/* Same shape as About(): eyebrow/heading up top, an editorial lead paragraph,
   then the particulars — here the particulars are people instead of facts,
   so ContactCard (already built, previously unused) carries that row. */
function ContactHero() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pt-40 pb-24 sm:px-8 sm:pt-48">
      <SectionHeading eyebrow="Brochure Page 12" heading="Contact Us" />
      <p className="mt-10 max-w-2xl text-xl leading-relaxed text-white/90 sm:text-2xl sm:leading-relaxed">
        {contact.body}
      </p>
    </section>
  );
}

function Board() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {board.map((person) => (
          <ContactCard key={person.name} {...person} />
        ))}
      </div>
    </section>
  );
}

/* Venue + general email as a ruled row, matching Audience()/Backers() rather
   than another card grid — two facts don't need tiles. */
function Particulars() {
  return (
    <section className="mx-auto max-w-[1400px] px-4 pb-28 sm:px-8">
      <dl className="flex flex-col">
        <div className="grid gap-2 border-t border-white/20 py-7 sm:grid-cols-[14rem_1fr] sm:gap-10">
          <dt className="font-display-title text-2xl text-white">General enquiries</dt>
          <dd className="data max-w-2xl text-white/85">
            <a href={`mailto:${contact.email}`} className="text-[#F9D47B] font-bold hover:underline">
              {contact.email}
            </a>
          </dd>
        </div>
        <div className="grid gap-2 border-t border-b border-white/20 py-7 sm:grid-cols-[14rem_1fr] sm:gap-10">
          <dt className="font-display-title text-2xl text-white">Venue</dt>
          <dd className="max-w-2xl leading-relaxed text-white/85">{event.venueFull}</dd>
        </div>
      </dl>

      <a
        href="/register"
        className="press mt-12 flex w-max items-center gap-2 rounded-full border-2 border-[#282828] bg-[#F9D47B] py-2 pr-2 pl-6 font-bold text-[#282828] shadow-[4px_4px_0px_#282828] transition hover:bg-[#ffe17d]"
      >
        Register instead
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#EB547C] text-white">
          <Arrow />
        </span>
      </a>
    </section>
  );
}

export default function ContactPage() {
  return (
    <PageTransition>
      <main className="riso-texture brochure-grid min-h-screen bg-[#2074D5] text-white selection:bg-[#F9D47B] selection:text-[#282828]">
        <ContactHero />
        <Board />
        <Particulars />
      </main>
    </PageTransition>
  );
}

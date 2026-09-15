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
      <p className="mt-10 max-w-2xl text-xl leading-relaxed text-[#F7F2F6]/90 sm:text-2xl sm:leading-relaxed">
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
          <dt className="font-display-title text-2xl text-[#F7F2F6]">General enquiries</dt>
          <dd className="data max-w-2xl text-[#F7F2F6]/85">
            <a href={`mailto:${contact.email}`} className="text-[#7484FE] font-bold hover:underline">
              {contact.email}
            </a>
          </dd>
        </div>
        <div className="grid gap-2 border-t border-b border-white/20 py-7 sm:grid-cols-[14rem_1fr] sm:gap-10">
          <dt className="font-display-title text-2xl text-[#F7F2F6]">Venue</dt>
          <dd className="max-w-2xl leading-relaxed text-[#F7F2F6]/85">{event.venueFull}</dd>
        </div>
      </dl>

      <a
        href="/register"
        className="press mt-12 flex w-max items-center gap-2 rounded-full border-2 border-[#2A2A2A] bg-[#7484FE] py-2 pr-2 pl-6 font-bold text-[#F7F2F6] shadow-[4px_4px_0px_#2A2A2A] transition hover:bg-[#5868DF]"
      >
        Register instead
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[#33FF67] text-[#2A2A2A]">
          <Arrow />
        </span>
      </a>
    </section>
  );
}

export default function ContactPage() {
  return (
    <PageTransition>
      <main className="riso-texture brochure-grid min-h-screen bg-[#2A2A2A] text-[#F7F2F6] selection:bg-[#7484FE] selection:text-[#2A2A2A]">
        <ContactHero />
        <Board />
        <Particulars />
      </main>
    </PageTransition>
  );
}

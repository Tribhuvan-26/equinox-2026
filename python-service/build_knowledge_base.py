#!/usr/bin/env python3
"""
build_knowledge_base.py
Offline script to chunk Equinox 2026 content, generate vector embeddings using Gemini,
and store the knowledge base as knowledge_base.json.
"""

import os
import json
import sys
from pathlib import Path
from dotenv import load_dotenv  # type: ignore

# Search for .env or .env.local in current dir or parent dir
load_dotenv(Path(__file__).parent / ".env")
load_dotenv(Path(__file__).parent / ".env.local")
load_dotenv(Path(__file__).parent.parent / ".env.local")

from google import genai  # type: ignore

API_KEY = os.environ.get("GEMINI_API_KEY")
if not API_KEY:
    print("Error: GEMINI_API_KEY is not set in environment or .env/.env.local", file=sys.stderr)
    sys.exit(1)

client = genai.Client(api_key=API_KEY)
EMBEDDING_MODELS = ["gemini-embedding-001", "gemini-embedding-2"]

def load_equinox_content():
    content_file = Path(__file__).parent / "content" / "equinox_content.json"
    if not content_file.exists():
        raise FileNotFoundError(f"Content file not found at: {content_file}")
    with open(content_file, "r", encoding="utf-8") as f:
        return json.load(f)

def build_chunks(raw_data):
    chunks = []
    event = raw_data.get("event", {})
    about = raw_data.get("about", {})
    coordinators = raw_data.get("studentCoordinators", [])
    sub_events = raw_data.get("subEvents", [])
    contact = raw_data.get("contact", {})
    registration = raw_data.get("registration", {})
    faqs = raw_data.get("faqs", [])

    # 1. Summit Overview
    chunks.append({
        "id": "overview-summit",
        "title": "The Equinox 2.0 - Overview & General Information",
        "source": "content/equinox_content.json (event)",
        "category": "overview",
        "metadata": {"dates": event.get("datesFull"), "venue": event.get("venueFull")},
        "content": f"""The Equinox 2.0 (2026) is the flagship annual entrepreneurship summit organized by the Centre for Innovation and Entrepreneurship (CIE) at MLR Institute of Technology (MLRIT), Hyderabad.
Tagline: "{event.get('tagline')}" (# WHERE PASSION MEETS PERSEVERANCE).
Dates: {event.get('datesFull')} (30th & 31st October 2026).
Venue: {event.get('venueFull')}.
Host: {event.get('host')}. Institution: {event.get('institution')} ("{event.get('institutionMotto')}").
Audience: Over 1,000+ student innovators, builders, startup founders, strategists, and E-Cell leaders across campuses in India.
Highlights: 10 official sub-events, 2 action-packed days, 50+ college E-Cells participating."""
    })

    # 2. Who We Are & What We Do
    chunks.append({
        "id": "about-cie-mission",
        "title": "Who We Are & What We Do - CIE MLRIT",
        "source": "content/equinox_content.json (about)",
        "category": "overview",
        "metadata": {"host": event.get("host")},
        "content": f"""Who We Are:
{about.get('whoAreWe', '')}

What We Do:
{about.get('whatWeDo', '')}

What Is Equinox:
{about.get('whatIsEquinox', '')}
{' '.join(about.get('body', []))}"""
    })

    # 3. Student Coordinators & Contact Info
    coords_text = "\n".join([f"• {c['name']} ({c.get('role', 'Student Coordinator')}): Phone {c['phone']}" for c in coordinators])
    address_text = "\n".join(contact.get("addressLines", []))
    chunks.append({
        "id": "contacts-coordinators",
        "title": "Official Student Coordinators & Contact Information",
        "source": "content/equinox_content.json (studentCoordinators, contact)",
        "category": "coordinators",
        "metadata": {"email": contact.get("email"), "website": contact.get("website")},
        "content": f"""Official Student Coordinators for Equinox 2.0 (Page 12 of brochure):
{coords_text}

Official Summit Support:
Email: {contact.get('email')}
Website: {contact.get('website')} ({contact.get('websiteUrl')})
Address:
{address_text}

For doubts, questions, team reservations, or partnerships, reach out directly to the student coordinators or email cie@mlrinstitutions.ac.in."""
    })

    # 4. The 10 Sub-events
    for se in sub_events:
        slug = se.get("slug")
        about_text = "\n".join(se.get("about", []))
        rules_text = "\n".join([f"{i+1}. {r}" for i, r in enumerate(se.get("rules", []))])
        skills_text = ", ".join(se.get("skills", []))
        spoc = se.get("spoc", {})

        chunks.append({
            "id": f"subevent-{slug}",
            "title": f"Sub-Event: {se.get('name')} (Page {se.get('pageNumber', '05')})",
            "source": f"content/equinox_content.json (subEvents [{slug}])",
            "category": "subevent",
            "metadata": {
                "slug": slug,
                "name": se.get("name"),
                "pageNumber": se.get("pageNumber"),
                "category": se.get("category"),
                "venue": se.get("venueRoom") or se.get("venue"),
                "timing": se.get("timing"),
                "spoc": spoc,
            },
            "content": f"""Sub-Event Name: {se.get('name')}
Brochure Page: Page {se.get('pageNumber')}
Category: {se.get('category')}
Tagline: "{se.get('tagline')}"
Description: {se.get('description')}

Format:
{se.get('format')}

Detailed Overview:
{about_text}

Target Skills: {skills_text}
Eligibility: {se.get('eligibility')}
Team Size: {se.get('teamSize')}
Schedule & Timing: {se.get('timing')} ({se.get('day')}, {se.get('time')})
Venue: {se.get('venueRoom') or se.get('venue')}
Registration Status: {se.get('registrationStatus')}
Fees: {se.get('fee')}
Prizes & Perks: {se.get('prize')}

Rules & Guidelines:
{rules_text}

Event SPOC (Single Point of Contact):
Name: {spoc.get('name')}, Phone: {spoc.get('phone')}, Email: {spoc.get('email', contact.get('email'))}"""
        })

    # 5. Registration Process & Passes
    reg_steps = registration.get("steps", [])
    steps_text = "\n".join([f"{i+1}. {s['title']}: {s['body']}" for i, s in enumerate(reg_steps)])
    chunks.append({
        "id": "registration-tickets",
        "title": "Registration Process & Summit Passes",
        "source": "content/equinox_content.json (registration)",
        "category": "logistics",
        "metadata": {},
        "content": f"""Registration Details for The Equinox 2.0:
{registration.get('body', '')}

Registration Steps:
{steps_text}

Summit Pass:
Full access pass for both days (30 - 31 October 2026).
Perks include: Access to all 10 sub-events, Startup Expo floor badge, delegate kit, participation certificates, and exclusive founder/mentor networking.
For team discounts or institutional group passes, contact student coordinators or email cie@mlrinstitutions.ac.in."""
    })

    # 6. FAQs
    faq_lines = [f"Q{i+1}: {f['q']}\nA{i+1}: {f['a']}" for i, f in enumerate(faqs)]
    chunks.append({
        "id": "summit-faqs",
        "title": "Frequently Asked Questions (FAQ)",
        "source": "content/equinox_content.json (faqs)",
        "category": "faq",
        "metadata": {},
        "content": f"""Frequently Asked Questions about Equinox 2.0:

{chr(10).join(faq_lines)}

Who Can Attend:
Students, innovators, developers, strategists, and aspiring startup founders from any recognized university or college across India can participate.
Events cater to diverse specializations including sales/marketing (Hustle Mania), strategy/case analysis (Crossroads), cricket strategy & finance (IPL Auction), venture pitching (Pitch Deck), tech trends (Spotlight), and gaming/monopoly simulation (Startup Poly)."""
    })

    # 7. Impact, Scale & Ecosystem Highlights
    chunks.append({
        "id": "summit-impact",
        "title": "Summit Impact, Scale & Ecosystem Highlights",
        "source": "content/equinox_content.json (highlights)",
        "category": "sponsorship",
        "metadata": {},
        "content": """Equinox 2.0 Summit Scale & Impact:
• 10 Official Sub-Events spanning strategy, cricket auctions, debates, sales, and startup pitching.
• 2 Days: 30 & 31 October 2026.
• 1,000+ student innovators from premier colleges and technical institutions.
• 50+ college E-Cells connecting in the inter-college E-Cell Meet.
• Organizing Body: Centre for Innovation and Entrepreneurship (CIE), MLRIT.
• Institutional Motto: "Engineering Ideas, Engineering Careers"."""
    })

    return chunks

def embed_text(text: str) -> list[float]:
    for model_name in EMBEDDING_MODELS:
        try:
            res = client.models.embed_content(
                model=model_name,
                contents=text
            )
            values = res.embeddings[0].values
            if values:
                return values
        except Exception as e:
            continue
    raise RuntimeError("Failed to generate embedding with all configured models")

def main():
    print("=== Equinox 2.0 Python Knowledge Base Generator ===")
    raw_data = load_equinox_content()
    chunks = build_chunks(raw_data)
    print(f"Extracted {len(chunks)} logical chunks from content.")

    for i, chunk in enumerate(chunks):
        print(f"[{i+1}/{len(chunks)}] Embedding '{chunk['title']}'...", end=" ", flush=True)
        embedding = embed_text(chunk["content"])
        chunk["embedding"] = embedding
        print(f"✓ ({len(embedding)} dims)")

    out_path = Path(__file__).parent / "knowledge_base.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(chunks, f, indent=2)

    stat = out_path.stat()
    print(f"\nKnowledge base saved to: {out_path}")
    print(f"Size: {stat.st_size / 1024:.1f} KB, Total chunks: {len(chunks)}")

if __name__ == "__main__":
    main()

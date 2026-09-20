# Phase 7 — Casting research (2026-09-20)

What the highest-converting creators in each of the four categories look like and how they present, distilled into the
casting direction now recorded in each `media/identities/*/IDENTITY.json` `casting` block. Owner's rule for this network (2026-09-20): the four creators are four different backgrounds — Black, mixed, white,
Latina — and every generated shot states it, because models default to white when unspecified.

## Cross-category conversion cues (apply to all four)
- **Direct eye contact, eyes on the upper-third line, slight headroom** — how the brain reads authority and trust on
  screen; the first 3 seconds decide the scroll. ([Captions](https://captions.ai/blog/how-to-make-a-talking-head-video-that-actually-looks-professional), [Reloop](https://reloop.so/blog/article/talking-head/))
- **Warm 45° key light, clean or softly-blurred background** — flat grey lighting "kills credibility instantly". Every
  reference slot is lit this way so downstream renders inherit it. ([Teleprompter.com](https://www.teleprompter.com/blog/what-is-a-talking-head-video))
- **Believable, not model-perfect.** Trust in advice/finance/health-adjacent categories stays anchored to human
  authenticity; AI faces rate trustworthy in lab studies but disclosed AI content is discounted, so the face must read
  as a real neighbour — visible pores, asymmetry, no plastic skin. Disclosure is mandatory on-screen/in-caption (FTC 2026), so the
  persona wins on usefulness, not on pretending. ([Playbella 2026 report](https://playbella.org/blog/2026-ai-influencer-landscape-report), [influencers-time](https://www.influencers-time.com/ai-influencer-likeness-disclosure-rules-for-2026-unveiled/), [ScienceDirect SLR](https://www.sciencedirect.com/science/article/pii/S0001691825008868))
- **2026 is the year educator / career / professional creators rise** — the "tells the truth without sugar-coating,
  and you believe following them works" posture. ([CreatorDB](https://creatordb.app/free-influencer-search-tool/top-creators-2026/education/), [Rolling Stone 25](https://www.rollingstone.com/culture/culture-lists/top-social-media-influencers-creators-2026-1235605189/))

## Marcus Vale — ambition / execution (A Player Mode)
- **Comparables:** Hamza (largest self-improvement channel; mindset + discipline), David Goggins (mental toughness),
  the "quarter-zip movement" — which spread first inside Black-American and diaspora communities around personal
  presentation and rejecting limiting stereotypes. ([influencerdiscoveries](https://influencerdiscoveries.com/blog/male-influencers/), [Wikipedia: Quarter-zip movement](https://en.wikipedia.org/wiki/Quarter-zip_movement))
- **What converts:** the calm operator who has done it, not the shouter. Athletic-lean, groomed, premium-casual;
  early-morning home office / city-walk settings signal "in motion".
- **Casting:** Black man, 34, deep brown skin, low fade with short waves, neat short beard, strong jaw, lean athletic
  build (not bodybuilder), calm intense eyes. Quarter-zip / overshirt (already in wardrobe).

## Nia Brooks — rental / credit approval prep (ApprovalPrep)
- **Correction (2026-09-20):** an earlier draft framed Nia as USCIS/immigration. ApprovalPrep is *approval* prep —
  first apartment, credit-challenged, recently denied, gig/self-employed income (`employees/nia_brooks/employee.json`
  ICPs). Immigration medical exams belong to Maya / Industry Guides.
- **Comparables:** the personal-finance "big sister" creators — Vivian Tu (Your Rich BFF: direct-to-camera, blazer,
  plain-spoken), Tori Dunlap (Her First $100K), Humphrey Yang — and the adulting-explainer wave of 2026. Credibility
  cues are professional-adjacent (blazer over a tee, tidy office, glasses) delivered as "one of us who read the fine
  print". ([Wikipedia: Vivian Tu](https://en.wikipedia.org/wiki/Vivian_Tu), [CreatorDB](https://creatordb.app/free-influencer-search-tool/top-creators-2026/education/))
- **Casting:** Mixed Black and Korean-American woman, 27, light-medium brown skin, long dark loose waves half pulled
  back, clear-framed glasses (trust cue), minimal gold studs, open expressive face. Blazer over plain tee; clean office
  with a bookshelf.

## Camille Rose — wedding planning (weddingchecklistpdf.com)
- **Comparables:** Chenai (@bychenai — Harper's Bazaar "top planner", refined, experience-led, classic techniques),
  Georgina Rose (straight-talking tips), Kash (honest about the stress of planning), Krystal Gardenia (free planning
  wisdom, etiquette Q&A). Planners convert on *organised calm*, not bridal-model perfection. ([Socially Powerful](https://sociallypowerful.com/influencer/wedding-influencers), [Plan In Love](https://www.planinlove.com/25-top-wedding-influencers-on-tiktok/), [Heepsy](https://www.heepsy.com/top-tiktok/wedding))
- **Casting:** White woman, 29, fair warm-toned skin with light freckles, honey-blonde sleek low bun (alt: soft
  waves), soft features, easy smile, tailored neutrals (cream, sage, camel), one delicate necklace. Bright studio with
  florals in soft focus.

## Maya Reyes — research-based explainers (Industry Guides)
- **Comparables:** Tefi Pessoa (the internet's "big sister" — explainers that became trusted real-life advice),
  Vivian Tu (direct-to-camera finance explainers, blazer, plain-spoken). The 2026 educator-creator wave. ([Rolling Stone](https://www.rollingstone.com/culture/culture-lists/top-social-media-influencers-creators-2026-1235605189/), [Wikipedia: Vivian Tu](https://en.wikipedia.org/wiki/Vivian_Tu))
- **Casting (owner revision 2026-09-20 — younger, more modelesque):** Latina woman (Mexican-American), 26, warm
  medium tan skin, long dark glossy waves, high cheekbones, full lips, editorial polish; fitted soft blazer over a ribbed
  crew neck; clean desk with notes and a lamp.

## Generation route
`npm run identities:generate` — `scripts/identity-references.mjs` inside the vault child (`OPENAI_IMAGE_API_KEY`,
credential `openai-ai-72b12455`, chosen by the owner 2026-09-20). `face_front` is generated from the casting block;
the other five slots are *edits* of that face so identity is locked to one generated person. Every file is hashed
into `references/manifest.json`; the contact sheet is `media/identities/CONTACT_SHEET.png`.

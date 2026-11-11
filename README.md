# Mindscape · ooca (ที่พักใจ)

Bring one thought. See it three ways. A check-in of about two minutes where three companions each look at the same thought through a different lens: mooca (psychology), Hin the rock (Stoic philosophy) and Bua the lotus (Buddhism, in everyday words). You choose the one that speaks to you, go deeper with it, and leave with a card and a next step sized to how heavy things are.

> Hypothetical design assignment for ooca. Not related to ooca's product plans. Brand assets are used only for this assignment.

## Problem & insight

Many people feel "off" but never take a first step toward care. Booking a psychologist feels like too much, and mental-health quizzes can feel clinical. Many Thais also cope through the temple or through philosophy before they would ever see a psychiatrist.

**Insight:** people don't know which way of looking at a worry will help until they see a few side by side. So Mindscape shows all three, briefly, and lets the person choose.

**Who it's for:** Thai working adults, roughly 22 to 35, busy and often tired, who would tap a link but would never search for "therapy".

## The experience

One illustrated landscape holds everything: mooca in the sky, Hin on a sandy hill, Bua in a pond on soft mint ground, all painted in the finish of ooca's new mooca art. The user's thought becomes a paper note that travels through the scene. Choosing a companion moves the camera, never the user, so it stays one place.

| Step | What happens |
|---|---|
| Landing | The landscape, one line, one button. ~2 minutes, anonymous, stays on the device |
| Thought | Pick one of eight common thoughts (in Thai or English) or write your own. Written thoughts are checked for crisis language |
| Three voices | Each companion says one line about the thought, in its own voice. Pick one, or have one chosen for you |
| A room (~75 s) | One companion, full depth (below). Door to card is about two minutes, most of it here |
| Before you go | "How long has this been with you?" Asked only when something was heavy |
| Closing card | One card, in the room's colour: what the room found (in the user's own choices and words), the room's quote and where the idea comes from (e.g. "Stoic philosophy · the roots of CBT"). Save as an image, or share it from a phone |
| Next step | Sized to how heavy it is: keep the card and carry on with the same friend in ooca Garden, or, when it's been heavy for weeks, talk to someone at ooca (with the 1323 line just below) |
| Did it help? | "Do you understand yourself a little better?" Yes, a little / Not really. One tap, no score |

### The three rooms

| | mooca · psychology | Hin · philosophy | Bua · Buddhism |
|---|---|---|---|
| Method | Rewriting the forecast (CBT and ACT) | A Stoic sitting | Notice, let go, be kind (mindfulness) |
| Name it | The weather this thought brings + a feeling word (naming a feeling softens it) | The stone and the story: what actually happened, apart from the judgement laid on it | Where you feel it in the body, and what it's like there (uncomfortable, neither, okay) |
| Look closer | Find the silver lining: what the worry says you care about (values, from ACT). mooca's cloud lights up at the edge | Split the stone: sort its pebbles into "mine to move" or "let it be" | Let it drift: hold the lamp for five slow breaths. The muddy pond clears and the note floats off across the water, a little further with each breath |
| Practice | Soften the forecast: tap the heavy words in the thought ("everyone", "never", "not good enough") and swap them for softer, truer ones; each names its thinking trap. Or start it more gently ("Part of me thinks…") | Turn it into a step: "mine to move" pebbles become stepping stones by Hin, and you choose how to step on them (courage, patience, honesty, kindness). What's in the way becomes the way | Pass kindness on: pick one wish, then hold to send it in widening circles (to me, someone I love, everyone). Each ripple reaches further across the landscape, to Hin, then mooca |
| Step back | The note in the landscape rewrites itself, and the sky clears a notch with each change | Rise above it: drag up and the camera climbs from Hin's ground to the whole landscape; at the top, "a year from now, how much will this matter?" | Nothing gets fixed. The thought is noticed, allowed, and let go |
| On the card | The softened thought, the old one crossed out, "because I care about…", the traps softened | What happened, mine to move, let it be, the virtue to step with, how much it matters from a year away + Epictetus, *Enchiridion* 1 | Where it's felt, the breaths, the wish and how far it reached |

Every room works on the thought itself, through its own lens: mooca changes the thought (a more balanced one), Hin changes what you do about it (a virtue and the long view), Bua changes nothing: you notice it, let it drift and pass kindness on. Each room has one physical act that *is* its practice: tap to soften (mooca), drag to sort and rise above it (Hin), hold to let go and to send kindness (Bua). mooca rewrites the thought and Hin separates fact from judgement, the Stoic move CBT later borrowed. The eight door thoughts have their heavy words marked by hand in both languages (Thai has no spaces to split on); a written thought is searched against a word list, and if nothing heavy is found it can still be started more gently. mooca's room keeps Inner Weather's language (weather, feeling words, the small step) but is not a mood check-in: battery and body moved out (the body belongs to Bua). The full Inner Weather check-in still lives at `?weather`.

### How the next step is chosen

- **Ask how long:** only when a signal is heavy: a rainy, foggy or stormy sky (mooca), "a lot" in a year (Hin), an uncomfortable feeling all over or in much of the body (Bua), or a written thought that tripped the crisis check.
- **Talk to someone at ooca:** heavy and lasting two weeks or more, or a written thought that tripped the crisis check. The next step shown is an ooca psychologist, with the 1323 line below; the ooca Garden poster still sits beside the card.
- **Keep this card:** everything else. The ooca Garden poster offers a way to carry on with the same friend.

Designed but switched off for now (`SHOW_SUGGESTIONS` in `src/rooms/Ending.tsx`): a small practice to do right away (mooca's small step, Hin's virtue, Bua's step on the path), and a "check in again tomorrow" nudge for heavy-but-recent.

## Design decisions

- **Taste three, go deep in one.** The comparison is the idea, but doing three rooms in a row would be long and repetitive. One shared door, then one room.
- **One landscape, one travelling note.** Continuity comes from place and object, not from copy.
- **One rhythm, borrowed from Inner Weather.** Every screen is one question, a few choices and a Next button, and a single four-part progress bar (thought, voices, room, card) runs the whole way without starting over. There is no separate room intro screen; picking a voice pans the camera, and Next goes straight in.
- **A method under every room.** Each room has the same shape (name it, look closer, practise, step back, keep a card) and a real practice where the interaction *is* the exercise: sorting is the dichotomy of control; holding still is what settles the water.
- **Developing ooca's new mooca.** mooca is ooca's own character in its new art style (a puffy cloud head, a small white body, the turquoise scarf), redrawn in code from the character sheet so it can wear every mood and weather the flow needs. It floats, as mooca always has here: legs hanging loose, a slow bob with a slight sway, a faint shadow on the hills far below.
- **A family, not a pile of mascots.** Hin and Bua keep their own shapes (one pebble with little feet; a lotus bud on its stem with a round leaf) and take on mooca's finish: soft painted light, no outlines, the same small oval eyes, thin smile and puffed cheeks. Each owns one accent from the ooca palette: Turquoise (mooca's scarf), Marigo, Flamingo. Buttons are always Blue 500. Scarves for Hin and Bua and a head-on-a-body Hin and Bua were tried and set aside (see `?sandbox`).
- **Quietly alive.** On the ground, Hin breathes and its sprout nods; Bua sways on the water, its leaf a beat behind, with a slow ring spreading from its stem. All motion stops when reduced motion is on.
- **Modern words, no religious imagery.** Bua's room comes from Buddhist practice (mindfulness, impermanence, loving-kindness) but uses no Pali, no scripture and no Buddha or monk imagery: it speaks through a lotus, a lamp, a pond and everyday Thai. It's also the one room where nothing gets fixed: you notice the thought, let it drift, and pass some kindness on.
- **Light day, keep the card. Heavy for weeks, talk to someone.** The offer of a psychologist is sized to what the room saw, so it reads as care, not a funnel.
- **From a free taste to the app.** Mindscape is the free two-minute taste on the web; ooca Garden, in the ooca app, is where the friends live, the habit grows and the paid plan sits, and it leads on to an ooca psychologist (the care ladder in the opportunity brief). On the ending page an ooca Garden poster takes the landscape's place beside the card; on phones the same poster sits under the card. It shows the chosen friend, Chat · Listen · Talk chips, and a phone that tours the app once (Garden home, chat, a lesson, talking to a psychologist) and comes to rest on the Garden home, where a lesson is matched to the thought (Hin with "I'm not good enough" offers "What's in your control"). Then the store buttons: one on a phone, both on a computer. It's there on every path; when someone has been struggling for weeks, the psychologist and 1323 come first in the next step.
- **The ending keeps the two panels.** The camera pulls back to the whole landscape for a moment, with the note stamped; then the landscape gives way to the ooca Garden poster, and the card and what to do now sit on the right.
- **One card, not two.** Each room used to end on its own card and the ending then showed another. Now a room ends at its last practice, and its findings become the one closing card. A "finish this sentence" step was tried before the card and removed: every room already puts the user's own words and choices on it, so the extra step only delayed the payoff.
- **No scores.** Like Inner Weather, nothing asks for a number or shows one back. An earlier version rated the thought 0–100% before and after; it read like a test, so it was removed.

## Safety

- "Need help now?" (1323, 1669, Samaritans) is in the header on every screen.
- Written thoughts are checked for crisis phrases in Thai and English (`atRisk` in `src/mindscape-content.ts`). English is matched on word roots, so "suicidal", "killing myself" and "ending my life" count as well as the base phrases; everyday phrases like "work is killing me" don't. A match opens the crisis sheet, keeps a care note with a 1323 button on the three-voices step, and makes the next step an ooca psychologist. It never blocks the user.
- "What's the point?" shows a gentle 1323 line.
- The closing screen always carries the 1323 line; it's quieter when nothing was heavy.

## Accessibility

- Every control works by keyboard. The pebble sort supports drag *or* tap-a-pebble-then-tap-a-side; the lamp works by holding Space or Enter.
- Each step moves focus to its heading. One `h1` per screen.
- Text meets WCAG AA contrast. The CI's turquoise text colour (#009688, 3.7:1 on white) is replaced by a deeper shade of the same hue (#00796b, 5.3:1).
- `prefers-reduced-motion` turns off decorative motion.
- Thai is detected automatically and can be switched in the header; all copy is bilingual.
- Checked at four phone sizes (360–430 px wide): on shorter screens the landscape gives up height so each step's answers show without scrolling, and content that appears after a tap scrolls into view clear of the Next bar.

## Stakeholder notes

- **Clinical team:** review all copy, the crisis phrases and the next-step thresholds.
- **Mindfulness or Dhamma advisor:** check that Bua's plain-language version stays true to the practice it comes from, especially the kindness wishes.
- **Thai copy:** written for this assignment; have a native writer polish it.
- **Legal / PDPA:** nothing leaves the device. mooca's room keeps the last seven skies in `localStorage`. Add consent if the next step later links to booking.
- **Brand:** Blue 500 with white text is 4.4:1, just under AA for 16px text; worth raising with the brand team. mooca is redrawn in code from ooca's character sheet, floating rather than standing: confirm the redraw and the pose with the brand team.

## Run locally

```bash
npm install
npm run dev
```

`npm run build` outputs a static site to `dist/`. Live at [ooca-mindscape.vercel.app](https://ooca-mindscape.vercel.app); pushing to `main` deploys it on Vercel.

| URL | Page |
|---|---|
| `/` | Mindscape |
| `/?heal` | ooca Garden (concept): the ooca app feature Mindscape leads into. Talk to mooca, Hin and Bua any time, audio lessons and courses, an ooca psychologist when needed; shown on phones |
| `/?promo` | Promo page: Mindscape announced inside ooca's world (what it is, the three friends, what you leave with, try it) |
| `/?sheet` | Companion identity sheet (design review) |
| `/?sandbox` | Character exploration (design review): the new mooca art style, the options tried for Hin, Bua and a floating mooca, the background options, and the earlier flat look for comparison |
| `/?weather` | The original Inner Weather check-in |
| `/board/index.html` | The presentation board for the Figma submission (9 pages, 1920 px wide, including the character update); PNG exports in `public/board/export/`. With `npm run dev` running, `node scripts/capture-board.mjs` re-takes its screenshots from the app and re-renders the pages |

## Structure

```
src/
  Mindscape.tsx           the flow: landing, door, three voices, room entry, wiring
  Heal.tsx                the ooca Garden page · heal-content.ts (copy, lesson picks) · heal.css · components/HealPhones.tsx
  Promo.tsx               the earlier promo page, kept as a backup · promo-content.ts · promo.css
  mindscape-content.ts    door copy (TH/EN), thoughts, voices, crisis phrases, next steps
  mindscape.css           Mindscape styles (on top of styles.css, the ooca CI tokens)
  content.ts              Inner Weather copy and report rules (used by mooca's room)
  rooms/
    MoocaRoom.tsx         rewriting the forecast · Soften.tsx · mooca-content.ts
    HinRoom.tsx           the Stoic sitting · PebbleSort.tsx · Rise.tsx · hin-content.ts
    BuaRoom.tsx           notice, let go, be kind · BodyMap.tsx · Lamp.tsx · KindSend.tsx · bua-content.ts
    Ending.tsx            before you go, make it yours, the card, next step · end-card.tsx (each room's card)
    StepTop.tsx           back + progress row, and focus on each new step
  components/
    Landscape.tsx         the scene (soft by default; the earlier flat look kept for comparison), camera, travelling note (kept in view on short screens), muddy pond
    HealPoster.tsx        the ooca Garden poster on the ending
    reveal.ts             scrolls content that appears after a tap into view
    Mooca.tsx             mooca in ooca's new art style: weather faces and effects, floating
    companions/           Hin (Rock), Bua (Lotus), the shared drawing kit (soft.tsx), Face and Avatar
  sandbox/                design drafts; legacy/ keeps the earlier flat characters
scripts/
  capture-board.mjs       re-takes the board's screenshots and page images from the running app
```

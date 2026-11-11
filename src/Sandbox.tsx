import { useState, type CSSProperties } from 'react'
import type { Mood } from './components/companions/Face'
import { HIN_VARIANTS } from './sandbox/HinVariants'
import { HIN_STOIC } from './sandbox/HinStoic'
import { HIN_RIVER } from './sandbox/HinRiver'
import { HIN_CORNERS } from './sandbox/HinCorners'
import { HIN_IDEAS } from './sandbox/HinIdeas'
import { HIN_STACKS } from './sandbox/HinStacks'
import { HIN_MOODS, HIN_MOODS_V } from './sandbox/HinMoods'
import { BUA_VARIANTS } from './sandbox/BuaVariants'
import { BUA_LOTUS } from './sandbox/BuaLotus'
import Finalists from './sandbox/Finalists'
import Expressions from './sandbox/Expressions'
import Lineup, { LineupV2, LineupV3 } from './sandbox/Lineup'
import InLandscape, { Grounds } from './sandbox/InLandscape'
import { BUA_SOFT, HIN_SOFT, MOOCA_FLOAT } from './sandbox/SoftFamily'
import './sandbox.css'

const MOODS: Mood[] = ['calm', 'happy', 'listening', 'concerned']

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-')

// What the research round turned up, and where each idea shows up
const FINDINGS = [
  {
    title: 'Baby-schema proportions',
    body: 'Round forms, a big forehead and the face set low read as cute fastest. Kawaii studies tie this to the Kindchenschema.',
    used: 'Hin E, Bua E',
    href: 'https://knepublishing.com/index.php/KnE-Social/article/view/7592',
  },
  {
    title: 'A silhouette that reads small',
    body: 'Mascot guides stress a distinctive outline that still works at icon size. A cute rock can look like every other rock without one trait of its own.',
    used: 'Hin F (quartz band), Bua G (raised leaf)',
    href: 'https://www.starrocks.io/blog/starrocks-new-mascot-the-inside-scoop/',
  },
  {
    title: 'Simple, symmetrical, about three heads tall',
    body: 'Yuru-chara research finds simple symmetrical designs do best, and suggests keeping proportions within about three heads.',
    used: 'Hin G (three stones), Bua F',
    href: 'https://publikasi2.dinus.ac.id/index.php/andharupa/article/download/4379/2198',
  },
  {
    title: 'Bud to bloom, mud to flower',
    body: 'In Thai Buddhist symbolism, buds and full blooms stand for stages of learning. Openness is a natural mood dial.',
    used: 'Bua F (crown lifts), every Bua’s petals',
    href: 'https://thailex.info/THAILEX/THAILEXENG/LEXICON/Thailand%20Lexicon%20-%20lotus%20(Nelumbo%20nucifera).htm',
  },
  {
    title: 'Soft, simplified Thai temple creatures',
    body: 'Kawaii, marshmallow-like takes on Thai mythical creatures spread widely online: local subjects, simplified and softened.',
    used: 'Bua E',
    href: 'https://www.bangkokpost.com/opinion/opinion/2033691/himmapan-marshmallow',
  },
]

type Variant =
  | (typeof HIN_VARIANTS)[number]
  | (typeof HIN_STOIC)[number]
  | (typeof HIN_RIVER)[number]
  | (typeof HIN_CORNERS)[number]
  | (typeof HIN_IDEAS)[number]
  | (typeof HIN_STACKS)[number]
  | (typeof HIN_MOODS)[number]
  | (typeof HIN_MOODS_V)[number]
  | (typeof BUA_VARIANTS)[number]
  | (typeof BUA_LOTUS)[number]
  | (typeof HIN_SOFT)[number]
  | (typeof BUA_SOFT)[number]
  | (typeof MOOCA_FLOAT)[number]

function Group({
  title,
  thai,
  intro,
  accent,
  tint,
  variants,
  pick,
  onPick,
}: {
  title: string
  thai: string
  intro?: string
  accent: string
  tint: string
  variants: Variant[]
  pick: string | null
  onPick: (k: string) => void
}) {
  return (
    <section className="sbx__group" aria-labelledby={`g-${slug(title)}`}>
      <h2 id={`g-${slug(title)}`}>
        {title} <span lang="th">{thai}</span>
      </h2>
      {intro && <p className="sbx__intro">{intro}</p>}
      <div className="sbx__grid">
        {variants.map(({ key, name, note, Comp, isNew }) => (
          <button
            key={key}
            type="button"
            className="sbx__card"
            aria-pressed={pick === key}
            onClick={() => onPick(key)}
            style={{ '--accent': accent, '--tint': tint } as CSSProperties}
          >
            <span className="sbx__badge">{key}</span>
            {isNew && <span className="sbx__new">New</span>}
            <span className="sbx__hero">
              <Comp mood="calm" size={190} />
            </span>
            <span className="sbx__name">{name}</span>
            <span className="sbx__note">{note}</span>
            <span className="sbx__moods">
              {MOODS.map((m) => (
                <span key={m}>
                  <Comp mood={m} size={64} />
                  <small>{m}</small>
                </span>
              ))}
            </span>
          </button>
        ))}
      </div>
    </section>
  )
}

export default function Sandbox() {
  const [hin, setHin] = useState<string | null>(null)
  const [bua, setBua] = useState<string | null>(null)
  const [mooca, setMooca] = useState<string | null>(null)

  return (
    <div className="sbx">
      <header className="sbx__top">
        <span className="logo-word">ooca</span>
        <span className="brand__divider" aria-hidden="true" />
        <span className="sbx__product">Mindscape · Character sandbox</span>
      </header>
      <main className="sbx__main">
        <p className="sbx__lede">Several takes on each companion, shown in all four moods. Tap one of each to pick it.</p>
        <Grounds />
        <InLandscape />
        <Lineup hin={hin} bua={bua} />
        <LineupV2 />
        <LineupV3 />
        <Group
          title="mooca · Floating options"
          thai="มูก้า"
          intro="Four more ways for the new mooca to float, without legs dangling below it. Each bobs slowly over its shadow."
          accent="#00A99D"
          tint="#ECEEF5"
          variants={MOOCA_FLOAT}
          pick={mooca}
          onPick={setMooca}
        />
        <Group
          title="Hin · New style"
          thai="หิน"
          intro="Hin redrawn to the new mooca's rules, with a Marigo scarf."
          accent="#F9A000"
          tint="#FDF3DC"
          variants={HIN_SOFT}
          pick={hin}
          onPick={setHin}
        />
        <Group
          title="Bua · New style"
          thai="บัว"
          intro="Bua redrawn to the new mooca's rules. Its petals still open with the mood, bud to bloom."
          accent="#EF7773"
          tint="#FDECEB"
          variants={BUA_SOFT}
          pick={bua}
          onPick={setBua}
        />
        <Expressions />
        <section className="sbx__research" aria-labelledby="research">
          <h2 id="research">What the research says</h2>
          <ul>
            {FINDINGS.map((f) => (
              <li key={f.title}>
                <b>{f.title}</b>
                <p>{f.body}</p>
                <span>
                  Used in: {f.used} ·{' '}
                  <a href={f.href} target="_blank" rel="noreferrer">
                    source
                  </a>
                </span>
              </li>
            ))}
          </ul>
        </section>
        <Group
          title="Hin V · How the mood changes"
          thai="หิน"
          intro="The same four mood ideas on Hin V, the smooth pebble with soft corners. The big previews loop through the moods."
          accent="#F9A000"
          tint="#FDF3DC"
          variants={HIN_MOODS_V}
          pick={hin}
          onPick={setHin}
        />
        <Group
          title="Hin · How the mood changes"
          thai="หิน"
          intro="Hin (the pebble) with a mood that changes the character itself, the way Bua goes from bud to bloom. The big previews loop through the moods."
          accent="#F9A000"
          tint="#FDF3DC"
          variants={HIN_MOODS}
          pick={hin}
          onPick={setHin}
        />
        <Finalists pick={hin} onPick={setHin} />
        <Group
          title="Hin · Stacked stones options"
          thai="หิน"
          intro="More takes on G. Balance is the Stoic idea: the stack holds as long as each stone sits steady, and the head wobbles when Hin is worried."
          accent="#F9A000"
          tint="#FDF3DC"
          variants={HIN_STACKS}
          pick={hin}
          onPick={setHin}
        />
        <Group
          title="Hin · Fresh ideas"
          thai="หิน"
          intro="A clean start. Each idea comes from a piece of philosophy’s own story (the Stoa, the bust, Athena’s owl, Diogenes’ lamp, Marcus’ notebook, mended cracks) instead of from earlier sketches."
          accent="#F9A000"
          tint="#FDF3DC"
          variants={HIN_IDEAS}
          pick={hin}
          onPick={setHin}
        />
        <Group
          title="Hin · Weathered pebble, more corners"
          thai="หิน"
          intro="Hin I (weathered pebble) with corners added at three strengths. Same stone, lit top, shaded side and cracks."
          accent="#F9A000"
          tint="#FDF3DC"
          variants={HIN_CORNERS}
          pick={hin}
          onPick={setHin}
        />
        <Group
          title="Hin · River stone options"
          thai="หิน"
          intro="More takes on A, the river stone. Each changes one idea: the face, the setting, a signature mark, the brows, or the proportions."
          accent="#F9A000"
          tint="#FDF3DC"
          variants={HIN_RIVER}
          pick={hin}
          onPick={setHin}
        />
        <Group
          title="Hin · the Stoic rock"
          thai="หิน"
          intro="Rethink: “Be like the headland the waves keep breaking against. It stands firm, and the water calms around it.” (Marcus Aurelius, Meditations 4.49). Heavy, grounded, nearly still, with a small emotional range."
          accent="#F9A000"
          tint="#FDF3DC"
          variants={HIN_STOIC}
          pick={hin}
          onPick={setHin}
        />
        <Group title="Hin · earlier takes" thai="หิน" accent="#F9A000" tint="#FDF3DC" variants={HIN_VARIANTS} pick={hin} onPick={setHin} />
        <Group
          title="Bua · True lotus options"
          thai="บัว"
          intro="More takes on G. A true lotus (Nelumbo) rises on its own stem and holds its round leaves up above the water, unlike a water lily."
          accent="#EF7773"
          tint="#FDECEB"
          variants={BUA_LOTUS}
          pick={bua}
          onPick={setBua}
        />
        <Group title="Bua · earlier takes" thai="บัว" accent="#EF7773" tint="#FDECEB" variants={BUA_VARIANTS} pick={bua} onPick={setBua} />
      </main>
      <footer className="sbx__picks" aria-live="polite">
        <span>
          Your picks: <b>mooca {mooca ?? '–'}</b> · <b>Hin {hin ?? '–'}</b> · <b>Bua {bua ?? '–'}</b>
        </span>
        <span className="sbx__hint">Tell Claude your picks, or mix them, e.g. "Hin C, but with B's colour".</span>
      </footer>
    </div>
  )
}

import { useState, type CSSProperties, type ReactNode } from 'react'
import Mooca from './components/Mooca'
import Rock from './components/companions/Rock'
import Lotus from './components/companions/Lotus'
import Landscape, { type Focus } from './components/Landscape'
import type { Mood } from './components/companions/Face'
import type { Weather } from './content'
import './sheet.css'

const MOODS: Mood[] = ['calm', 'happy', 'listening', 'concerned']

// mooca's moods already come from its weather faces
const MOOCA_MOOD: Record<Mood, Weather | null> = {
  calm: null,
  happy: 'sunny',
  listening: 'partly',
  concerned: 'rainy',
}

interface Companion {
  key: 'mooca' | 'rock' | 'lotus'
  name: string
  thai: string
  place: string
  lens: string
  method: string
  accent: { name: string; hex: string; tint: string }
  motion: string
  voice: string
  sayEn: string
  sayTh: string
  draw: (mood: Mood, size: number) => ReactNode
}

const COMPANIONS: Companion[] = [
  {
    key: 'mooca',
    name: 'mooca',
    thai: 'มูก้า',
    place: 'Sky',
    lens: 'Psychology',
    method: 'Rewriting the forecast',
    accent: { name: 'Turquoise 500', hex: '#00C4B3', tint: '#E0F8F6' },
    motion: 'Floats and bobs. Weather moves around it.',
    voice: 'A warm friend.',
    sayEn: 'Rain is allowed here. Let’s see what your sky looks like.',
    sayTh: 'ที่นี่ฝนตกได้นะ ลองมาดูท้องฟ้าในใจคุณกัน',
    draw: (m, s) => <Mooca weather={MOOCA_MOOD[m]} size={s} effects={false} />,
  },
  {
    key: 'rock',
    name: 'Hin',
    thai: 'หิน',
    place: 'Earth',
    lens: 'Philosophy',
    method: 'A Stoic sitting',
    accent: { name: 'Marigo 500', hex: '#F9A000', tint: '#FDF3DC' },
    motion: 'Barely moves. Warms like a sunlit stone: cool blue-grey with a small crack when worried, a flowering sprout when happy.',
    voice: 'Calm, few words, dry humour.',
    sayEn: 'Heavy thought. Let’s turn it over and see which side is yours.',
    sayTh: 'ความคิดนี้หนักนะ ลองพลิกดูกันว่าด้านไหนเป็นของเรา',
    draw: (m, s) => <Rock mood={m} size={s} />,
  },
  {
    key: 'lotus',
    name: 'Bua',
    thai: 'บัว',
    place: 'Water',
    lens: 'Buddhism',
    method: 'Notice, let go, be kind',
    accent: { name: 'Flamingo 500', hex: '#EF7773', tint: '#FDECEB' },
    motion: 'Bud to bloom: worry closes the bud, happiness opens it fully. A true lotus, its leaf held above the water.',
    voice: 'Gentle, slow, a little poetic.',
    sayEn: 'Mud is where lotuses begin. Let’s sit with it for one breath.',
    sayTh: 'โคลนคือจุดเริ่มต้นของดอกบัว ลองอยู่กับมันสักหนึ่งลมหายใจ',
    draw: (m, s) => <Lotus mood={m} size={s} />,
  },
]

const CAMERA_OPTIONS: { key: Focus; label: string }[] = [
  { key: 'all', label: 'Whole scene' },
  { key: 'sky', label: 'Sky · mooca' },
  { key: 'earth', label: 'Earth · Hin' },
  { key: 'water', label: 'Water · Bua' },
]

const TOKENS = [
  { name: 'Turquoise 500', hex: '#00C4B3', use: 'Brand, mooca' },
  { name: 'Blue 500', hex: '#1F77DF', use: 'Every action button' },
  { name: 'Marigo 500', hex: '#F9A000', use: 'Hin, earth' },
  { name: 'Flamingo 500', hex: '#EF7773', use: 'Bua, water' },
  { name: 'Guava 500', hex: '#8AD866', use: 'Leaves, life' },
  { name: 'Face ink', hex: '#2E4E8F', use: 'All faces' },
]

export default function IdentitySheet() {
  const [focus, setFocus] = useState<Focus>('all')
  const [mood, setMood] = useState<Mood>('calm')

  return (
    <div className="idsheet">
      <header className="idsheet__top">
        <span className="logo-word">ooca</span>
        <span className="brand__divider" aria-hidden="true" />
        <span className="idsheet__product">Mindscape · ที่พักใจ</span>
        <span className="idsheet__tag">Identity sheet</span>
      </header>

      <main className="idsheet__main">
        <section className="idsheet__hero">
          <div className="idsheet__hero-copy">
            <p className="idsheet__kicker">Three companions. One landscape. Your thought.</p>
            <h1>One family, three ways of seeing</h1>
            <p className="idsheet__lede">
              mooca, Hin and Bua share one drawing system and one ooca frame. Each owns a place in the landscape, one accent
              colour from the ooca palette, and a personality. Choosing a companion moves the camera, never the user, so the
              whole experience stays one place.
            </p>
            <div className="idsheet__controls" role="group" aria-label="Camera">
              {CAMERA_OPTIONS.map((o) => (
                <button key={o.key} type="button" className="chip" aria-pressed={focus === o.key} onClick={() => setFocus(o.key)}>
                  {o.label}
                </button>
              ))}
            </div>
            <div className="idsheet__controls" role="group" aria-label="Mood">
              {MOODS.map((m) => (
                <button key={m} type="button" className="chip chip--quiet" aria-pressed={mood === m} onClick={() => setMood(m)}>
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div className="idsheet__scene">
            <Landscape focus={focus} moocaWeather={MOOCA_MOOD[mood]} rockMood={mood} lotusMood={mood} />
          </div>
        </section>

        <section aria-labelledby="companions">
          <h2 id="companions" className="idsheet__h2">The companions</h2>
          <div className="companions">
            {COMPANIONS.map((c) => (
              <article
                key={c.key}
                className="companion"
                style={{ '--accent': c.accent.hex, '--tint': c.accent.tint } as CSSProperties}
              >
                <div className="companion__hero">{c.draw('calm', 180)}</div>
                <div className="companion__name">
                  <h3>{c.name}</h3>
                  <span lang="th">{c.thai}</span>
                </div>
                <p className="companion__lens">
                  {c.place} · {c.lens}
                  <span>{c.method}</span>
                </p>
                <ul className="companion__moods" aria-label={`${c.name} moods`}>
                  {MOODS.map((m) => (
                    <li key={m}>
                      {c.draw(m, 72)}
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
                <dl className="companion__facts">
                  <div>
                    <dt>Accent</dt>
                    <dd>
                      <i className="swatch" style={{ background: c.accent.hex }} /> {c.accent.name}
                    </dd>
                  </div>
                  <div>
                    <dt>Motion</dt>
                    <dd>{c.motion}</dd>
                  </div>
                  <div>
                    <dt>Voice</dt>
                    <dd>{c.voice}</dd>
                  </div>
                </dl>
                <blockquote className="companion__say">
                  <p>“{c.sayEn}”</p>
                  <p lang="th">“{c.sayTh}”</p>
                </blockquote>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="shared" className="shared">
          <h2 id="shared" className="idsheet__h2">The shared ooca layer</h2>
          <div className="shared__grid">
            <div className="shared__card">
              <h3>Colour</h3>
              <ul className="tokens">
                {TOKENS.map((t) => (
                  <li key={t.hex}>
                    <i className="swatch swatch--lg" style={{ background: t.hex }} />
                    <span>
                      <b>{t.name}</b>
                      {t.hex} · {t.use}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="shared__card">
              <h3>Type and controls</h3>
              <p className="type-en">Mindscape</p>
              <p className="type-th" lang="th">
                ที่พักใจ
              </p>
              <p className="type-note">Gotham Rounded (Nunito stand-in) · Prompt for Thai</p>
              <div className="shared__controls">
                <button type="button" className="btn btn--primary">
                  Bring a thought
                </button>
                <button type="button" className="chip" aria-pressed="true">
                  I’m not good enough
                </button>
              </div>
            </div>
            <div className="shared__card">
              <h3>Drawing rules</h3>
              <ol className="rules">
                <li>Flat fills. Depth comes from one shade copy offset −5, +7. No outlines on bodies.</li>
                <li>Faces in navy #2E4E8F: 4px round strokes, r5 dot eyes, soft pink cheeks.</li>
                <li>Stubby rounded limbs with a 3px shade stroke.</li>
                <li>One small accessory carries the mood: mooca’s weather, Hin’s warmth, how far Bua has bloomed.</li>
                <li>Each companion owns one ooca accent. Buttons are always Blue 500.</li>
              </ol>
              <h3 className="rules__dont">Never</h3>
              <ul className="rules">
                <li>Buddha or monk imagery, or sacred symbols as decoration.</li>
                <li>Colours outside the ooca palette.</li>
                <li>Dark outlines or gradients on characters.</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

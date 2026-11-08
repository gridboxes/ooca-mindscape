import type { Lang, Weather } from '../content'
import type { Theme } from '../mindscape-content'

type T = Record<Lang, string>

// mooca's room: rewriting the forecast, in three moves from psychology.
// 1 name the weather the thought brings (naming a feeling softens it),
// 2 find the silver lining: the value the worry hangs over (from ACT),
// 3 soften the forecast: tap the heavy words and swap them for softer, truer ones
//   (cognitive restructuring, from CBT). The thinking trap is learned in passing, on the word.

export type Trap = 'allOrNothing' | 'label' | 'fortune' | 'should' | 'compare' | 'magnify' | 'feelings' | 'mindReading'

export const traps: Record<Trap, T> = {
  allOrNothing: { en: 'All-or-nothing word', th: 'คำแบบขาวหรือดำ' },
  label: { en: 'A label for all of you', th: 'ป้ายที่แปะทั้งตัว' },
  fortune: { en: 'Predicting the worst', th: 'ทำนายเรื่องร้าย' },
  should: { en: 'A “should” rule', th: 'กฎ “ต้อง” “ควร”' },
  compare: { en: 'An unfair comparison', th: 'การเทียบแบบไม่แฟร์' },
  magnify: { en: 'Making it bigger', th: 'ขยายให้ใหญ่กว่าจริง' },
  feelings: { en: 'A feeling taken as fact', th: 'เชื่อความรู้สึกว่าเป็นความจริง' },
  mindReading: { en: 'Guessing what others think', th: 'เดาใจคนอื่น' },
}

/** A thought split into plain text and heavy words that can be swapped */
export type Part = string | { word: string; trap: Trap; swaps: string[] }

// The heavy words in each of the door's eight thoughts, marked by hand in both languages
// (Thai has no spaces, so words can't be found by splitting). Same order as `thoughts`.
export const presetParts: Record<Lang, Part[]>[] = [
  // I'm not good enough
  {
    en: ['I’m ', { word: 'not good enough', trap: 'label', swaps: ['still learning', 'growing', 'enough for today'] }],
    th: ['ฉันยัง', { word: 'ดีไม่พอ', trap: 'label', swaps: ['เรียนรู้อยู่', 'เติบโตอยู่', 'ดีพอสำหรับวันนี้'] }],
  },
  // What if it all goes wrong?
  {
    en: [
      'What if ',
      { word: 'it all', trap: 'allOrNothing', swaps: ['one part', 'something'] },
      ' ',
      { word: 'goes wrong', trap: 'fortune', swaps: ['is hard', 'doesn’t go to plan'] },
      '?',
    ],
    th: ['ถ้ามัน', { word: 'พัง', trap: 'fortune', swaps: ['ไม่เป็นไปตามแผน', 'ยากกว่าที่คิด'] }, 'ขึ้นมาล่ะ'],
  },
  // I can't stop overthinking
  {
    en: [
      'I ',
      { word: 'can’t stop', trap: 'allOrNothing', swaps: ['find it hard to stop', 'can slowly stop'] },
      ' ',
      { word: 'overthinking', trap: 'label', swaps: ['turning this over', 'thinking about this'] },
    ],
    th: [
      'หยุด',
      { word: 'คิดมาก', trap: 'label', swaps: ['คิดเรื่องนี้', 'ทบทวนเรื่องนี้'] },
      { word: 'ไม่ได้', trap: 'allOrNothing', swaps: ['ได้ทีละนิด', 'ยากหน่อย'] },
    ],
  },
  // I'm tired of everything
  {
    en: ['I’m tired of ', { word: 'everything', trap: 'allOrNothing', swaps: ['a lot right now', 'this week', 'some things'] }],
    th: ['เหนื่อยกับ', { word: 'ทุกอย่าง', trap: 'allOrNothing', swaps: ['หลายอย่างตอนนี้', 'สัปดาห์นี้', 'บางเรื่อง'] }],
  },
  // Everyone's ahead of me
  {
    en: [
      { word: 'Everyone’s', trap: 'allOrNothing', swaps: ['Some people are', 'A few people seem'] },
      ' ',
      { word: 'ahead of me', trap: 'compare', swaps: ['on a different path', 'at a different point'] },
    ],
    th: [
      { word: 'ใครๆ ก็', trap: 'allOrNothing', swaps: ['บางคน', 'คนที่เราเห็น'] },
      { word: 'ไปไกลกว่าเรา', trap: 'compare', swaps: ['อยู่คนละเส้นทางกับเรา', 'อยู่คนละจังหวะกับเรา'] },
    ],
  },
  // Nobody really gets me
  {
    en: [{ word: 'Nobody', trap: 'allOrNothing', swaps: ['Not everyone', 'Not everyone yet'] }, ' really gets me'],
    th: [{ word: 'ไม่มีใคร', trap: 'allOrNothing', swaps: ['ไม่ใช่ทุกคนที่', 'ยังไม่ค่อยมีใคร'] }, 'เข้าใจเราจริงๆ'],
  },
  // I keep replaying a mistake
  {
    en: [
      'I ',
      { word: 'keep replaying', trap: 'magnify', swaps: ['am learning from', 'sometimes think about'] },
      ' a ',
      { word: 'mistake', trap: 'label', swaps: ['hard moment', 'mistake I can grow from'] },
    ],
    th: [{ word: 'วนคิดถึง', trap: 'magnify', swaps: ['เรียนรู้จาก', 'ยังนึกถึงบ้าง'] }, 'เรื่องที่พลาดไป'],
  },
  // What's the point?
  {
    en: ['What’s ', { word: 'the point', trap: 'feelings', swaps: ['one thing I still enjoy', 'worth doing today'] }, '?'],
    th: ['ทำไป', { word: 'เพื่ออะไร', trap: 'feelings', swaps: ['เพื่อสิ่งเล็กๆ ที่ยังมีความหมาย', 'เพื่อใครสักคนที่สำคัญ'] }],
  },
]

// Heavy words to look for in a written thought, longest first so "no one" wins over "no"
export const lexicon: Record<Lang, { match: string; trap: Trap; swaps: string[] }[]> = {
  en: [
    { match: 'not good enough', trap: 'label', swaps: ['still learning', 'growing'] },
    { match: 'everything', trap: 'allOrNothing', swaps: ['some things', 'a lot right now'] },
    { match: 'everyone', trap: 'allOrNothing', swaps: ['some people', 'a few people'] },
    { match: 'nobody', trap: 'allOrNothing', swaps: ['not everyone', 'not many people'] },
    { match: 'no one', trap: 'allOrNothing', swaps: ['not everyone', 'not many people'] },
    { match: 'nothing', trap: 'allOrNothing', swaps: ['not much right now', 'less than I hoped'] },
    { match: 'always', trap: 'allOrNothing', swaps: ['sometimes', 'often'] },
    { match: 'never', trap: 'allOrNothing', swaps: ['not yet', 'not often'] },
    { match: 'can’t', trap: 'allOrNothing', swaps: ['find it hard to', 'can’t yet'] },
    { match: "can't", trap: 'allOrNothing', swaps: ['find it hard to', "can't yet"] },
    { match: 'should', trap: 'should', swaps: ['would like to', 'could'] },
    { match: 'must', trap: 'should', swaps: ['want to', 'could'] },
    { match: 'failure', trap: 'label', swaps: ['someone who failed at one thing', 'still learning'] },
    { match: 'useless', trap: 'label', swaps: ['struggling right now', 'still learning'] },
    { match: 'stupid', trap: 'label', swaps: ['tired', 'human'] },
    { match: 'ruined', trap: 'magnify', swaps: ['made harder', 'set back'] },
    { match: 'worst', trap: 'magnify', swaps: ['hard', 'not great'] },
    { match: 'hate', trap: 'feelings', swaps: ['struggle with', 'don’t like'] },
  ],
  th: [
    { match: 'ไม่มีใคร', trap: 'allOrNothing', swaps: ['ไม่ใช่ทุกคนที่', 'ยังไม่ค่อยมีใคร'] },
    { match: 'ทุกอย่าง', trap: 'allOrNothing', swaps: ['บางอย่าง', 'หลายอย่างตอนนี้'] },
    { match: 'ทุกคน', trap: 'allOrNothing', swaps: ['บางคน', 'หลายคน'] },
    { match: 'ไม่เคย', trap: 'allOrNothing', swaps: ['ยังไม่ค่อย', 'ไม่บ่อย'] },
    { match: 'ตลอด', trap: 'allOrNothing', swaps: ['บางครั้ง', 'บ่อยๆ'] },
    { match: 'ไม่ได้', trap: 'allOrNothing', swaps: ['ยากหน่อย', 'ได้ทีละนิด'] },
    { match: 'ล้มเหลว', trap: 'label', swaps: ['พลาดไปครั้งหนึ่ง', 'ยังเรียนรู้อยู่'] },
    { match: 'ไม่ได้เรื่อง', trap: 'label', swaps: ['กำลังลำบาก', 'ยังเรียนรู้อยู่'] },
    { match: 'ดีไม่พอ', trap: 'label', swaps: ['ยังเรียนรู้อยู่', 'กำลังเติบโต'] },
    { match: 'ควร', trap: 'should', swaps: ['อยากจะ', 'อาจจะ'] },
    { match: 'พัง', trap: 'magnify', swaps: ['ยากขึ้น', 'สะดุด'] },
    { match: 'แย่ที่สุด', trap: 'magnify', swaps: ['ยาก', 'ไม่ค่อยดี'] },
    { match: 'เกลียด', trap: 'feelings', swaps: ['ไม่ชอบ', 'รับมือยาก'] },
  ],
}

/** Find the heavy words in a written thought, so they can be softened like the preset ones */
export function findParts(text: string, lang: Lang): Part[] {
  const lower = text.toLowerCase()
  const words = [...lexicon[lang]].sort((a, b) => b.match.length - a.match.length)
  const hits: { at: number; end: number; trap: Trap; swaps: string[] }[] = []
  for (const w of words) {
    let from = 0
    for (;;) {
      const at = lower.indexOf(w.match, from)
      if (at < 0) break
      const end = at + w.match.length
      // English words only count whole; Thai has no spaces to check against
      const whole = lang === 'th' || (!/\w/.test(lower[at - 1] ?? '') && !/\w/.test(lower[end] ?? ''))
      if (whole && !hits.some((h) => at < h.end && end > h.at)) hits.push({ at, end, trap: w.trap, swaps: w.swaps })
      from = end
    }
  }
  hits.sort((a, b) => a.at - b.at)
  const parts: Part[] = []
  let i = 0
  for (const h of hits) {
    if (h.at > i) parts.push(text.slice(i, h.at))
    parts.push({ word: text.slice(h.at, h.end), trap: h.trap, swaps: h.swaps })
    i = h.end
  }
  if (i < text.length) parts.push(text.slice(i))
  return parts
}

// Gentler ways in, for any thought: it becomes a thought you're having, not a fact
export const prefixes: T[] = [
  { en: 'Right now, it feels like', th: 'ตอนนี้รู้สึกเหมือนว่า' },
  { en: 'Part of me thinks', th: 'ส่วนหนึ่งในใจคิดว่า' },
  { en: 'I’m having the thought that', th: 'ฉันกำลังมีความคิดว่า' },
]

// The silver lining: what each kind of worry usually hangs over
export const values: Record<Theme, T[]> = {
  worth: [
    { en: 'doing good work', th: 'การทำงานให้ดี' },
    { en: 'growing as a person', th: 'การได้เติบโต' },
    { en: 'being someone people can count on', th: 'การเป็นคนที่คนอื่นพึ่งพาได้' },
  ],
  fear: [
    { en: 'the people and plans that matter to me', th: 'คนและเรื่องที่สำคัญกับฉัน' },
    { en: 'doing things well', th: 'การทำสิ่งต่างๆ ให้ดี' },
    { en: 'feeling safe and steady', th: 'ความมั่นคงในชีวิต' },
  ],
  overthink: [
    { en: 'getting things right', th: 'การทำสิ่งต่างๆ ให้ถูกต้อง' },
    { en: 'the people involved', th: 'คนที่เกี่ยวข้อง' },
    { en: 'understanding what happened', th: 'การเข้าใจสิ่งที่เกิดขึ้น' },
  ],
  tired: [
    { en: 'looking after people', th: 'การดูแลคนอื่น' },
    { en: 'doing my part', th: 'การทำหน้าที่ของตัวเอง' },
    { en: 'having a life beyond work', th: 'การมีชีวิตนอกเหนือจากงาน' },
  ],
  compare: [
    { en: 'growing', th: 'การได้เติบโต' },
    { en: 'building a life I’m proud of', th: 'การสร้างชีวิตที่ภูมิใจ' },
    { en: 'my own future', th: 'อนาคตของตัวเอง' },
  ],
  alone: [
    { en: 'being close to people', th: 'ความใกล้ชิดกับผู้คน' },
    { en: 'being understood', th: 'การได้รับความเข้าใจ' },
    { en: 'real friendship', th: 'มิตรภาพที่จริงใจ' },
  ],
  regret: [
    { en: 'being a good person', th: 'การเป็นคนดี' },
    { en: 'the people I may have hurt', th: 'คนที่ฉันอาจทำให้เสียใจ' },
    { en: 'learning and doing better', th: 'การเรียนรู้และทำให้ดีขึ้น' },
  ],
  meaning: [
    { en: 'a life that means something', th: 'ชีวิตที่มีความหมาย' },
    { en: 'feeling alive again', th: 'การได้รู้สึกมีชีวิตชีวาอีกครั้ง' },
    { en: 'the people who matter to me', th: 'คนที่สำคัญกับฉัน' },
  ],
  general: [
    { en: 'the people in my life', th: 'คนในชีวิตของฉัน' },
    { en: 'doing things well', th: 'การทำสิ่งต่างๆ ให้ดี' },
    { en: 'my own wellbeing', th: 'ความสุขของตัวเอง' },
  ],
}

/** "Not sure yet" on the silver lining */
export const UNSURE = -1

// The sky lets light through as the forecast softens, one notch per change
export const CLEARER: Record<Weather, Weather> = {
  stormy: 'rainy',
  rainy: 'partly',
  foggy: 'partly',
  partly: 'sunny',
  sunny: 'sunny',
}

export const mooca = {
  intro: {
    en: 'You brought “{thought}”. Let’s see what weather it brings.',
    th: 'คุณนำ “{thought}” มาด้วย ลองมาดูกันว่ามันพาอากาศแบบไหนมา',
  },

  qLining: { en: 'Find the silver lining', th: 'มองหาแสงหลังเมฆ' },
  qLiningSub: {
    en: 'Clouds this heavy usually hang over something you care about. What does this one say you care about?',
    th: 'เมฆที่หนักขนาดนี้ มักลอยอยู่เหนือสิ่งที่เราใส่ใจ ก้อนนี้บอกว่าคุณใส่ใจอะไร?',
  },
  liningLead: { en: 'I care about…', th: 'ฉันใส่ใจ…' },
  unsure: { en: 'I’m not sure yet', th: 'ยังไม่แน่ใจ' },
  liningSays: {
    en: 'That’s why it hurts. It isn’t a flaw. It’s something you care about.',
    th: 'นี่แหละเหตุผลที่มันเจ็บ มันไม่ใช่ข้อเสีย แต่มันคือสิ่งที่คุณใส่ใจ',
  },
  unsureSays: { en: 'That’s okay. It’ll show itself in time.', th: 'ไม่เป็นไรนะ เดี๋ยวมันจะค่อยๆ ชัดขึ้นเอง' },

  qSoften: { en: 'Soften the forecast', th: 'ทำให้พยากรณ์นุ่มลง' },
  qSoftenSub: {
    en: 'Tap a heavy word and swap it for one that’s softer, and still true.',
    th: 'แตะคำที่หนัก แล้วเปลี่ยนเป็นคำที่นุ่มลง แต่ยังจริงอยู่',
  },
  qSoftenSubNone: {
    en: 'Start it more gently, so it’s a thought you’re having, not a fact.',
    th: 'เริ่มประโยคให้นุ่มลง ให้มันเป็นความคิดที่เรากำลังมี ไม่ใช่ข้อเท็จจริง',
  },
  swapFor: { en: 'Swap “{word}” for…', th: 'เปลี่ยน “{word}” เป็น…' },
  putBack: { en: 'Put back “{word}”', th: 'ใช้คำเดิม “{word}”' },
  close: { en: 'Close', th: 'ปิด' },
  gentlerStart: { en: 'Begin with', th: 'เริ่มด้วย' },
  softProgress: { en: '{done} of {total} heavy words softened', th: 'ทำให้นุ่มลงแล้ว {done} จาก {total} คำ' },
  softAll: { en: 'Every heavy word is softer now', th: 'คำหนักทุกคำนุ่มลงแล้ว' },
  softenSays: { en: 'See? A little light gets through.', th: 'เห็นไหม แสงลอดผ่านมานิดหนึ่งแล้ว' },

  seeCard: { en: 'See my forecast', th: 'ดูพยากรณ์ของฉัน' },
  reading: { en: 'mooca is redrawing your sky…', th: 'มูก้ากำลังวาดท้องฟ้าใหม่ให้คุณ…' },

  oldLabel: { en: 'The old forecast', th: 'พยากรณ์เดิม' },
  careLabel: { en: 'Because I care about', th: 'เพราะฉันใส่ใจ' },
  softenedLabel: { en: 'Traps I softened', th: 'กับดักที่คลายลง' },
}

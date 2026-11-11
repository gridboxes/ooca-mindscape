import type { Lang } from '../content'
import type { Theme } from '../mindscape-content'

type T = Record<Lang, string>

// Hin's room: a Stoic sitting in four steps.
// 1 separate what happened (the stone) from the story laid on it, 2 sort what's in your control,
// 3 turn what's yours into a step (the obstacle becomes the way), 4 rise above it and see it
// from a year away.

// the four Stoic virtues, not generic good qualities: Hin's step is always one of these
export type Virtue = 'wisdom' | 'courage' | 'justice' | 'temperance'
export type Year = 'alot' | 'some' | 'little' | 'hardly'
export type Bin = 'mine' | 'let'

// What actually happened under each kind of thought: the plain fact a camera could see
export const facts: Record<Theme, T[]> = {
  worth: [
    { en: 'Something I made got criticised', th: 'งานที่ฉันทำโดนติ' },
    { en: 'I missed a goal I set', th: 'ฉันทำไม่ถึงเป้าที่ตั้งไว้' },
    { en: 'I compared myself to someone', th: 'ฉันเอาตัวเองไปเทียบกับใครบางคน' },
  ],
  fear: [
    { en: 'Something important is coming up', th: 'มีเรื่องสำคัญกำลังจะมาถึง' },
    { en: 'Something changed and I don’t know how it’ll go', th: 'มีบางอย่างเปลี่ยนไป และยังไม่รู้ว่าจะออกมาเป็นยังไง' },
    { en: 'Someone hasn’t replied yet', th: 'มีคนยังไม่ตอบกลับมา' },
  ],
  overthink: [
    { en: 'Something happened that I keep going back to', th: 'มีเรื่องที่เกิดขึ้นแล้วฉันวนกลับไปคิดถึง' },
    { en: 'I have a decision to make', th: 'ฉันมีเรื่องต้องตัดสินใจ' },
    { en: 'Someone said something that stuck', th: 'มีคนพูดอะไรบางอย่างที่ติดอยู่ในหัว' },
  ],
  tired: [
    { en: 'I’ve had a lot of work lately', th: 'ช่วงนี้งานเยอะ' },
    { en: 'I haven’t slept well', th: 'ฉันนอนไม่ค่อยหลับ' },
    { en: 'I’ve been looking after other people', th: 'ฉันดูแลคนอื่นมาตลอด' },
  ],
  compare: [
    { en: 'I saw someone’s news or post', th: 'ฉันเห็นข่าวหรือโพสต์ของใครบางคน' },
    { en: 'A friend reached a milestone', th: 'เพื่อนไปถึงจุดสำคัญในชีวิต' },
    { en: 'Someone my age got ahead at work', th: 'คนวัยเดียวกันก้าวหน้าในงานกว่า' },
  ],
  alone: [
    { en: 'Someone didn’t reply', th: 'มีคนไม่ตอบข้อความ' },
    { en: 'I was left out of a plan', th: 'ฉันไม่ได้ถูกชวนไปด้วย' },
    { en: 'I shared something and it didn’t land', th: 'ฉันเล่าบางอย่างไปแล้วไม่มีใครเข้าใจ' },
  ],
  regret: [
    { en: 'I said or did something I wish I hadn’t', th: 'ฉันพูดหรือทำบางอย่างที่ไม่น่าทำ' },
    { en: 'A decision didn’t work out', th: 'การตัดสินใจครั้งหนึ่งไม่เป็นอย่างที่หวัง' },
    { en: 'I let someone down', th: 'ฉันทำให้ใครบางคนผิดหวัง' },
  ],
  meaning: [
    { en: 'My days have felt the same lately', th: 'ช่วงนี้แต่ละวันเหมือนเดิมไปหมด' },
    { en: 'Something I worked for didn’t feel how I hoped', th: 'สิ่งที่พยายามมาไม่ได้รู้สึกอย่างที่หวัง' },
    { en: 'I’ve lost interest in things I used to like', th: 'ฉันไม่สนใจสิ่งที่เคยชอบแล้ว' },
  ],
  general: [
    { en: 'Something happened today', th: 'วันนี้มีเรื่องหนึ่งเกิดขึ้น' },
    { en: 'Someone said or did something', th: 'มีคนพูดหรือทำอะไรบางอย่าง' },
    { en: 'Things have been piling up', th: 'เรื่องต่างๆ สะสมขึ้นเรื่อยๆ' },
  ],
}

/** Index for "nothing specific": the story may be all there is */
export const JUST_A_FEELING = -1

// The thought split into pebbles: parts of it to sort into "mine to move" and "let it be"
export const pebbles: Record<Theme, T[]> = {
  worth: [
    { en: 'My effort', th: 'ความพยายามของฉัน' },
    { en: 'My boss’s opinion', th: 'ความเห็นของหัวหน้า' },
    { en: 'How I talk to myself', th: 'วิธีที่ฉันพูดกับตัวเอง' },
    { en: 'Other people’s results', th: 'ผลงานของคนอื่น' },
  ],
  fear: [
    { en: 'How I prepare', th: 'การเตรียมตัวของฉัน' },
    { en: 'What actually happens', th: 'สิ่งที่จะเกิดขึ้นจริง' },
    { en: 'What others decide', th: 'การตัดสินใจของคนอื่น' },
    { en: 'How I look after myself today', th: 'การดูแลตัวเองวันนี้' },
  ],
  overthink: [
    { en: 'When I stop for the day', th: 'เวลาที่ฉันพักจากมัน' },
    { en: 'What already happened', th: 'สิ่งที่เกิดขึ้นไปแล้ว' },
    { en: 'What others are thinking', th: 'สิ่งที่คนอื่นคิด' },
    { en: 'Where I put my attention', th: 'สิ่งที่ฉันเลือกใส่ใจ' },
  ],
  tired: [
    { en: 'How much I take on', th: 'ปริมาณงานที่ฉันรับมา' },
    { en: 'Other people’s deadlines', th: 'เดดไลน์ของคนอื่น' },
    { en: 'When I rest', th: 'เวลาที่ฉันได้พัก' },
    { en: 'How today went', th: 'วันนี้ที่ผ่านไปแล้ว' },
  ],
  compare: [
    { en: 'Their success', th: 'ความสำเร็จของเขา' },
    { en: 'My next step', th: 'ก้าวต่อไปของฉัน' },
    { en: 'What I scroll past', th: 'สิ่งที่ฉันไถผ่าน' },
    { en: 'My own pace', th: 'จังหวะของฉันเอง' },
  ],
  alone: [
    { en: 'Who I reach out to', th: 'คนที่ฉันทักหา' },
    { en: 'Whether they reply', th: 'เขาจะตอบหรือไม่' },
    { en: 'How I spend tonight', th: 'คืนนี้ฉันจะทำอะไร' },
    { en: 'Other people’s busy lives', th: 'ชีวิตที่ยุ่งของคนอื่น' },
  ],
  regret: [
    { en: 'What happened', th: 'สิ่งที่เกิดขึ้นไปแล้ว' },
    { en: 'Saying sorry', th: 'การขอโทษ' },
    { en: 'What I learn from it', th: 'สิ่งที่ฉันได้เรียนรู้' },
    { en: 'How they feel about it', th: 'ความรู้สึกของเขา' },
  ],
  meaning: [
    { en: 'One thing I enjoy today', th: 'สิ่งเล็กๆ ที่ฉันชอบวันนี้' },
    { en: 'How the world works', th: 'โลกที่หมุนไปตามทางของมัน' },
    { en: 'Who I spend time with', th: 'คนที่ฉันใช้เวลาด้วย' },
    { en: 'The one big answer', th: 'คำตอบใหญ่ข้อเดียว' },
  ],
  general: [
    { en: 'What I do next', th: 'สิ่งที่ฉันทำต่อจากนี้' },
    { en: 'What others do', th: 'สิ่งที่คนอื่นทำ' },
    { en: 'How I talk to myself', th: 'วิธีที่ฉันพูดกับตัวเอง' },
    { en: 'What already happened', th: 'สิ่งที่เกิดขึ้นไปแล้ว' },
  ],
}

// The side Hin would put each pebble on, in the same order as pebbles[theme]. The sort is still
// yours: if a pebble lands on the other side, Hin asks about it once and you can keep it there.
export const pebbleSides: Record<Theme, Bin[]> = {
  worth: ['mine', 'let', 'mine', 'let'],
  fear: ['mine', 'let', 'let', 'mine'],
  overthink: ['mine', 'let', 'let', 'mine'],
  tired: ['mine', 'let', 'mine', 'let'],
  compare: ['let', 'mine', 'mine', 'mine'],
  alone: ['mine', 'let', 'mine', 'let'],
  regret: ['let', 'mine', 'mine', 'let'],
  meaning: ['mine', 'let', 'mine', 'let'],
  general: ['mine', 'let', 'mine', 'let'],
}

export const virtues: Record<Virtue, { label: T; step: T }> = {
  wisdom: {
    label: { en: 'Wisdom', th: 'ปัญญา' },
    step: { en: 'Before you react, write down what happened, then what you made of it. Act on the first.', th: 'ก่อนจะตอบสนอง เขียนสิ่งที่เกิดขึ้นจริง แล้วเขียนสิ่งที่เราคิดไปเอง ลงมือจากอย่างแรก' },
  },
  courage: {
    label: { en: 'Courage', th: 'ความกล้า' },
    step: { en: 'Do the one small thing you’ve been avoiding.', th: 'ลงมือทำสิ่งเล็กๆ ที่เลี่ยงมาตลอดสักหนึ่งอย่าง' },
  },
  justice: {
    label: { en: 'Fairness', th: 'ความเป็นธรรม' },
    step: { en: 'What the Stoics called justice: be as fair to yourself as you’d be to someone else, and do your part for them too.', th: 'สิ่งที่สโตอิกเรียกว่าความยุติธรรม: ยุติธรรมกับตัวเองเท่ากับที่ยุติธรรมกับคนอื่น และทำส่วนของเราให้เขาด้วย' },
  },
  temperance: {
    label: { en: 'Self-control', th: 'ความยับยั้งชั่งใจ' },
    step: { en: 'Pause before the next reply, scroll or spiral. Take the measured step, not the loud one.', th: 'หยุดก่อนจะตอบ ไถ หรือคิดวน เลือกก้าวที่พอดี ไม่ใช่ก้าวที่ดังที่สุด' },
  },
}

// One Stoic idea per step of the room, named and credited, so Hin teaches rather than only soothes.
// Quotes are the common English renderings; check against a translation before quoting elsewhere.
export const ideas: { name: T; quote: T; by: T }[] = [
  {
    name: { en: 'What happened, and what you made of it', th: 'สิ่งที่เกิดขึ้น กับสิ่งที่เราตัดสิน' },
    quote: { en: 'People are disturbed not by things, but by the views they take of them.', th: 'สิ่งที่ทำให้คนทุกข์ใจ ไม่ใช่ตัวเหตุการณ์ แต่คือมุมมองที่เขามีต่อมัน' },
    by: { en: 'Epictetus, Enchiridion 5', th: 'เอพิคทิตัส, เอนคิริเดียน 5' },
  },
  {
    name: { en: 'The dichotomy of control', th: 'สิ่งที่อยู่ในอำนาจเรา และสิ่งที่ไม่ใช่' },
    quote: { en: 'Some things are within our power, while others are not.', th: 'บางสิ่งอยู่ในอำนาจของเรา บางสิ่งไม่ได้อยู่' },
    by: { en: 'Epictetus, Enchiridion 1', th: 'เอพิคทิตัส, เอนคิริเดียน 1' },
  },
  {
    name: { en: 'The obstacle is the way', th: 'อุปสรรคคือทางเดิน' },
    quote: { en: 'What stands in the way becomes the way.', th: 'สิ่งที่ขวางทาง กลายเป็นทางเดิน' },
    by: { en: 'Marcus Aurelius, Meditations 5.20', th: 'มาร์คัส ออเรลิอัส, Meditations 5.20' },
  },
  {
    name: { en: 'The view from above', th: 'มองจากที่สูง' },
    quote: { en: 'We suffer more often in imagination than in reality.', th: 'เราทุกข์เพราะจินตนาการ บ่อยกว่าเพราะความจริง' },
    by: { en: 'Seneca, Letters 13', th: 'เซเนกา, จดหมายฉบับที่ 13' },
  },
]

export const years: Record<Year, { label: T }> = {
  alot: { label: { en: 'A lot', th: 'มาก' } },
  some: { label: { en: 'Somewhat', th: 'ปานกลาง' } },
  little: { label: { en: 'A little', th: 'นิดหน่อย' } },
  hardly: { label: { en: 'Hardly at all', th: 'แทบไม่มีผล' } },
}

export const hin = {
  intro: {
    en: '“{thought}”. Heavy. Let’s turn it over and see what’s actually underneath.',
    th: '“{thought}” หนักนะ ลองพลิกดูว่าข้างใต้จริงๆ คืออะไร',
  },

  qFact: { en: 'What actually happened?', th: 'เกิดอะไรขึ้นจริงๆ?' },
  qFactSub: { en: 'Just the plain facts, the part a camera could see.', th: 'เอาแค่ข้อเท็จจริง ส่วนที่กล้องถ่ายเห็นได้' },
  justAFeeling: { en: 'Nothing specific, it’s just a feeling', th: 'ไม่มีอะไรเฉพาะ แค่รู้สึก' },
  factReply: {
    en: 'That’s what happened. “{thought}” is what you made of it. Two different things.',
    th: 'นั่นคือสิ่งที่เกิดขึ้น ส่วน “{thought}” คือสิ่งที่เราตัดสินมัน สองอย่างนี้ไม่เหมือนกัน',
  },
  feelingReply: {
    en: 'Then there’s no stone. Just the story. Stories can be put down.',
    th: 'งั้นก็ไม่มีก้อนหิน มีแค่เรื่องเล่า และเรื่องเล่าวางลงได้',
  },

  qSort: { en: 'Split the stone', th: 'แบ่งหินออกเป็นก้อนเล็ก' },
  qSortSub: {
    en: 'Drag each pebble to a side, or tap it and then tap a side.',
    th: 'ลากก้อนกรวดไปวางแต่ละฝั่ง หรือแตะก้อนกรวดแล้วแตะฝั่งที่ต้องการ',
  },
  sortSays: {
    en: 'Some of this is yours. Some isn’t. Pushing on what isn’t is how you get tired.',
    th: 'บางส่วนเป็นของเรา บางส่วนไม่ใช่ ไปดันส่วนที่ไม่ใช่ นั่นแหละที่ทำให้เหนื่อย',
  },
  mine: { en: 'Mine to move', th: 'ขยับได้' },
  mineHint: { en: 'In my control', th: 'อยู่ในมือเรา' },
  let: { en: 'Let it be', th: 'ปล่อยไว้' },
  letHint: { en: 'Not in my control', th: 'อยู่นอกมือเรา' },
  tray: { en: 'Pebbles to sort', th: 'ก้อนกรวดที่ยังไม่ได้แยก' },
  dropHere: { en: 'Drop here', th: 'วางตรงนี้' },
  allSorted: { en: 'All sorted.', th: 'แยกครบแล้ว' },
  // Hin asks about a pebble sorted to the other side from where Hin would put it, never calling it wrong
  askLet: {
    en: '“{pebble}”: can you actually move that? Take it from a rock: pushing doesn’t help.',
    th: '“{pebble}” เราขยับมันได้จริงเหรอ? เชื่อหินเถอะ ดันไปก็ไม่ขยับ',
  },
  askMine: {
    en: '“{pebble}” is more yours than you think. Even a little counts.',
    th: '“{pebble}” เป็นของเรามากกว่าที่คิดนะ แค่นิดเดียวก็นับ',
  },
  keepMine: { en: 'Keep it as mine', th: 'ยังขยับได้อยู่' },
  keepLet: { en: 'Keep letting it be', th: 'ปล่อยไว้เหมือนเดิม' },
  moveTo: { en: 'Move “{pebble}” to {side}', th: 'ย้าย “{pebble}” ไปที่ {side}' },

  qStep: { en: 'Turn it into a step', th: 'เปลี่ยนมันเป็นก้าวเดิน' },
  qStepSub: {
    en: 'What’s yours to move becomes stepping stones. How will you step on them?',
    th: 'ส่วนที่ขยับได้ จะกลายเป็นหินให้ก้าวข้าม จะก้าวไปอย่างไร?',
  },
  forMine: { en: 'Stepping stones: {list}', th: 'หินที่จะก้าว: {list}' },
  wayReply: { en: 'Good. Then it isn’t in your way. It is the way.', th: 'ดี งั้นมันไม่ได้ขวางทางแล้ว มันคือทางเดิน' },
  nothingMine: {
    en: 'Nothing here is yours to move. So stop carrying it.',
    th: 'ไม่มีอะไรตรงนี้ที่เราต้องขยับ งั้นก็เลิกแบกมันเถอะ',
  },

  qRise: { en: 'Rise above it', th: 'ลอยขึ้นไปมอง' },
  qRiseSub: {
    en: 'Drag up to rise. Watch how big it looks from up there.',
    th: 'ลากขึ้นเพื่อลอยสูง แล้วดูว่ามันใหญ่แค่ไหนเมื่อมองจากข้างบน',
  },
  riseHandle: { en: 'Rise', th: 'ลอยขึ้น' },
  riseLabel: { en: 'How high you’ve risen', th: 'ระดับความสูง' },
  riseLow: { en: 'Close up, it fills everything.', th: 'มองใกล้ๆ มันใหญ่ไปหมด' },
  riseMid: { en: 'Higher. It’s one stone on a hill.', th: 'สูงขึ้น มันเป็นหินก้อนหนึ่งบนเนิน' },
  riseTop: { en: 'From up here, it’s one of many.', th: 'จากตรงนี้ มันเป็นแค่หนึ่งในหลายก้อน' },
  qYearTop: { en: 'A year from now, how much will this matter?', th: 'อีกหนึ่งปี เรื่องนี้จะสำคัญแค่ไหน?' },
  yearHeavy: {
    en: 'Then it deserves care, and maybe someone to carry it with.',
    th: 'งั้นมันควรได้รับการดูแล และอาจต้องมีใครสักคนช่วยแบก',
  },
  yearLight: {
    en: 'From up here, it’s one stone on a long road.',
    th: 'มองจากตรงนี้ มันเป็นแค่หินก้อนหนึ่งบนทางที่ยาวไกล',
  },

  factLabel: { en: 'What happened', th: 'สิ่งที่เกิดขึ้นจริง' },
  mineLabel: { en: 'Mine to move', th: 'ส่วนที่ขยับได้' },
  letLabel: { en: 'Letting be', th: 'ส่วนที่ปล่อยไว้' },
  virtueLabel: { en: 'My next step, with', th: 'ก้าวต่อไปของฉัน ด้วย' },
  yearLabel: { en: 'From a year away, it matters', th: 'อีกหนึ่งปี เรื่องนี้สำคัญ' },
  quote: {
    en: 'Some things are within our power, while others are not.',
    th: 'บางสิ่งอยู่ในอำนาจของเรา บางสิ่งไม่ได้อยู่',
  },
  quoteBy: { en: 'Epictetus, Enchiridion 1', th: 'เอพิคทิตัส, เอนคิริเดียน 1' },
  ideaLabel: { en: 'A Stoic idea', th: 'แนวคิดสโตอิก' },
  // Hin's closing practice: Seneca's nightly review, after the step you chose
  review: {
    en: 'Tonight, ask Seneca’s three questions: what went well, where did I slip, what will I do next?',
    th: 'คืนนี้ ลองถามสามคำถามของเซเนกา: วันนี้อะไรดี พลาดตรงไหน และจะทำอะไรต่อ?',
  },
  reviewTitle: { en: 'Seneca’s evening review', th: 'ทบทวนตอนค่ำแบบเซเนกา' },
  quoteShort: { en: '— Epictetus', th: '— เอพิคทิตัส' },
  // "step on it" reads as "hurry" in English, so the card names the next step instead
  stepWith: { en: 'I’ll take my next step with {virtue}.', th: 'ฉันจะก้าวต่อไปด้วย{virtue}' },
}

import type { Lang } from '../content'

type T = Record<Lang, string>

// Bua's room: the one room where nothing gets fixed. You notice the thought, watch it drift,
// and pass some kindness on, in three steps:
// 1 notice where it sits in the body and what it's like there,
// 2 let it drift: five slow breaths clear the pond and carry the note away,
// 3 pass kindness on, in widening circles: to you, to someone you love, to everyone.
// Rooted in Buddhist practice (mindfulness, impermanence, loving-kindness), said in everyday words.

export type Region = 'head' | 'throat' | 'shoulders' | 'chest' | 'stomach' | 'whole' | 'nowhere'
export type Tone = 'unpleasant' | 'neutral' | 'pleasant'
export type Wish = 'gentle' | 'calm' | 'lighter' | 'safe'
export type Circle = 'me' | 'them' | 'all'

export const CIRCLES: Circle[] = ['me', 'them', 'all']

export const regions: Record<Region, T> = {
  head: { en: 'Head', th: 'ศีรษะ' },
  throat: { en: 'Throat', th: 'ลำคอ' },
  shoulders: { en: 'Shoulders', th: 'ไหล่' },
  chest: { en: 'Chest', th: 'หน้าอก' },
  stomach: { en: 'Stomach', th: 'ท้อง' },
  whole: { en: 'All over', th: 'ทั้งตัว' },
  nowhere: { en: 'Nowhere I can find', th: 'หาไม่เจอ' },
}

export const tones: Record<Tone, { label: T; reply: T }> = {
  unpleasant: {
    label: { en: 'Uncomfortable', th: 'ไม่สบาย' },
    reply: { en: 'Thanks for noticing. It’s allowed to feel like this.', th: 'ขอบคุณที่สังเกตนะ รู้สึกแบบนี้ได้' },
  },
  neutral: {
    label: { en: 'Neither', th: 'เฉยๆ' },
    reply: { en: 'Even a quiet feeling is worth noticing.', th: 'แม้ความรู้สึกเงียบๆ ก็ควรค่าแก่การสังเกต' },
  },
  pleasant: {
    label: { en: 'Okay, actually', th: 'ก็โอเคนะ' },
    reply: { en: 'Nice. Let’s notice that too.', th: 'ดีจัง ลองสังเกตตรงนั้นด้วยนะ' },
  },
}

export const circles: Record<Circle, T> = {
  me: { en: 'To me', th: 'ถึงตัวเอง' },
  them: { en: 'To someone I love', th: 'ถึงคนที่รัก' },
  all: { en: 'To everyone', th: 'ถึงทุกคน' },
}

// One wish, worded for each widening circle
export const wishes: Record<Wish, Record<Circle, T>> = {
  gentle: {
    me: { en: 'I hope I’m gentle with myself.', th: 'ขอให้ฉันใจดีกับตัวเอง' },
    them: { en: 'I hope you’re gentle with yourself.', th: 'ขอให้เธอใจดีกับตัวเอง' },
    all: { en: 'I hope everyone is gentle with themselves.', th: 'ขอให้ทุกคนใจดีกับตัวเอง' },
  },
  calm: {
    me: { en: 'I hope I feel calm.', th: 'ขอให้ฉันรู้สึกสงบ' },
    them: { en: 'I hope you feel calm.', th: 'ขอให้เธอรู้สึกสงบ' },
    all: { en: 'I hope everyone feels calm.', th: 'ขอให้ทุกคนรู้สึกสงบ' },
  },
  lighter: {
    me: { en: 'I hope this feels lighter soon.', th: 'ขอให้เรื่องนี้เบาลงเร็วๆ' },
    them: { en: 'I hope what you carry feels lighter.', th: 'ขอให้สิ่งที่เธอแบกเบาลง' },
    all: { en: 'I hope everyone’s load feels lighter.', th: 'ขอให้ทุกคนแบกน้อยลง' },
  },
  safe: {
    me: { en: 'I hope I’m safe and well.', th: 'ขอให้ฉันปลอดภัยและสบายดี' },
    them: { en: 'I hope you’re safe and well.', th: 'ขอให้เธอปลอดภัยและสบายดี' },
    all: { en: 'I hope everyone is safe and well.', th: 'ขอให้ทุกคนปลอดภัยและสบายดี' },
  },
}

export const bua = {
  intro: {
    en: 'Let’s set “{thought}” on the water. No need to fix it. Just notice it.',
    th: 'ลองวาง “{thought}” ลงบนน้ำ ไม่ต้องแก้อะไร แค่สังเกตมัน',
  },

  qBody: { en: 'Where do you feel it?', th: 'รู้สึกถึงมันตรงไหน?' },
  qBodySub: { en: 'Tap where you notice it, as many as you like.', th: 'แตะตรงที่รู้สึกได้ เลือกได้หลายที่' },
  qTone: { en: 'What’s it like there?', th: 'ตรงนั้นรู้สึกอย่างไร?' },
  toneSub: { en: 'Just notice. No need to change it.', th: 'แค่สังเกต ไม่ต้องเปลี่ยนมัน' },

  qSettle: { en: 'Let it drift', th: 'ปล่อยให้มันลอยไป' },
  qSettleSub: {
    en: 'Five slow breaths, following the light. Don’t push the thought away. Just breathe, and watch it drift.',
    th: 'หายใจช้าๆ ห้าครั้งตามแสง ไม่ต้องผลักความคิดออกไป แค่หายใจ แล้วดูมันลอยไป',
  },
  breathReady: { en: 'Follow the light', th: 'หายใจตามแสง' },
  breathBegin: { en: 'Begin', th: 'เริ่ม' },
  breathPause: { en: 'Pause', th: 'พัก' },
  breathResume: { en: 'Carry on', th: 'หายใจต่อ' },
  breathPaused: { en: 'Paused. Carry on when you’re ready.', th: 'พักไว้ก่อน หายใจต่อเมื่อพร้อม' },
  breatheIn: { en: 'Breathe in…', th: 'หายใจเข้า…' },
  breatheOut: { en: 'Breathe out…', th: 'หายใจออก…' },
  holdLonger: { en: 'Hold a little longer', th: 'ค้างไว้อีกนิดนะ' },
  settled: { en: 'It drifted away.', th: 'มันลอยไปแล้ว' },
  skipBreaths: { en: 'Skip the breathing', th: 'ข้ามการหายใจ' },
  drifted: {
    en: 'Thoughts come and go. It may drift back sometimes, and that’s okay. You don’t have to hold every one.',
    th: 'ความคิดมาแล้วก็ไป บางทีมันอาจลอยกลับมา และนั่นก็ไม่เป็นไร เราไม่ต้องถือไว้ทุกอัน',
  },

  qKind: { en: 'Pass some kindness on', th: 'ส่งความใจดีต่อไป' },
  qKindSub: {
    en: 'Pick one wish, then hold. It starts with you and reaches wider for as long as you hold.',
    th: 'เลือกคำอวยพรหนึ่งข้อ แล้วกดค้างไว้ มันจะเริ่มจากตัวเอง แล้วกว้างออกไปเรื่อยๆ ตราบที่ยังกดค้าง',
  },
  holdSend: { en: 'Hold to send', th: 'กดค้างเพื่อส่ง' },
  holdOn: { en: 'Hold to send it wider', th: 'กดค้างเพื่อส่งให้กว้างขึ้น' },
  sending: { en: 'Sending…', th: 'กำลังส่ง…' },
  sayIt: { en: 'Say it to yourself as it goes.', th: 'พูดในใจไปพร้อมกัน' },
  reachedMe: { en: 'It reached you first.', th: 'มันถึงตัวคุณก่อนแล้ว' },
  reachedThem: { en: 'It reached someone you love, and Hin too.', th: 'มันไปถึงคนที่คุณรัก และถึงหินด้วย' },
  reachedAll: { en: 'It reached everyone, mooca too. Kindness doesn’t run out.', th: 'มันไปถึงทุกคนแล้ว รวมถึงมูก้าด้วย ความใจดีไม่มีวันหมด' },

  feltLabel: { en: 'Felt in', th: 'รู้สึกที่' },
  breathsLabel: { en: 'Let it drift', th: 'ปล่อยให้ลอยไป' },
  breathsValue: { en: '{n} slow breaths', th: 'หายใจช้าๆ {n} ครั้ง' },
  kindLabel: { en: 'Kindness passed on', th: 'ความใจดีที่ส่งต่อ' },
  reachLabel: { en: 'It reached', th: 'ส่งไปถึง' },
  quote: { en: 'You don’t have to fix a feeling to be kind to it.', th: 'ไม่ต้องแก้ความรู้สึก ก็ใจดีกับมันได้' },
  practiceTitle: { en: 'Pass it on for real', th: 'ส่งต่อจริงๆ' },
  practiceBody: {
    en: 'Send one kind message to someone you love today. It doesn’t need a reason.',
    th: 'ส่งข้อความดีๆ หาคนที่คุณรักสักคนวันนี้ ไม่ต้องมีเหตุผลก็ได้',
  },
}

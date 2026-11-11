import type { Lang } from './content'
import type { Companion, Theme } from './mindscape-content'

type T = Record<Lang, string>

// ooca Garden (สวนพักใจ): a concept for the ooca app, where mooca, Hin and Bua live after Mindscape. Talk to
// them any time, and listen to short lessons and practices. It's the paid step up from the free
// web check-in, and the bridge to an ooca psychologist. Lesson ideas follow the opportunity brief:
// 3–5 minute lessons (Waking Up), courses named by real problems (Ten Percent Happier), sleep
// stories in the mascot's voice (Headspace), voiced by ooca clinicians and Thai teachers.

export interface Lesson {
  title: T
  minutes: number
}

// The lesson each companion recommends at the end of Mindscape, matched to the thought
const LESSONS: Record<Companion, { base: Lesson; by: Partial<Record<Theme, Lesson>> }> = {
  mooca: {
    base: { title: { en: 'A thought isn’t a fact', th: 'ความคิดไม่ใช่ข้อเท็จจริง' }, minutes: 4 },
    by: {
      overthink: { title: { en: 'When your mind won’t stop', th: 'เมื่อหยุดคิดไม่ได้' }, minutes: 5 },
      fear: { title: { en: 'When your mind won’t stop', th: 'เมื่อหยุดคิดไม่ได้' }, minutes: 5 },
      tired: { title: { en: 'Running on empty', th: 'เมื่อแบตใจใกล้หมด' }, minutes: 5 },
    },
  },
  hin: {
    base: { title: { en: 'What’s in your control', th: 'อะไรอยู่ในมือเรา' }, minutes: 4 },
    by: {
      compare: { title: { en: 'Measuring yourself fairly', th: 'วัดตัวเองอย่างแฟร์' }, minutes: 4 },
      regret: { title: { en: 'The evening review', th: 'ทบทวนตอนค่ำ' }, minutes: 5 },
      meaning: { title: { en: 'Life questions: what matters', th: 'คำถามชีวิต: อะไรสำคัญ' }, minutes: 6 },
    },
  },
  bua: {
    base: { title: { en: 'Five breaths to let go', th: 'ห้าลมหายใจ ปล่อยวาง' }, minutes: 3 },
    by: {
      alone: { title: { en: 'Kindness, starting with you', th: 'ใจดี เริ่มจากตัวเอง' }, minutes: 6 },
      worth: { title: { en: 'Kindness, starting with you', th: 'ใจดี เริ่มจากตัวเอง' }, minutes: 6 },
      overthink: { title: { en: 'Body scan for a busy mind', th: 'สแกนกายเมื่อใจวุ่น' }, minutes: 8 },
    },
  },
}

export const lessonFor = (who: Companion, theme: Theme): Lesson => LESSONS[who].by[theme] ?? LESSONS[who].base

// Courses named by the problem, as people would say it
export const courses: T[] = [
  { en: 'Overthinking', th: 'คิดมาก' },
  { en: 'Can’t sleep', th: 'นอนไม่หลับ' },
  { en: 'Work burnout', th: 'หมดไฟในงาน' },
  { en: 'After a breakup', th: 'หลังเลิกรา' },
  { en: 'Exam stress', th: 'เครียดก่อนสอบ' },
  { en: 'New parent', th: 'พ่อแม่มือใหม่' },
]

export const heal = {
  name: { en: 'ooca Garden', th: 'สวนพักใจ' },
  pageTitle: { en: 'ooca Garden', th: 'สวนพักใจ · ooca' },
  newIn: { en: 'New in the ooca app', th: 'ใหม่ในแอป ooca' },

  heroTitle: { en: 'Your friends from Mindscape, any time you need them', th: 'เพื่อนจากที่พักใจ อยู่กับคุณได้ทุกเวลา' },
  heroLead: {
    en: 'Your garden is where mooca, Hin and Bua live. Come back any day to talk things through, listen to short lessons, and talk to a real psychologist when you need one.',
    th: 'สวนพักใจคือบ้านของมูก้า หิน และบัว กลับมาได้ทุกวัน คุยได้ทุกเรื่อง ฟังบทเรียนสั้นๆ และคุยกับนักจิตวิทยาตัวจริงเมื่อต้องการ',
  },
  trial: { en: '7 days free, then a small monthly plan', th: 'ใช้ฟรี 7 วัน จากนั้นเป็นแพ็กเกจรายเดือนราคาเบาๆ' },
  appStore: { en: 'App Store', th: 'App Store' },
  playStore: { en: 'Google Play', th: 'Google Play' },
  downloadOn: { en: 'Download on the', th: 'ดาวน์โหลดบน' },
  getItOn: { en: 'Get it on', th: 'ดาวน์โหลดบน' },

  // the friends, saying hello around the hero phone
  hiMooca: { en: 'Rain is allowed here.', th: 'ที่นี่ฝนตกได้นะ' },
  hiHin: { en: 'Let’s turn it over.', th: 'ลองพลิกดูกัน' },
  hiBua: { en: 'Breathe with me?', th: 'หายใจไปด้วยกันไหม?' },

  // pick up where you left off
  bridgeKicker: { en: 'Pick up where you left off', th: 'ต่อจากที่ค้างไว้' },
  bridgeTitle: { en: 'Your card comes with you', th: 'การ์ดของคุณตามไปด้วย' },
  bridgeBody: {
    en: 'Everything from today’s Mindscape moves into the app: your card, your companion, and the lesson picked for your thought. No starting over.',
    th: 'ทุกอย่างจากที่พักใจวันนี้ย้ายเข้าแอปให้เลย ทั้งการ์ด เพื่อนที่คุณเลือก และบทเรียนที่เลือกมาให้ตรงกับความคิดของคุณ ไม่ต้องเริ่มใหม่',
  },

  // talk
  talkKicker: { en: 'Talk', th: 'คุย' },
  talkTitle: { en: 'Talk it through, any time', th: 'คุยได้ทุกเวลา' },
  talkBody: {
    en: 'Day or night, chat with mooca, Hin or Bua. Each one listens in their own way, and knows when to suggest a real person.',
    th: 'กลางวันหรือกลางคืน คุยกับมูก้า หิน หรือบัวได้ แต่ละคนรับฟังในแบบของตัวเอง และรู้ว่าเมื่อไหร่ควรชวนไปคุยกับคนจริงๆ',
  },
  styleMooca: { en: 'helps you soften the heavy words', th: 'ช่วยให้คำที่หนักนุ่มลง' },
  styleHin: { en: 'helps you sort what’s yours to move', th: 'ช่วยแยกสิ่งที่ขยับได้' },
  styleBua: { en: 'sits with you while it passes', th: 'อยู่เป็นเพื่อนจนมันผ่านไป' },

  // listen
  listenKicker: { en: 'Listen', th: 'ฟัง' },
  listenTitle: { en: 'Little lessons, big exhale', th: 'บทเรียนเล็กๆ ให้ใจได้หายใจ' },
  listenBody: {
    en: '3–5 minute lessons, courses named after real problems, and sleep stories told by mooca. Made with ooca psychologists and Thai teachers.',
    th: 'บทเรียน 3–5 นาที คอร์สที่ตั้งชื่อตามปัญหาจริง และนิทานก่อนนอนเล่าโดยมูก้า ทำร่วมกับนักจิตวิทยาของ ooca และครูไทย',
  },

  // every day
  dailyKicker: { en: 'Every day', th: 'ทุกวัน' },
  dailyTitle: { en: 'One tap for your sky', th: 'แตะเดียว ดูท้องฟ้าในใจ' },
  dailyBody: {
    en: 'Name your weather once a day. Over a week, your skies show patterns that one day can’t, and mooca notices them with you.',
    th: 'บอกสภาพอากาศในใจวันละครั้ง ผ่านไปสักสัปดาห์ ท้องฟ้าของคุณจะบอกสิ่งที่วันเดียวบอกไม่ได้ และมูก้าจะสังเกตไปด้วยกัน',
  },

  // when you need more
  moreKicker: { en: 'When you need more', th: 'เมื่อต้องการมากกว่านี้' },
  moreTitle: { en: 'A real person, one tap away', th: 'คนจริงๆ อยู่ห่างแค่แตะเดียว' },
  moreBody: {
    en: 'If things have been heavy for a while, your friends will say so, gently. ooca psychologists are right there, at members’ prices.',
    th: 'ถ้ามันหนักมาสักพัก เพื่อนๆ จะบอกคุณอย่างอ่อนโยน นักจิตวิทยาของ ooca พร้อมคุย ในราคาสมาชิก',
  },
  step1: { en: 'Mindscape', th: 'ที่พักใจ' },
  step1Note: { en: 'Free · 3 minutes', th: 'ฟรี · 3 นาที' },
  step2: { en: 'ooca Garden', th: 'สวนพักใจ' },
  step2Note: { en: '7 days free', th: 'ฟรี 7 วัน' },
  step3: { en: 'ooca psychologist', th: 'นักจิตวิทยา ooca' },
  step3Note: { en: 'Members’ price', th: 'ราคาสมาชิก' },

  endTitle: { en: 'Carry on where Mindscape left off', th: 'ไปต่อจากที่พักใจ' },
  endBody: { en: 'Your friends are waiting.', th: 'เพื่อนๆ รออยู่นะ' },
  tryFirst: { en: 'Not ready? Try Mindscape first', th: 'ยังไม่พร้อม? ลองที่พักใจก่อน' },
  conceptNote: {
    en: 'Concept for a design assignment. Store buttons, prices and the QR code are placeholders.',
    th: 'งานออกแบบเชิงแนวคิด ปุ่มสโตร์ ราคา และ QR เป็นตัวอย่างเท่านั้น',
  },

  // the phone screens
  homeHi: { en: 'Good evening', th: 'สวัสดีตอนเย็น' },
  homeAsk: { en: 'How’s your sky?', th: 'ท้องฟ้าในใจเป็นไงบ้าง?' },
  forYou: { en: 'For you tonight', th: 'สำหรับคุณคืนนี้' },
  talkTo: { en: 'Talk to', th: 'คุยกับ' },
  chatStatus: { en: 'here for you', th: 'อยู่ตรงนี้นะ' },
  chat1: { en: 'Back again. What’s on your mind today?', th: 'กลับมาแล้ว วันนี้มีอะไรอยู่ในใจ?' },
  chat2: { en: 'I keep comparing myself to people at work', th: 'ชอบเอาตัวเองไปเทียบกับคนที่ทำงาน' },
  chat3: { en: 'Let’s sort it. Which part is yours to move?', th: 'ลองแยกดูกัน ส่วนไหนที่เราขยับได้?' },
  chatChip1: { en: 'My next step', th: 'ก้าวต่อไปของฉัน' },
  chatChip2: { en: 'Their success', th: 'ความสำเร็จของเขา' },
  chatInput: { en: 'Message Hin…', th: 'พิมพ์ถึงหิน…' },
  nowPlaying: { en: 'Lesson · Hin', th: 'บทเรียน · หิน' },
  upNext: { en: 'Up next', th: 'ถัดไป' },
  libraryTitle: { en: 'Listen', th: 'ฟัง' },
  libraryFor: { en: 'Courses for real problems', th: 'คอร์สสำหรับปัญหาจริง' },
  lessons: { en: '{n} lessons', th: '{n} บทเรียน' },
  libraryTonight: { en: 'Tonight', th: 'คืนนี้' },
  sleepStory: { en: 'mooca and the quiet rain', th: 'มูก้ากับฝนเงียบ' },
  sleepKicker: { en: 'Sleep story', th: 'นิทานก่อนนอน' },
  min: { en: '{n} min', th: '{n} นาที' },
  weekTitle: { en: 'Your week', th: 'สัปดาห์ของคุณ' },
  weekNote: { en: 'Clearer since Tuesday. Want to see why?', th: 'ฟ้าเปิดขึ้นตั้งแต่วันอังคาร อยากรู้ไหมว่าทำไม?' },
  streak: { en: '5 days in a row', th: 'ต่อเนื่อง 5 วัน' },
  myCards: { en: 'My cards', th: 'การ์ดของฉัน' },
  today: { en: 'Today', th: 'วันนี้' },
  fromMindscape: { en: 'From Mindscape', th: 'จากที่พักใจ' },
  chat4: { en: 'Good. Start there. One small step today?', th: 'ดีเลย เริ่มจากตรงนั้น วันนี้ก้าวเล็กๆ สักก้าวไหม?' },
  chat5: { en: 'Okay. I’ll ask my lead for feedback 🙂', th: 'โอเค จะลองขอฟีดแบ็กจากหัวหน้าดู 🙂' },
  cardsTitle: { en: 'My cards', th: 'การ์ดของฉัน' },
  cardsNew: { en: 'New from Mindscape', th: 'ใหม่จากที่พักใจ' },
  cardsContinue: { en: 'Continue with mooca', th: 'คุยต่อกับมูก้า' },
  cardsLesson: { en: 'Picked for you: A thought isn’t a fact · 4 min', th: 'เลือกมาให้: ความคิดไม่ใช่ข้อเท็จจริง · 4 นาที' },
  lastWeek: { en: 'Last week', th: 'สัปดาห์ก่อน' },
  bookNotes: { en: 'Visit notes and your cards, shared only if you choose', th: 'บันทึกหลังคุยและการ์ดของคุณ แชร์เฉพาะเมื่อคุณเลือก' },
  bookTitle: { en: 'Talk to a psychologist', th: 'คุยกับนักจิตวิทยา' },
  bookMember: { en: 'Members’ price', th: 'ราคาสมาชิก' },
  bookNow: { en: 'Available now', th: 'ว่างตอนนี้' },
  bookTonight: { en: 'Tonight 8:00', th: 'คืนนี้ 20:00' },
  bookNote: { en: 'Hin thought this might help', th: 'หินคิดว่าน่าจะช่วยได้' },

  // the hand-off on Mindscape's ending
  carryTitle: { en: 'Carry on with {name} in ooca Garden', th: 'ไปต่อกับ{name}ในสวนพักใจ' },
  carryCta: { en: 'Open your garden', th: 'เปิดสวนพักใจ' },
  cardComes: { en: 'Get the ooca app', th: 'ดาวน์โหลดแอป ooca' },
  carryNote: { en: 'Your card comes with you · 7 days free', th: 'การ์ดของคุณไปด้วย · ใช้ฟรี 7 วัน' },
  scan: { en: 'Scan with your phone', th: 'สแกนด้วยมือถือ' },
  // the garden's home screen, on the poster
  gardenHi: { en: 'Good evening', th: 'สวัสดีตอนเย็น' },
  chatWith: { en: 'Chat with', th: 'แชตกับ' },
  continueTag: { en: 'Continue', th: 'คุยต่อ' },
  shelfPicked: { en: 'Picked for your thought', th: 'เลือกมาให้ความคิดของคุณ' },
  shelfSleep: { en: 'Can’t sleep', th: 'นอนไม่หลับ' },
  talkReal: { en: 'Talk to a psychologist', th: 'คุยกับนักจิตวิทยา' },
  featChat: { en: 'Chat', th: 'แชต' },
  featListen: { en: 'Listen', th: 'ฟัง' },
  featTalk: { en: 'Talk', th: 'คุย' },
  pickedFor: { en: 'picked for your thought', th: 'เลือกมาให้ตรงกับความคิดของคุณ' },
}

// ---------------------------------------------------------------- the poster's phone, after Mindscape

// What the person says first in the chat: their own thought, in their own words a few hours later
export const chatOpener: Record<Theme, T> = {
  worth: { en: 'Still feel like I’m not good enough', th: 'ยังรู้สึกว่าตัวเองดีไม่พอ' },
  fear: { en: 'Worried it’ll all go wrong tomorrow', th: 'กลัวพรุ่งนี้จะพังไปหมด' },
  overthink: { en: 'My head won’t stop tonight', th: 'คืนนี้หัวหยุดคิดไม่ได้เลย' },
  tired: { en: 'So tired of everything lately', th: 'ช่วงนี้เหนื่อยกับทุกอย่าง' },
  compare: { en: 'I keep comparing myself at work', th: 'ชอบเอาตัวเองไปเทียบกับคนที่ทำงาน' },
  alone: { en: 'Feels like nobody really gets me', th: 'รู้สึกว่าไม่มีใครเข้าใจเลย' },
  regret: { en: 'Still replaying that mistake', th: 'ยังวนคิดเรื่องที่พลาดไป' },
  meaning: { en: 'Not sure what it’s all for', th: 'ไม่แน่ใจว่าทำไปเพื่ออะไร' },
  general: { en: 'Today was a lot', th: 'วันนี้หนักหน่อย' },
}

/**
 * Each friend talking it through in plain messages, no widgets: a hello, then a message that
 * teaches their own idea (the source at its foot, as in the rooms), a next nudge, and your reply.
 * mooca: a thinking trap (CBT). Hin: Epictetus on control. Bua: the second arrow (Sallatha Sutta).
 */
export const chatScript: Record<
  Companion,
  { hello: T; teach: T; idea: { quote?: T; name?: T; by: T }; after: T; reply: T }
> = {
  mooca: {
    hello: { en: 'Welcome back. What’s the weather like in there?', th: 'กลับมาแล้ว ตอนนี้อากาศในใจเป็นยังไงบ้าง?' },
    teach: {
      en: 'Is that a fact, or a forecast? Thoughts like that often hide a thinking trap, like an all-or-nothing word.',
      th: 'นั่นคือข้อเท็จจริง หรือแค่พยากรณ์? ความคิดแบบนี้มักซ่อนกับดักความคิด เช่นคำแบบขาวหรือดำ',
    },
    idea: { name: { en: 'Thinking traps', th: 'กับดักความคิด' }, by: { en: 'Cognitive behavioural therapy', th: 'การบำบัดความคิดและพฤติกรรม (CBT)' } },
    after: { en: 'Say it again without the trap word. Is it still true?', th: 'ลองพูดใหม่โดยไม่ใช้คำนั้น ยังจริงอยู่ไหม?' },
    reply: { en: 'Softer. And still true.', th: 'นุ่มลง และยังจริงอยู่' },
  },
  hin: {
    hello: { en: 'Back again. What’s heavy today?', th: 'กลับมาอีกแล้ว วันนี้อะไรหนัก?' },
    teach: {
      en: 'Two piles: what’s yours to move, and what isn’t. Which is this, mostly?',
      th: 'แบ่งเป็นสองกอง: ส่วนที่เราขยับได้ กับส่วนที่ไม่ใช่ เรื่องนี้ส่วนใหญ่อยู่กองไหน?',
    },
    idea: {
      quote: { en: 'Some things are within our power, while others are not.', th: 'บางสิ่งอยู่ในอำนาจของเรา บางสิ่งไม่ได้อยู่' },
      by: { en: 'Epictetus, Enchiridion 1', th: 'เอพิคทิตัส, เอนคิริเดียน 1' },
    },
    after: { en: 'Then push only on your part. The rest isn’t your job tonight.', th: 'งั้นออกแรงแค่ส่วนของเรา ที่เหลือไม่ใช่หน้าที่เราคืนนี้' },
    reply: { en: 'My part. I can do that.', th: 'ส่วนของฉัน ทำได้' },
  },
  bua: {
    hello: { en: 'Hello again. Let’s sit a moment before we talk.', th: 'สวัสดีอีกครั้ง นั่งพักด้วยกันสักครู่ก่อนนะ' },
    teach: {
      en: 'There’s the feeling, and there’s what we tell ourselves about it. That second one, we can set down.',
      th: 'มีความรู้สึก และมีเรื่องที่เราเล่าซ้ำให้ตัวเองฟัง อย่างหลังนี้ เราวางลงได้',
    },
    idea: { name: { en: 'The second arrow', th: 'ลูกศรดอกที่สอง' }, by: { en: 'The Buddha, Sallatha Sutta', th: 'พระพุทธเจ้า, สัลลัตถสูตร' } },
    after: { en: 'And like everything, this feeling will change. It already is.', th: 'และเหมือนทุกสิ่ง ความรู้สึกนี้จะเปลี่ยนไป ตอนนี้มันก็กำลังเปลี่ยน' },
    reply: { en: 'Just the first arrow, then 🌸', th: 'งั้นเหลือแค่ลูกศรดอกแรก 🌸' },
  },
}

export const garden = {
  continueWith: { en: 'Continue with {name}', th: 'คุยต่อกับ{name}' },
  tonight: { en: 'For you tonight', th: 'สำหรับคุณคืนนี้' },
  courses: { en: 'Courses for real problems', th: 'คอร์สสำหรับปัญหาจริง' },
  talkNow: { en: 'Talk to a psychologist', th: 'คุยกับนักจิตวิทยา' },
  availableNow: { en: '3 available now', th: 'ว่างตอนนี้ 3 คน' },
  here: { en: 'here for you', th: 'อยู่ตรงนี้นะ' },
  message: { en: 'Message {name}…', th: 'พิมพ์ถึง{name}…' },
  pickedFor: { en: 'Picked for your thought', th: 'เลือกมาให้ความคิดของคุณ' },
  voicedBy: { en: 'With Napa, ooca psychologist', th: 'กับคุณนภา นักจิตวิทยา ooca' },
  upNext: { en: 'Up next', th: 'ถัดไป' },
  suggested: { en: '{name} thought talking to someone might help', th: '{name}คิดว่าการได้คุยกับใครสักคนน่าจะช่วยได้' },
  psychologist: { en: 'Psychologist', th: 'นักจิตวิทยา' },
  now: { en: 'Now', th: 'ตอนนี้' },
  book: { en: 'Book a video call', th: 'นัดคุยผ่านวิดีโอ' },
  private: { en: 'Your cards are shared only if you choose', th: 'การ์ดของคุณแชร์เฉพาะเมื่อคุณเลือก' },
  members: { en: 'Members’ price', th: 'ราคาสมาชิก' },
  today: { en: 'Today', th: 'วันนี้' },
}

export const psychologists: { name: T; focus: T; slots: string[]; tint: string; hair: string; skin: string }[] = [
  { name: { en: 'Napa', th: 'คุณนภา' }, focus: { en: 'Stress · Work', th: 'ความเครียด · งาน' }, slots: ['now', '19:30'], tint: '#d7f3ef', hair: '#3b2f2f', skin: '#f2cfb3' },
  { name: { en: 'Ton', th: 'คุณต้น' }, focus: { en: 'Anxiety · Sleep', th: 'ความกังวล · การนอน' }, slots: ['20:00', '21:00'], tint: '#fbeccb', hair: '#2b2622', skin: '#e3b591' },
  { name: { en: 'Mind', th: 'คุณมายด์' }, focus: { en: 'Self-worth · Love', th: 'คุณค่าในตัวเอง · ความรัก' }, slots: ['20:30'], tint: '#fde3e2', hair: '#4a3328', skin: '#f5d6bf' },
]

/** The lesson after this one, so the player has somewhere to go */
export const upNextFor = (who: Companion, theme: Theme): Lesson => {
  const now = lessonFor(who, theme)
  const base = LESSONS[who].base
  return now.title.en === base.title.en ? Object.values(LESSONS[who].by)[0] ?? base : base
}

// Each course and lesson has its own cover art: abstract shapes on a soft wash, none of them the
// friends, so the library reads as ooca's own and each idea gets a picture of its own
export type CoverArt = 'swirl' | 'moon' | 'battery' | 'apart' | 'pages' | 'nest' | 'bubble' | 'half' | 'circle' | 'scale' | 'sunset' | 'path' | 'ripple' | 'petals' | 'scan'
export interface Cover {
  art: CoverArt
  from: string
  to: string
  ink: string
}
const COVERS: Record<string, Cover> = {
  Overthinking: { art: 'swirl', from: '#cdeffa', to: '#e9e2fb', ink: '#5b6fd6' },
  'Can’t sleep': { art: 'moon', from: '#2c3a6b', to: '#4b5aa0', ink: '#ffe6a3' },
  'Work burnout': { art: 'battery', from: '#ffe2b8', to: '#ffc9a8', ink: '#e0672e' },
  'After a breakup': { art: 'apart', from: '#fde0e3', to: '#f3d9f4', ink: '#d9577a' },
  'Exam stress': { art: 'pages', from: '#d9f5e4', to: '#cdeef2', ink: '#1f9a7a' },
  'New parent': { art: 'nest', from: '#fff1c9', to: '#fde3d3', ink: '#e59a1c' },
  'A thought isn’t a fact': { art: 'bubble', from: '#d6f4f1', to: '#dbe8fb', ink: '#00968a' },
  'When your mind won’t stop': { art: 'swirl', from: '#e2e6fb', to: '#d5f1f6', ink: '#5b6fd6' },
  'Running on empty': { art: 'half', from: '#ffe5c2', to: '#fbd3c4', ink: '#e0672e' },
  'What’s in your control': { art: 'circle', from: '#fdeec8', to: '#f8dcb4', ink: '#c77d00' },
  'Measuring yourself fairly': { art: 'scale', from: '#fbecc9', to: '#e9f3d6', ink: '#b57a00' },
  'The evening review': { art: 'sunset', from: '#ffd9b8', to: '#e7cdf2', ink: '#d0602f' },
  'Life questions: what matters': { art: 'path', from: '#e0eefc', to: '#fbe7d0', ink: '#4a74c9' },
  'Five breaths to let go': { art: 'ripple', from: '#fde3e2', to: '#dff2fb', ink: '#e0636a' },
  'Kindness, starting with you': { art: 'petals', from: '#fde0e5', to: '#fff0d9', ink: '#e05a77' },
  'Body scan for a busy mind': { art: 'scan', from: '#e6f6ea', to: '#fde6e4', ink: '#3c9b6a' },
}
export const coverFor = (title: T): Cover => COVERS[title.en] ?? COVERS['A thought isn’t a fact']

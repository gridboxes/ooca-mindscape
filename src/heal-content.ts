import type { Lang } from './content'
import type { Companion, Theme } from './mindscape-content'

type T = Record<Lang, string>

// ooca Garden (สวนใจ): a concept for the ooca app, where mooca, Hin and Bua live after Mindscape. Talk to
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
  name: { en: 'ooca Garden', th: 'สวนใจ' },
  pageTitle: { en: 'ooca Garden', th: 'สวนใจ · ooca' },
  newIn: { en: 'New in the ooca app', th: 'ใหม่ในแอป ooca' },

  heroTitle: { en: 'Your friends from Mindscape, any time you need them', th: 'เพื่อนจากที่พักใจ อยู่กับคุณได้ทุกเวลา' },
  heroLead: {
    en: 'Your garden is where mooca, Hin and Bua live. Come back any day to talk things through, listen to short lessons, and talk to a real psychologist when you need one.',
    th: 'สวนใจคือบ้านของมูก้า หิน และบัว กลับมาได้ทุกวัน คุยได้ทุกเรื่อง ฟังบทเรียนสั้นๆ และคุยกับนักจิตวิทยาตัวจริงเมื่อต้องการ',
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
  step2: { en: 'ooca Garden', th: 'สวนใจ' },
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
  carryTitle: { en: 'Carry on with {name} in your garden', th: 'ไปต่อกับ{name}ในสวนใจ' },
  carryCta: { en: 'Open your garden', th: 'เปิดสวนใจ' },
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

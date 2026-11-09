import type { Lang } from './content'

type T = Record<Lang, string>

export type Companion = 'mooca' | 'hin' | 'bua'
export type Theme = 'worth' | 'fear' | 'tired' | 'alone' | 'regret' | 'compare' | 'overthink' | 'meaning' | 'general'

export const companions: Record<Companion, { name: T; lens: T; method: T; place: 'sky' | 'earth' | 'water' }> = {
  mooca: {
    name: { en: 'mooca', th: 'มูก้า' },
    lens: { en: 'Psychology', th: 'จิตวิทยา' },
    method: { en: 'Rewriting the forecast', th: 'เขียนพยากรณ์ใจใหม่' },
    place: 'sky',
  },
  hin: {
    name: { en: 'Hin', th: 'หิน' },
    lens: { en: 'Philosophy', th: 'ปรัชญา' },
    method: { en: 'A Stoic sitting', th: 'นั่งคิดแบบสโตอิก' },
    place: 'earth',
  },
  bua: {
    name: { en: 'Bua', th: 'บัว' },
    lens: { en: 'Buddhism', th: 'ธรรมะ' },
    method: { en: 'Notice, let go, be kind', th: 'สังเกต ปล่อย ใจดี' },
    place: 'water',
  },
}

export const COMPANION_ORDER: Companion[] = ['mooca', 'hin', 'bua']

// The common thoughts offered at the door, each tied to a theme
export const thoughts: { theme: Exclude<Theme, 'general'>; text: T }[] = [
  { theme: 'worth', text: { en: 'I’m not good enough', th: 'ฉันยังดีไม่พอ' } },
  { theme: 'fear', text: { en: 'What if it all goes wrong?', th: 'ถ้ามันพังขึ้นมาล่ะ' } },
  { theme: 'overthink', text: { en: 'I can’t stop overthinking', th: 'หยุดคิดมากไม่ได้' } },
  { theme: 'tired', text: { en: 'I’m tired of everything', th: 'เหนื่อยกับทุกอย่าง' } },
  { theme: 'compare', text: { en: 'Everyone’s ahead of me', th: 'ใครๆ ก็ไปไกลกว่าเรา' } },
  { theme: 'alone', text: { en: 'Nobody really gets me', th: 'ไม่มีใครเข้าใจเราจริงๆ' } },
  { theme: 'regret', text: { en: 'I keep replaying a mistake', th: 'วนคิดถึงเรื่องที่พลาดไป' } },
  { theme: 'meaning', text: { en: 'What’s the point?', th: 'ทำไปเพื่ออะไร' } },
]

// Words that place a written thought in a theme (first match wins, in this order)
const THEME_WORDS: [Exclude<Theme, 'general'>, string[]][] = [
  ['regret', ['mistake', 'regret', 'guilt', 'sorry', 'shame', 'พลาด', 'ผิด', 'เสียใจ', 'รู้สึกผิด', 'อาย']],
  ['alone', ['alone', 'lonely', 'nobody', 'no one', 'friends', 'เหงา', 'คนเดียว', 'ไม่มีใคร', 'โดดเดี่ยว']],
  ['meaning', ['point', 'meaning', 'purpose', 'empty', 'why bother', 'ความหมาย', 'เพื่ออะไร', 'ว่างเปล่า', 'ไร้ค่า']],
  ['compare', ['ahead', 'behind', 'compare', 'everyone else', 'others', 'เปรียบเทียบ', 'คนอื่น', 'ไปไกล', 'ตามไม่ทัน']],
  ['fear', ['scared', 'afraid', 'fear', 'anxious', 'what if', 'future', 'exam', 'กลัว', 'กังวล', 'อนาคต', 'ถ้าเกิด', 'สอบ']],
  ['tired', ['tired', 'exhausted', 'burnt', 'burnout', 'drained', 'เหนื่อย', 'หมดไฟ', 'ล้า', 'หมดแรง']],
  ['overthink', ['overthink', 'can’t stop', "can't stop", 'keep thinking', 'คิดมาก', 'คิดวน', 'ฟุ้งซ่าน']],
  ['worth', ['enough', 'worth', 'fail', 'useless', 'stupid', 'not good', 'ไม่ดีพอ', 'ไม่เก่ง', 'ห่วย', 'ล้มเหลว', 'ไม่มีค่า']],
]

export function themeOf(text: string): Theme {
  const s = text.toLowerCase()
  for (const [theme, words] of THEME_WORDS) {
    if (words.some((w) => s.includes(w))) return theme
  }
  return 'general'
}

// Written thoughts that may mean someone is unsafe. A match opens the crisis sheet gently;
// it never blocks the user from going on.
const RISK_WORDS = [
  'kill myself',
  'suicide',
  'end it all',
  'end my life',
  'want to die',
  'hurt myself',
  'self harm',
  'self-harm',
  'not be here',
  'no reason to live',
  'want to disappear',
  'don’t want to wake up',
  "don't want to wake up",
  'ฆ่าตัวตาย',
  'อยากตาย',
  'ไม่อยากอยู่',
  'ไม่อยากมีชีวิต',
  'ทำร้ายตัวเอง',
  'จบชีวิต',
  'อยากหายไป',
  'ไม่อยากตื่น',
  'อยู่ไปทำไม',
]

export const atRisk = (text: string) => {
  const s = text.toLowerCase()
  return RISK_WORDS.some((w) => s.includes(w))
}

// What each companion says first about the thought: one line, in its own voice
export const voices: Record<Theme, Record<Companion, T>> = {
  worth: {
    mooca: {
      en: 'That’s a heavy label to carry. Let’s see what weather sits under it.',
      th: 'ป้ายนี้หนักนะ ลองมาดูกันว่าข้างใต้มีอากาศแบบไหนอยู่',
    },
    hin: {
      en: 'Good enough by whose measure? Let’s check who’s holding the ruler.',
      th: 'ดีพอตามไม้บรรทัดของใคร ลองดูกันว่าใครถือมันอยู่',
    },
    bua: {
      en: 'A lotus still in the mud is no less a lotus.',
      th: 'บัวที่ยังอยู่ในโคลน ก็ยังเป็นบัวอยู่ดีนะ',
    },
  },
  fear: {
    mooca: {
      en: 'Your mind is forecasting storms. Let’s check today’s actual sky.',
      th: 'ใจกำลังพยากรณ์พายุ ลองมาดูท้องฟ้าจริงของวันนี้กัน',
    },
    hin: {
      en: 'It hasn’t happened. We suffer more in imagination than in reality.',
      th: 'มันยังไม่เกิดขึ้นเลย เราทุกข์ในจินตนาการมากกว่าในความจริง',
    },
    bua: {
      en: 'Right now the future is only a thought. Come back to this breath.',
      th: 'ตอนนี้อนาคตเป็นแค่ความคิด กลับมาอยู่กับลมหายใจนี้ก่อน',
    },
  },
  overthink: {
    mooca: {
      en: 'Thoughts start to feel like facts when they repeat. Let’s name them.',
      th: 'ความคิดที่วนซ้ำ มักรู้สึกเหมือนความจริง ลองมาตั้งชื่อให้มันกัน',
    },
    hin: {
      en: 'You’ve turned this stone a hundred times. Let’s turn it once, properly.',
      th: 'พลิกหินก้อนนี้มาร้อยรอบแล้ว ลองพลิกให้ดีๆ สักรอบเดียว',
    },
    bua: {
      en: 'Thoughts rise and pass like ripples. You don’t have to follow each one.',
      th: 'ความคิดเกิดแล้วก็ดับ เหมือนระลอกน้ำ ไม่ต้องตามไปทุกวง',
    },
  },
  tired: {
    mooca: {
      en: 'Running on empty is a signal, not a weakness. Let’s check your battery.',
      th: 'แบตใกล้หมดคือสัญญาณ ไม่ใช่ความอ่อนแอ ลองมาเช็กแบตกัน',
    },
    hin: {
      en: 'Even stones rest. Which of these loads is actually yours to carry?',
      th: 'หินยังต้องพักเลย ของที่แบกอยู่ ชิ้นไหนเป็นของเราจริงๆ',
    },
    bua: {
      en: 'Muddy water clears when it’s left still. Let’s be still for a moment.',
      th: 'น้ำขุ่นจะใสเองเมื่อได้นิ่ง ลองนิ่งไปด้วยกันสักครู่',
    },
  },
  compare: {
    mooca: {
      en: 'Comparing puts their highlights next to your behind-the-scenes.',
      th: 'การเปรียบเทียบคือเอาไฮไลต์ของคนอื่น มาวัดกับเบื้องหลังของเรา',
    },
    hin: {
      en: 'Their path isn’t in your control. Your next step is.',
      th: 'เส้นทางของเขาไม่ได้อยู่ในมือเรา แต่ก้าวต่อไปของเราอยู่',
    },
    bua: {
      en: 'Lotuses don’t all bloom on the same day. Neither do people.',
      th: 'บัวไม่ได้บานพร้อมกันทุกดอก คนก็เหมือนกัน',
    },
  },
  alone: {
    mooca: {
      en: 'Loneliness is like hunger: it means a need is real, not that you’re unlovable.',
      th: 'ความเหงาเหมือนความหิว มันบอกว่าเราต้องการใครสักคน ไม่ได้แปลว่าเราไม่น่ารัก',
    },
    hin: {
      en: 'Aristotle put friendship at the centre of a good life. Wanting it is wise.',
      th: 'อริสโตเติลวางมิตรภาพไว้กลางชีวิตที่ดี การต้องการมันคือความฉลาด',
    },
    bua: {
      en: 'Every lotus shares one pond. Let’s send some kindness your way first.',
      th: 'บัวทุกดอกอยู่ในบึงเดียวกัน ลองส่งความใจดีให้ตัวเองก่อนนะ',
    },
  },
  regret: {
    mooca: {
      en: 'Replaying it is your mind trying to protect you. Let’s turn the volume down.',
      th: 'การวนคิดคือใจพยายามปกป้องเรา ลองค่อยๆ เบาเสียงมันลงกัน',
    },
    hin: {
      en: 'The past is out of your hands. What you do next isn’t.',
      th: 'อดีตอยู่นอกมือเราแล้ว แต่สิ่งที่ทำต่อจากนี้ยังอยู่ในมือ',
    },
    bua: {
      en: 'The mistake has passed. Only the replay is still here. Let’s set it on the water.',
      th: 'เรื่องนั้นผ่านไปแล้ว เหลือแค่การฉายซ้ำ ลองวางมันลงบนน้ำกัน',
    },
  },
  meaning: {
    mooca: {
      en: 'Feeling empty is often exhaustion talking. Let’s see how you really are.',
      th: 'ความว่างเปล่ามักเป็นเสียงของความเหนื่อย ลองดูกันว่าจริงๆ เราเป็นยังไง',
    },
    hin: {
      en: 'Nietzsche said a person with a why can bear almost any how. Let’s find a small why.',
      th: 'นีทเช่บอกว่า ถ้ามีเหตุผลให้อยู่ เราทนได้แทบทุกอย่าง ลองหาเหตุผลเล็กๆ กัน',
    },
    bua: {
      en: 'A lotus doesn’t ask why it blooms. Let’s start with what’s here today.',
      th: 'ดอกบัวไม่ถามว่าบานเพื่ออะไร ลองเริ่มจากสิ่งที่อยู่ตรงหน้าวันนี้',
    },
  },
  general: {
    mooca: {
      en: 'Thank you for telling me. Let’s see what weather this brings.',
      th: 'ขอบคุณที่เล่าให้ฟังนะ ลองมาดูกันว่ามันพาอากาศแบบไหนมา',
    },
    hin: {
      en: 'Let’s turn it over and see which side is yours.',
      th: 'ลองพลิกดูกันว่าด้านไหนเป็นของเรา',
    },
    bua: {
      en: 'Let’s sit with it for one breath, without pushing it away.',
      th: 'ลองอยู่กับมันสักหนึ่งลมหายใจ โดยไม่ต้องผลักมันออกไป',
    },
  },
}

// The line each companion leaves you with on the closing card
export const keepLines: Record<Companion, T> = {
  mooca: {
    en: 'You’re the sky, not the weather passing through.',
    th: 'คุณคือท้องฟ้า ไม่ใช่อากาศที่ผ่านมาแล้วก็ไป',
  },
  hin: {
    en: 'Find the part that’s yours to move. Let the rest be.',
    th: 'หาส่วนที่เป็นของเรา แล้วขยับแค่ส่วนนั้น ที่เหลือปล่อยไว้',
  },
  bua: {
    en: 'This, too, will pass.',
    th: 'สิ่งนี้ก็จะผ่านไปเช่นกัน',
  },
}

// The next step in plain words, for rooms that don't speak in weather (mooca's uses Inner Weather's)
export const nextSteps: Record<'keep' | 'watch' | 'care', { title: T; body: T; cta: T }> = {
  keep: {
    title: { en: 'Keep this card', th: 'เก็บการ์ดนี้ไว้' },
    body: {
      en: 'Save your card and come back whenever a thought gets heavy. It gets easier with practice.',
      th: 'บันทึกการ์ดไว้ แล้วกลับมาเมื่อความคิดไหนเริ่มหนัก ยิ่งฝึกบ่อยก็ยิ่งง่ายขึ้น',
    },
    cta: { en: 'Save my card', th: 'บันทึกการ์ดของฉัน' },
  },
  watch: {
    title: { en: 'Check in again tomorrow', th: 'กลับมาเช็กอินอีกครั้งพรุ่งนี้' },
    body: {
      en: 'Thoughts change. Coming back for a few days helps you tell a passing worry from one that’s staying.',
      th: 'ความคิดเปลี่ยนได้ การกลับมาสักสองสามวันช่วยให้แยกออกว่าเป็นแค่ความกังวลที่ผ่านมา หรือเป็นเรื่องที่อยู่นาน',
    },
    cta: { en: 'Save my card', th: 'บันทึกการ์ดของฉัน' },
  },
  care: {
    title: { en: 'You don’t have to carry this alone', th: 'ไม่ต้องแบกเรื่องนี้ไว้คนเดียว' },
    body: {
      en: 'When a thought has felt this heavy for a while, talking it through with a psychologist can help. ooca psychologists are available by video, from wherever you are.',
      th: 'เมื่อความคิดหนักแบบนี้มาสักพัก การได้คุยกับนักจิตวิทยาช่วยได้นะ นักจิตวิทยาของ ooca พร้อมคุยผ่านวิดีโอคอล จากที่ไหนก็ได้',
    },
    cta: { en: 'Talk to someone at ooca', th: 'คุยกับผู้เชี่ยวชาญที่ ooca' },
  },
}

export const safetyLine = {
  en: 'If it ever feels unsafe, call 1323 any time (free, 24 hrs).',
  th: 'ถ้ารู้สึกไม่ปลอดภัย โทร 1323 ได้ตลอด 24 ชม. ฟรี',
}

// When no line stands out, mooca picks a room by theme
export const moocaPicks: Record<Theme, Companion> = {
  worth: 'hin',
  fear: 'bua',
  overthink: 'bua',
  tired: 'mooca',
  compare: 'hin',
  alone: 'mooca',
  regret: 'hin',
  meaning: 'mooca',
  general: 'mooca',
}

export const ms = {
  brand: { en: 'Mindscape', th: 'ที่พักใจ' },

  // landing
  landKicker: { en: 'Three friends. One landscape. Your thought.', th: 'สามเพื่อนใจ หนึ่งที่พักใจ กับความคิดของคุณ' },
  landTitle: { en: 'Bring one thought. See it three ways.', th: 'นำความคิดมาหนึ่งเรื่อง แล้วมองมันในสามมุม' },
  landBody: {
    en: 'mooca, Hin and Bua each see it differently: through psychology, philosophy and Buddhism. Pick the one that speaks to you.',
    th: 'มูก้า หิน และบัว มองมันต่างกัน ผ่านจิตวิทยา ปรัชญา และธรรมะ เลือกเพื่อนที่พูดตรงใจคุณที่สุด',
  },
  meta1: { en: '~2 minutes', th: 'ประมาณ 2 นาที' },
  meta2: { en: 'Anonymous', th: 'ไม่ระบุตัวตน' },
  meta3: { en: 'Stays on your device', th: 'ข้อมูลอยู่ในเครื่องคุณ' },
  start: { en: 'Bring a thought', th: 'นำความคิดมาวาง' },
  disclaimer: { en: 'A reflection tool, not a diagnosis or therapy.', th: 'เครื่องมือสำรวจใจ ไม่ใช่การวินิจฉัยหรือการบำบัด' },

  // thought
  qThought: { en: 'What’s weighing on you?', th: 'ตอนนี้อะไรหนักใจอยู่?' },
  qThoughtSub: { en: 'Pick the one closest, or write your own.', th: 'เลือกข้อที่ใกล้ที่สุด หรือเขียนเองก็ได้' },
  writeOwn: { en: 'Write my own', th: 'เขียนเอง' },
  writePlaceholder: { en: 'Write it the way it sounds in your head', th: 'เขียนแบบที่มันดังอยู่ในหัว' },
  writeNote: { en: 'Only you see this. It isn’t saved anywhere.', th: 'เห็นแค่คุณคนเดียว ไม่มีการบันทึกไว้ที่ไหน' },
  useChips: { en: 'Choose from the list', th: 'เลือกจากรายการ' },


  showMe: { en: 'Hear what they think', th: 'ฟังว่าเพื่อนๆ คิดยังไง' },

  // voices
  qVoices: { en: 'Three friends, three ways of seeing', th: 'สามเพื่อน สามมุมมอง' },
  qVoicesSub: { en: 'Pick the one that speaks to you.', th: 'เลือกคำที่พูดตรงใจคุณที่สุด' },
  goWith: { en: 'Go with {name}', th: 'ไปกับ{name}' },
  notSure: { en: 'Not sure? Choose for me', th: 'ไม่แน่ใจ? ช่วยเลือกให้หน่อย' },
  meaningNote: {
    en: 'If “what’s the point” ever means not wanting to be here, please call 1323. It’s free, 24 hours.',
    th: 'ถ้า “ทำไปเพื่ออะไร” เคยหมายถึงไม่อยากอยู่ต่อ โทร 1323 ได้ฟรี ตลอด 24 ชม.',
  },

  // room (entry): shown under the progress bar on a room's first step
  roomKicker: { en: 'With {name} · {method}', th: 'กับ{name} · {method}' },

  // mooca's room
  continue: { en: 'Continue', th: 'ไปต่อ' },
  seeCard: { en: 'See my card', th: 'ดูการ์ดของฉัน' },

  // the shared ending
  qDuration: {
    en: 'Before you go, how long has this been with you?',
    th: 'ก่อนไป ความรู้สึกนี้อยู่กับคุณมานานแค่ไหนแล้ว?',
  },
  closingTitle: { en: 'What you’re taking with you', th: 'สิ่งที่คุณนำติดตัวไป' },
  // where each room's idea comes from
  sourceMooca: { en: 'Psychology · CBT and ACT', th: 'จิตวิทยา · CBT และ ACT' },
  sourceHin: { en: 'Stoic philosophy · the roots of CBT', th: 'ปรัชญาสโตอิก · รากของ CBT' },
  sourceBua: { en: 'Mindfulness · self-compassion', th: 'การฝึกสติ · ความใจดีต่อตัวเอง' },

  // saving and sharing the card
  hideThought: { en: 'Hide my original thought', th: 'ซ่อนความคิดเดิมของฉัน' },
  saveImage: { en: 'Save image', th: 'บันทึกรูป' },
  share: { en: 'Share', th: 'แชร์' },
  saved: { en: 'Saved', th: 'บันทึกแล้ว' },
  call1323: { en: 'Call 1323', th: 'โทร 1323' },

  // one-tap check: no score, just a sense of whether it helped
  feedbackQ: { en: 'Do you understand yourself a little better?', th: 'คุณเข้าใจตัวเองมากขึ้นอีกนิดไหม?' },
  feedbackYes: { en: 'Yes, a little', th: 'ใช่ นิดหนึ่ง' },
  feedbackNo: { en: 'Not really', th: 'ไม่เท่าไหร่' },
  feedbackThanksYes: { en: 'Glad to hear it. That little bit counts.', th: 'ดีใจด้วยนะ แค่นิดเดียวก็มีความหมาย' },
  feedbackThanksNo: {
    en: 'Thanks for being honest. Some days are like that, and talking to someone can help too.',
    th: 'ขอบคุณที่บอกตรงๆ บางวันก็เป็นแบบนี้ และการได้คุยกับใครสักคนก็ช่วยได้นะ',
  },

  cardKicker: { en: 'My Mindscape card', th: 'การ์ดที่พักใจของฉัน' },
  withLabel: { en: 'with {name}', th: 'กับ{name}' },
  again: { en: 'Bring another thought', th: 'นำความคิดอื่นมาวาง' },

  // crisis nudge for written thoughts
  riskTitle: { en: 'Thank you for writing that down', th: 'ขอบคุณที่กล้าเขียนออกมานะ' },
  riskBody: {
    en: 'It sounds really heavy. If you might hurt yourself, please talk to someone now. You can still continue here too.',
    th: 'ฟังดูหนักมากเลย ถ้าคุณอาจทำร้ายตัวเอง โปรดคุยกับใครสักคนตอนนี้ คุณยังทำต่อที่นี่ได้เช่นกัน',
  },

  next: { en: 'Next', th: 'ถัดไป' },
  back: { en: 'Back', th: 'ย้อนกลับ' },
}

export const fill = (s: string, vars: Record<string, string>) =>
  s.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? '')

export type Lang = 'en' | 'th'
export type Weather = 'sunny' | 'partly' | 'foggy' | 'rainy' | 'stormy'
export type Battery = 'low' | 'mid' | 'high'
export type Duration = 'today' | 'days' | 'weeks'
export type BodyKey = 'tense' | 'heavy' | 'restless' | 'head' | 'sleep' | 'fine'
export type MindKey = 'work' | 'people' | 'money' | 'health' | 'future' | 'self' | 'none'
export type ActionKey = 'breathe' | 'ground' | 'kind' | 'reach' | 'setdown' | 'savor'
export type Tier = 'keep' | 'watch' | 'care'

type T = Record<Lang, string>

export interface Answers {
  weather: Weather | null
  word: string | null
  battery: Battery | null
  body: BodyKey[]
  mind: MindKey[]
  duration: Duration | null
}

export const emptyAnswers: Answers = {
  weather: null,
  word: null,
  battery: null,
  body: [],
  mind: [],
  duration: null,
}

export const weathers: Record<Weather, { label: T; hint: T; words: Record<Lang, string[]> }> = {
  sunny: {
    label: { en: 'Sunny', th: 'แดดใส' },
    hint: { en: 'Light, clear, good', th: 'เบาสบาย โล่ง ดี' },
    words: {
      en: ['Content', 'Grateful', 'Energised', 'Calm'],
      th: ['อิ่มใจ', 'ขอบคุณ', 'มีพลัง', 'สงบ'],
    },
  },
  partly: {
    label: { en: 'Partly cloudy', th: 'มีเมฆบางส่วน' },
    hint: { en: 'Okay, a bit mixed', th: 'โอเค แต่ปนๆ กัน' },
    words: {
      en: ['Okay', 'Distracted', 'A little tired', 'Unsettled'],
      th: ['โอเค', 'ใจลอย', 'เหนื่อยนิดๆ', 'ไม่ค่อยนิ่ง'],
    },
  },
  foggy: {
    label: { en: 'Foggy', th: 'หมอกลง' },
    hint: { en: 'Blank, numb, unclear', th: 'มึนๆ ว่างเปล่า ไม่ชัด' },
    words: {
      en: ['Numb', 'Unmotivated', 'Lost', 'Bored'],
      th: ['ชา', 'ไม่มีแรงจูงใจ', 'หลงทาง', 'เบื่อ'],
    },
  },
  rainy: {
    label: { en: 'Rainy', th: 'ฝนตก' },
    hint: { en: 'Heavy, low, down', th: 'หนักใจ ดิ่ง เศร้า' },
    words: {
      en: ['Sad', 'Lonely', 'Disappointed', 'Drained'],
      th: ['เศร้า', 'เหงา', 'ผิดหวัง', 'หมดแรง'],
    },
  },
  stormy: {
    label: { en: 'Stormy', th: 'พายุเข้า' },
    hint: { en: 'Overwhelmed, tense, on edge', th: 'ท่วมท้น ตึง กระวนกระวาย' },
    words: {
      en: ['Anxious', 'Overwhelmed', 'Frustrated', 'Angry'],
      th: ['วิตกกังวล', 'รับไม่ไหว', 'หงุดหงิด', 'โกรธ'],
    },
  },
}

export const batteries: Record<Battery, { label: T }> = {
  low: { label: { en: 'Running on empty', th: 'แบตใกล้หมด' } },
  mid: { label: { en: 'Getting by', th: 'พอไปได้' } },
  high: { label: { en: 'Charged up', th: 'แบตเต็ม' } },
}

export const bodies: Record<BodyKey, T> = {
  tense: { en: 'Tight chest or shoulders', th: 'แน่นอก ไหล่ตึง' },
  heavy: { en: 'Heavy, tired body', th: 'ตัวหนัก เพลีย' },
  restless: { en: 'Restless, can’t sit still', th: 'กระสับกระส่าย' },
  head: { en: 'Headache or tight jaw', th: 'ปวดหัว กรามตึง' },
  sleep: { en: 'Not sleeping well', th: 'นอนไม่ค่อยหลับ' },
  fine: { en: 'Body feels fine', th: 'ร่างกายปกติดี' },
}

export const minds: Record<MindKey, T> = {
  work: { en: 'Work or study', th: 'งาน / การเรียน' },
  people: { en: 'People & relationships', th: 'คนรอบตัว / ความสัมพันธ์' },
  money: { en: 'Money', th: 'เรื่องเงิน' },
  health: { en: 'Health', th: 'สุขภาพ' },
  future: { en: 'The future', th: 'อนาคต' },
  self: { en: 'How I see myself', th: 'มุมมองต่อตัวเอง' },
  none: { en: 'Nothing specific', th: 'ไม่มีอะไรเฉพาะ' },
}

export const durations: Record<Duration, T> = {
  today: { en: 'Just today', th: 'แค่วันนี้' },
  days: { en: 'A few days', th: 'สองสามวันแล้ว' },
  weeks: { en: 'Two weeks or more', th: 'สองสัปดาห์ขึ้นไป' },
}

export const ui = {
  brand: { en: 'Inner Weather', th: 'สภาพอากาศในใจ' },
  helpNow: { en: 'Need help now?', th: 'ต้องการความช่วยเหลือด่วน?' },
  introHi: { en: 'Hi, I’m mooca', th: 'สวัสดี เราชื่อมูก้า' },
  introTitle: {
    en: 'What’s the weather like inside you today?',
    th: 'วันนี้อากาศในใจคุณเป็นแบบไหน?',
  },
  introBody: {
    en: 'A 2-minute check-in to name what you feel, understand it a little better, and find one small next step.',
    th: 'เช็กอินใจ 2 นาที เพื่อเรียกชื่อความรู้สึก เข้าใจมันมากขึ้นอีกนิด และหาก้าวเล็กๆ ถัดไป',
  },
  introMeta1: { en: '~2 minutes', th: 'ประมาณ 2 นาที' },
  introMeta2: { en: 'Anonymous', th: 'ไม่ระบุตัวตน' },
  introMeta3: { en: 'Stays on your device', th: 'ข้อมูลอยู่ในเครื่องคุณ' },
  start: { en: 'Start check-in', th: 'เริ่มเช็กอิน' },
  disclaimer: {
    en: 'This is a reflection tool, not a diagnosis.',
    th: 'นี่คือเครื่องมือสำรวจใจ ไม่ใช่การวินิจฉัย',
  },
  recent: { en: 'Your recent skies', th: 'ท้องฟ้าช่วงที่ผ่านมา' },
  back: { en: 'Back', th: 'ย้อนกลับ' },
  next: { en: 'Next', th: 'ถัดไป' },
  skip: { en: 'Skip', th: 'ข้าม' },
  seeReport: { en: 'See my weather report', th: 'ดูรายงานอากาศของฉัน' },
  stepOf: { en: 'Step {n} of {t}', th: 'ขั้นที่ {n} จาก {t}' },

  qWeather: { en: 'Pick the weather that feels closest', th: 'เลือกสภาพอากาศที่ใกล้กับใจที่สุด' },
  qWeatherSub: { en: 'No right answer. Go with your gut.', th: 'ไม่มีคำตอบผิด เลือกตามความรู้สึกแรก' },
  qWord: { en: 'Which word fits a little better?', th: 'คำไหนตรงกับใจมากกว่า?' },
  qWordSub: { en: 'Optional. Naming a feeling can soften it.', th: 'ไม่บังคับ การเรียกชื่อความรู้สึกช่วยให้มันเบาลงได้' },
  qBattery: { en: 'How’s your battery?', th: 'แบตเตอรี่ของคุณเหลือเท่าไหร่?' },
  qBatterySub: { en: 'Your energy right now, body and mind.', th: 'พลังงานตอนนี้ ทั้งกายและใจ' },
  qBody: { en: 'Where do you notice it in your body?', th: 'ร่างกายรู้สึกอย่างไรบ้าง?' },
  qBodySub: { en: 'Pick any that apply.', th: 'เลือกได้มากกว่าหนึ่งข้อ' },
  qMind: { en: 'What’s taking up space in your mind?', th: 'ช่วงนี้อะไรวนอยู่ในหัวบ้าง?' },
  qMindSub: { en: 'Pick any that apply.', th: 'เลือกได้มากกว่าหนึ่งข้อ' },
  qDuration: { en: 'How long has the sky looked like this?', th: 'ท้องฟ้าเป็นแบบนี้มานานแค่ไหนแล้ว?' },
  qDurationSub: { en: 'This helps suggest the right next step.', th: 'ช่วยให้เราแนะนำก้าวถัดไปได้เหมาะขึ้น' },

  reading: { en: 'mooca is reading your sky…', th: 'มูก้ากำลังอ่านท้องฟ้าของคุณ…' },

  reportKicker: { en: 'Your inner weather report', th: 'รายงานอากาศในใจของคุณ' },
  reportWith: { en: 'with', th: 'พร้อม' },
  feelingLabel: { en: 'Feeling', th: 'ความรู้สึก' },
  batteryLabel: { en: 'Battery', th: 'แบตเตอรี่' },
  onMindLabel: { en: 'On your mind', th: 'สิ่งที่วนในหัว' },
  insightTitle: { en: 'What this might mean', th: 'สิ่งนี้อาจกำลังบอกอะไร' },
  actionTitle: { en: 'One small thing, right now', th: 'สิ่งเล็กๆ ที่ทำได้ตอนนี้' },
  nextTitle: { en: 'Your next step', th: 'ก้าวถัดไปของคุณ' },
  done: { en: 'Done', th: 'ทำแล้ว' },
  didIt: { en: 'Nice. That counts.', th: 'เยี่ยมเลย แค่นี้ก็มีความหมายแล้ว' },
  saveCard: { en: 'Save card', th: 'บันทึกการ์ด' },
  saving: { en: 'Saving…', th: 'กำลังบันทึก…' },
  saveError: { en: 'Couldn’t save the image. Try a screenshot instead.', th: 'บันทึกรูปไม่สำเร็จ ลองแคปหน้าจอแทนนะ' },
  restart: { en: 'Check in again', th: 'เช็กอินอีกครั้ง' },
  notNow: { en: 'Not now', th: 'ไว้ก่อน' },

  breatheStart: { en: 'Start 1-minute breathing', th: 'เริ่มหายใจ 1 นาที' },
  breatheIn: { en: 'Breathe in', th: 'หายใจเข้า' },
  breatheOut: { en: 'Breathe out', th: 'หายใจออก' },
  breatheHold: { en: 'Hold', th: 'ค้างไว้' },
  breatheDone: { en: 'Well done. Notice how you feel now.', th: 'เก่งมาก ลองสังเกตความรู้สึกตอนนี้ดู' },
  breatheStop: { en: 'Stop', th: 'หยุด' },
  tryBreathing: { en: 'Or try 1 minute of breathing', th: 'หรือลองหายใจ 1 นาที' },

  crisisTitle: { en: 'You don’t have to handle this alone', th: 'คุณไม่จำเป็นต้องผ่านเรื่องนี้คนเดียว' },
  crisisBody: {
    en: 'If you’re thinking about hurting yourself, or feel unsafe right now, please reach out to someone now.',
    th: 'หากคุณกำลังคิดจะทำร้ายตัวเอง หรือรู้สึกไม่ปลอดภัยตอนนี้ โปรดติดต่อคนที่ช่วยได้ทันที',
  },
  hotline1323: { en: 'Mental Health Hotline (24 hrs)', th: 'สายด่วนสุขภาพจิต (24 ชม.)' },
  hotline1669: { en: 'Medical emergency', th: 'เหตุฉุกเฉินทางการแพทย์' },
  samaritans: { en: 'Samaritans of Thailand', th: 'สะมาริตันส์ แห่งประเทศไทย' },
  close: { en: 'Close', th: 'ปิด' },
  stormyNote: {
    en: 'If the storm ever feels unsafe, call 1323 any time (free, 24 hrs).',
    th: 'ถ้าพายุในใจทำให้รู้สึกไม่ปลอดภัย โทร 1323 ได้ตลอด 24 ชม. ฟรี',
  },
}

// What mooca says in its speech bubble while the user answers
export const reactions: Record<Weather | 'none', T> = {
  none: { en: 'Take a breath. I’ll be right here.', th: 'หายใจลึกๆ ก่อนนะ เราอยู่ตรงนี้' },
  sunny: { en: 'Ooh, sunshine! Let’s notice it.', th: 'แดดใสเลย! มาสังเกตมันกัน' },
  partly: { en: 'A bit of both. That’s very normal.', th: 'ปนๆ กันไป เป็นเรื่องปกติมากเลย' },
  foggy: { en: 'Foggy days are hard to describe. You’re doing fine.', th: 'วันหมอกลงอธิบายยาก แต่คุณทำได้ดีแล้ว' },
  rainy: { en: 'Thanks for telling me. Rain is allowed here.', th: 'ขอบคุณที่เล่าให้ฟังนะ ที่นี่ฝนตกได้' },
  stormy: { en: 'That sounds like a lot. Let’s go gently.', th: 'ฟังดูหนักเลย ค่อยๆ ไปด้วยกันนะ' },
}

export const actions: Record<ActionKey, { title: T; body: T; interactive?: boolean }> = {
  breathe: {
    title: { en: 'Slow your breath', th: 'หายใจให้ช้าลง' },
    body: {
      en: 'Breathing out longer than you breathe in tells your body it’s safe to slow down. Follow mooca for one minute.',
      th: 'การหายใจออกให้ยาวกว่าหายใจเข้า ช่วยบอกร่างกายว่าปลอดภัยแล้ว ผ่อนลงได้ ลองหายใจตามมูก้า 1 นาที',
    },
    interactive: true,
  },
  ground: {
    title: { en: 'Come back to the room', th: 'กลับมาอยู่กับตรงนี้' },
    body: {
      en: 'Name 5 things you can see, 4 you can touch, 3 you can hear. It gently clears the fog.',
      th: 'บอกชื่อ 5 สิ่งที่มองเห็น 4 สิ่งที่สัมผัสได้ 3 เสียงที่ได้ยิน ช่วยให้หมอกในหัวจางลง',
    },
  },
  kind: {
    title: { en: 'Talk to yourself like a friend', th: 'พูดกับตัวเองเหมือนพูดกับเพื่อน' },
    body: {
      en: 'What would you say to a friend who felt this way today? Say that line to yourself, out loud or in your head.',
      th: 'ถ้าเพื่อนรู้สึกแบบนี้วันนี้ คุณจะพูดอะไรกับเขา ลองพูดประโยคนั้นกับตัวเอง',
    },
  },
  reach: {
    title: { en: 'Send one small message', th: 'ส่งข้อความสั้นๆ หาใครสักคน' },
    body: {
      en: 'Text someone you trust. It can be as simple as “Thinking of you, how are you?” Connection is a quiet kind of shelter.',
      th: 'ทักหาคนที่ไว้ใจ แค่ “คิดถึงนะ เป็นไงบ้าง” ก็พอ การได้เชื่อมต่อกับใครสักคนคือที่หลบฝนอย่างหนึ่ง',
    },
  },
  setdown: {
    title: { en: 'Set one thing down', th: 'วางลงสักหนึ่งเรื่อง' },
    body: {
      en: 'Pick one thing on your list that can wait until tomorrow. Give yourself permission to let it wait.',
      th: 'เลือกหนึ่งเรื่องที่รอถึงพรุ่งนี้ได้ แล้วอนุญาตให้ตัวเองปล่อยมันไว้ก่อน',
    },
  },
  savor: {
    title: { en: 'Bottle the sunshine', th: 'เก็บแสงแดดไว้' },
    body: {
      en: 'Take 20 seconds to notice what made today good. Remembering it helps on cloudier days.',
      th: 'ใช้เวลา 20 วินาทีนึกถึงสิ่งที่ทำให้วันนี้ดี การจำไว้ช่วยได้ในวันที่ฟ้าครึ้ม',
    },
  },
}

export const tiers: Record<Tier, { title: T; body: T; cta: T }> = {
  keep: {
    title: { en: 'Keep a record of good days', th: 'จดวันดีๆ เก็บไว้' },
    body: {
      en: 'Save your card and check in again tomorrow. Over time, your skies show patterns that one day can’t.',
      th: 'บันทึกการ์ดไว้แล้วกลับมาเช็กอินพรุ่งนี้ เมื่อเวลาผ่านไป ท้องฟ้าของคุณจะบอกรูปแบบที่วันเดียวบอกไม่ได้',
    },
    cta: { en: 'Save my card', th: 'บันทึกการ์ดของฉัน' },
  },
  watch: {
    title: { en: 'Check the sky again tomorrow', th: 'กลับมาดูท้องฟ้าอีกครั้งพรุ่งนี้' },
    body: {
      en: 'Weather changes. Checking in for a few days helps you tell a passing cloud from a longer season.',
      th: 'อากาศเปลี่ยนได้ การเช็กอินต่อเนื่องสักสองสามวันช่วยให้แยกออกว่าเป็นแค่เมฆผ่าน หรือเป็นฤดูที่ยาวนาน',
    },
    cta: { en: 'Save my card', th: 'บันทึกการ์ดของฉัน' },
  },
  care: {
    title: { en: 'You don’t have to wait it out alone', th: 'ไม่ต้องรอให้ฟ้าเปิดอยู่คนเดียว' },
    body: {
      en: 'When the sky has looked like this for a while, talking it through with a psychologist can help. ooca psychologists are available by video, from wherever you are.',
      th: 'เมื่อท้องฟ้าเป็นแบบนี้มาสักพัก การได้คุยกับนักจิตวิทยาช่วยได้นะ นักจิตวิทยาของ ooca พร้อมคุยผ่านวิดีโอคอล จากที่ไหนก็ได้',
    },
    cta: { en: 'Talk to someone at ooca', th: 'คุยกับผู้เชี่ยวชาญที่ ooca' },
  },
}

const insightBase: Record<Weather, T> = {
  sunny: {
    en: 'Clear skies. Days like this are worth noticing, not just getting through.',
    th: 'ฟ้าใส วันแบบนี้ควรค่าแก่การสังเกต ไม่ใช่แค่ผ่านมันไป',
  },
  partly: {
    en: 'A mixed sky is the most common kind. You can feel okay and a bit off at the same time.',
    th: 'ฟ้าที่มีเมฆปนๆ คือแบบที่พบบ่อยที่สุด เราโอเคและไม่ค่อยโอเคไปพร้อมกันได้',
  },
  foggy: {
    en: 'Fog often shows up when we’ve been holding a lot for a while. Feeling blank can be your mind asking for a pause.',
    th: 'หมอกมักมาเมื่อเราแบกอะไรไว้นาน ความรู้สึกว่างเปล่าอาจเป็นสัญญาณว่าใจขอพักบ้าง',
  },
  rainy: {
    en: 'Rain is heavy, and it’s also how the ground recovers. Feeling low is a signal, not a weakness.',
    th: 'ฝนทำให้หนัก แต่ก็เป็นวิธีที่ผืนดินฟื้นตัว ความรู้สึกดิ่งคือสัญญาณ ไม่ใช่ความอ่อนแอ',
  },
  stormy: {
    en: 'Storms are your body’s alarm system working hard. It’s trying to protect you, even if it feels like too much.',
    th: 'พายุคือระบบเตือนภัยในตัวเรากำลังทำงานหนัก มันพยายามปกป้องคุณ แม้จะรู้สึกว่ามากเกินไป',
  },
}

const insightExtra = {
  lowBattery: {
    en: 'Your battery is low, so rest right now is maintenance, not laziness.',
    th: 'แบตของคุณใกล้หมด การพักตอนนี้คือการดูแลตัวเอง ไม่ใช่ความขี้เกียจ',
  },
  crowded: {
    en: 'Several things are competing for space in your mind. No wonder it feels full. You don’t have to solve them all today.',
    th: 'มีหลายเรื่องแย่งพื้นที่ในหัว ไม่แปลกที่จะรู้สึกแน่น ไม่จำเป็นต้องแก้ทุกเรื่องในวันนี้',
  },
  bodyStress: {
    en: 'The tightness and restlessness you notice are your stress response showing up in your body.',
    th: 'ความตึงและกระสับกระส่ายที่รู้สึก คือการตอบสนองต่อความเครียดที่แสดงออกทางร่างกาย',
  },
  sleep: {
    en: 'Poor sleep makes every sky look greyer. Be gentle with what you expect of yourself today.',
    th: 'การนอนไม่พอทำให้ทุกอย่างดูหม่นลง ลองลดความคาดหวังกับตัวเองในวันนี้ลงบ้าง',
  },
  self: {
    en: 'When how we see ourselves is on our mind, our inner critic is often loud. It isn’t always accurate.',
    th: 'เมื่อเรื่องมุมมองต่อตัวเองวนอยู่ในหัว เสียงวิจารณ์ในใจมักดังขึ้น และมันไม่ได้ถูกเสมอไป',
  },
  lasting: {
    en: 'This has been around for a couple of weeks, which is worth taking seriously and kindly.',
    th: 'ความรู้สึกนี้อยู่มาสองสัปดาห์แล้ว ควรใส่ใจมันอย่างจริงจังและอ่อนโยน',
  },
  goodEnergy: {
    en: 'You have energy to spare. It’s a good moment to do something that refills others, or future you.',
    th: 'คุณมีพลังเหลือ เป็นจังหวะดีที่จะทำอะไรที่เติมพลังให้คนอื่น หรือให้ตัวเองในวันข้างหน้า',
  },
}

export interface Report {
  weather: Weather
  insight: T[]
  action: ActionKey
  tier: Tier
}

const heavySky = (w: Weather) => w === 'rainy' || w === 'stormy' || w === 'foggy'

export function buildReport(a: Answers): Report {
  const weather = a.weather ?? 'partly'
  const insight: T[] = [insightBase[weather]]

  // One extra line, most specific signal wins
  if (a.duration === 'weeks' && heavySky(weather)) insight.push(insightExtra.lasting)
  else if (a.battery === 'low') insight.push(insightExtra.lowBattery)
  else if (a.body.includes('tense') || a.body.includes('restless')) insight.push(insightExtra.bodyStress)
  else if (a.body.includes('sleep')) insight.push(insightExtra.sleep)
  else if (a.mind.filter((m) => m !== 'none').length >= 3) insight.push(insightExtra.crowded)
  else if (a.mind.includes('self')) insight.push(insightExtra.self)
  else if (a.battery === 'high' && !heavySky(weather)) insight.push(insightExtra.goodEnergy)

  let action: ActionKey
  if (weather === 'stormy' || a.body.includes('tense') || a.body.includes('restless')) action = 'breathe'
  else if (weather === 'foggy') action = 'ground'
  else if (weather === 'rainy') action = a.mind.includes('people') || a.mind.includes('self') ? 'kind' : 'reach'
  else if (weather === 'partly') action = a.mind.filter((m) => m !== 'none').length >= 2 ? 'setdown' : 'breathe'
  else action = 'savor'

  let tier: Tier
  if (heavySky(weather) && a.duration === 'weeks') tier = 'care'
  else if (weather === 'stormy' && a.battery === 'low' && a.duration !== 'today') tier = 'care'
  else if (heavySky(weather) || a.battery === 'low') tier = 'watch'
  else tier = 'keep'

  return { weather, insight, action, tier }
}

export const t = (s: T, lang: Lang) => s[lang]

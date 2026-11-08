import type { Lang } from './content'
import type { Companion } from './mindscape-content'

type T = Record<Lang, string>

// The promo page's copy. The pitch comes from the opportunity brief: "training the mind" is easier
// to say yes to than "therapy", many Thais reach for Dhamma before a psychiatrist, and today there
// is nothing between free AI chat and a paid session. Mindscape is that free first step, and it
// points to an ooca psychologist when things have been heavy for a while.
export const promo = {
  pageTitle: { en: 'Mindscape · ooca', th: 'ที่พักใจ · ooca' },
  brand: { en: 'Mindscape', th: 'ที่พักใจ' },
  newIn: { en: 'New in ooca', th: 'ใหม่ใน ooca' },

  heroTitle: { en: 'Not ready to talk to someone? Start with one thought.', th: 'ยังไม่พร้อมคุยกับใคร? เริ่มจากความคิดเดียว' },
  heroLead: {
    en: 'Mindscape is a free three-minute check-in. Bring what’s on your mind, see it three ways, and leave a little lighter.',
    th: 'ที่พักใจคือการเช็กอินใจฟรี 3 นาที นำสิ่งที่อยู่ในใจมาวาง มองมันในสามมุม แล้วกลับไปด้วยใจที่เบาลง',
  },
  tryFree: { en: 'Try Mindscape, free', th: 'ลองที่พักใจ ฟรี' },
  tryShort: { en: 'Try it', th: 'ลองเลย' },
  meta1: { en: '~3 minutes', th: 'ประมาณ 3 นาที' },
  meta2: { en: 'Anonymous', th: 'ไม่ระบุตัวตน' },
  meta3: { en: 'Stays on your device', th: 'ข้อมูลอยู่ในเครื่องคุณ' },

  friendsTitle: { en: 'Three friends, three ways of seeing', th: 'สามเพื่อน สามมุมมอง' },
  friendsSub: { en: 'Pick the one that speaks to you.', th: 'เลือกเพื่อนที่พูดตรงใจคุณ' },
  does: {
    mooca: { en: 'Soften the heavy words in your thought, and find what it says you care about.', th: 'ทำให้คำที่หนักในความคิดนุ่มลง และค้นพบสิ่งที่คุณใส่ใจ' },
    hin: { en: 'Sort what’s yours to move from what isn’t, then rise above it.', th: 'แยกสิ่งที่ขยับได้ออกจากสิ่งที่ไม่ใช่ แล้วลอยขึ้นไปมอง' },
    bua: { en: 'Notice it, let it drift, and pass some kindness on.', th: 'สังเกตมัน ปล่อยให้ลอยไป แล้วส่งความใจดีต่อไป' },
  } as Record<Companion, T>,

  leaveTitle: { en: 'What you leave with', th: 'สิ่งที่คุณได้กลับไป' },
  point1: { en: 'A card to keep. ', th: 'การ์ดเก็บไว้ ' },
  point1Body: { en: 'Your thought, seen a little differently. Save it or share it.', th: 'ความคิดเดิมที่มองต่างไปนิดหนึ่ง บันทึกหรือแชร์ได้' },
  point2: { en: 'One small thing to do. ', th: 'สิ่งเล็กๆ ที่ทำได้ ' },
  point2Body: { en: 'A minute of breathing, a kind message, a first step.', th: 'หายใจหนึ่งนาที ส่งข้อความดีๆ หรือก้าวแรกเล็กๆ' },
  point3: { en: 'A next step that fits. ', th: 'ก้าวต่อไปที่เหมาะกับคุณ ' },
  point3Body: {
    en: 'If it’s been heavy for a while, an ooca psychologist is one tap away.',
    th: 'ถ้ามันหนักมาสักพัก นักจิตวิทยาของ ooca อยู่ห่างแค่แตะเดียว',
  },

  sampleKicker: { en: 'My Mindscape card', th: 'การ์ดที่พักใจของฉัน' },
  sampleWith: { en: 'with mooca', th: 'กับมูก้า' },
  sampleThought: { en: 'Everyone’s ahead of me', th: 'ใครๆ ก็ไปไกลกว่าเรา' },
  sampleNew: { en: 'Some people are on a different path', th: 'บางคนอยู่คนละเส้นทางกับเรา' },
  sampleOldLabel: { en: 'The old forecast', th: 'พยากรณ์เดิม' },
  sampleCareLabel: { en: 'Because I care about', th: 'เพราะฉันใส่ใจ' },
  sampleCare: { en: 'growing', th: 'การได้เติบโต' },

  endTitle: { en: 'Got something on your mind?', th: 'มีอะไรค้างอยู่ในใจไหม?' },
  disclaimer: { en: 'A reflection tool, not a diagnosis or therapy.', th: 'เครื่องมือสำรวจใจ ไม่ใช่การวินิจฉัยหรือการบำบัด' },
  help: {
    en: 'If you ever feel unsafe, call 1323, free and 24 hours.',
    th: 'ถ้ารู้สึกไม่ปลอดภัย โทร 1323 ได้ฟรี ตลอด 24 ชม.',
  },
}

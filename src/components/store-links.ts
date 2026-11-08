/** Where ooca lives in each store. Everything that sends people to the app uses these. */
export const APP_STORE_URL =
  'https://apps.apple.com/th/app/ooca-%E0%B8%9B%E0%B8%A3-%E0%B8%81%E0%B8%A9%E0%B8%B2%E0%B8%9B-%E0%B8%8D%E0%B8%AB%E0%B8%B2%E0%B9%83%E0%B8%88/id1260476046'
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=co.ooca.user'

export type Platform = 'ios' | 'android' | 'other'

/** The visitor's phone platform, if they're on one (iPadOS reports itself as a Mac with touch) */
export function platform(): Platform {
  if (typeof navigator === 'undefined') return 'other'
  const ua = navigator.userAgent
  if (/android/i.test(ua)) return 'android'
  if (/iphone|ipad|ipod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios'
  return 'other'
}

/** The one store link for this visitor: Play on Android, the App Store otherwise */
export function storeUrl(): string {
  return platform() === 'android' ? PLAY_STORE_URL : APP_STORE_URL
}

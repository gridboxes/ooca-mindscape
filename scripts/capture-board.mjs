// Re-renders the presentation board's images from the running app.
//
//   npm run dev              (in another terminal; the app on http://localhost:5173)
//   node scripts/capture-board.mjs            all screens, then the board pages
//   node scripts/capture-board.mjs screens    only public/board/screens/
//   node scripts/capture-board.mjs avatars    only the three friend portraits
//   node scripts/capture-board.mjs endings    only the card and poster screens
//   node scripts/capture-board.mjs sheet      only the identity sheet
//   node scripts/capture-board.mjs mascot     only the mascot update page's images
//   node scripts/capture-board.mjs pages      only public/board/export/
//
// It drives a headless Chrome through the real flow (taps, holds, key presses) and saves each
// screen at 2x: phones at 390×844, the desktop at 1440×900. Needs Google Chrome and Node 22+.

import { spawn } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const BASE = process.env.BASE ?? 'http://localhost:5173'
const CHROME = process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const SCREENS = new URL('../public/board/screens/', import.meta.url).pathname
const EXPORT = new URL('../public/board/export/', import.meta.url).pathname
const PORT = 9333
const only = process.argv[2]

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const log = (...a) => console.log('·', ...a)

// ---------------------------------------------------------------- Chrome over the DevTools protocol

const chrome = spawn(
  CHROME,
  ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'board-'))}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', 'about:blank'],
  { stdio: 'ignore' },
)

async function pageSocket() {
  for (let i = 0; i < 100; i++) {
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json()
      const page = list.find((t) => t.type === 'page')
      if (page) return page.webSocketDebuggerUrl
    } catch {
      // Chrome is still starting
    }
    await sleep(150)
  }
  throw new Error('Chrome did not start')
}

const ws = new WebSocket(await pageSocket())
await new Promise((r) => (ws.onopen = r))
let seq = 0
const pending = new Map()
ws.onmessage = (m) => {
  const d = JSON.parse(m.data)
  if (d.id && pending.has(d.id)) {
    const { res, rej } = pending.get(d.id)
    pending.delete(d.id)
    d.error ? rej(new Error(JSON.stringify(d.error))) : res(d.result)
  }
}
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const id = ++seq
    pending.set(id, { res, rej })
    ws.send(JSON.stringify({ id, method, params }))
  })

async function js(expression) {
  const r = await send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (r.exceptionDetails) throw new Error(`${r.exceptionDetails.exception?.description ?? r.exceptionDetails.text}\n  in: ${expression.slice(0, 160)}`)
  return r.result.value
}

async function viewport(width, height, mobile = true) {
  await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 2, mobile })
}

// Helpers the steps use inside the page; a blink caught mid-frame would look like closed eyes
const PRELUDE = `
  window.wait = (ms) => new Promise((r) => setTimeout(r, ms));
  window.card = () => document.querySelector('.ms__card');
  window.btn = (t) => [...document.querySelectorAll('button')].find((b) => b.offsetParent && b.textContent.trim().startsWith(t));
  window.next = () => [...card().querySelectorAll('.btn--primary')].find((b) => !b.disabled && b.offsetParent);
  if (!document.getElementById('board-still')) {
    const s = document.createElement('style');
    s.id = 'board-still';
    s.textContent = '.idle-blink { animation: none !important; }';
    document.head.appendChild(s);
  }
  true`

async function go(url, settle = 1400) {
  await send('Page.navigate', { url })
  for (let i = 0; i < 100; i++) {
    await sleep(100)
    if ((await js('document.readyState').catch(() => '')) === 'complete') break
  }
  await sleep(settle)
  await js(PRELUDE)
}

/** A fresh visit in one language: nothing saved from an earlier run */
async function fresh(lang = 'en') {
  await go(`${BASE}/`, 300)
  await js(`localStorage.setItem('ooca-mindscape:lang', '${lang}'); sessionStorage.clear(); true`)
  await go(`${BASE}/`)
}

/** Click (or hold) an element with a real mouse, so pointer-driven controls respond */
async function tap(selectorJs, holdMs = 0) {
  const p = await js(`(() => {
    const el = (${selectorJs});
    if (!el) return null;
    el.scrollIntoView({ block: 'center', behavior: 'instant' });
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
  })()`)
  if (!p) throw new Error(`nothing to tap: ${selectorJs}`)
  await sleep(150)
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: p.x, y: p.y })
  await send('Input.dispatchMouseEvent', { type: 'mousePressed', x: p.x, y: p.y, button: 'left', buttons: 1, clickCount: 1 })
  if (holdMs) await sleep(holdMs)
  await send('Input.dispatchMouseEvent', { type: 'mouseReleased', x: p.x, y: p.y, button: 'left', buttons: 0, clickCount: 1 })
  await sleep(450)
}

async function press(key, code, keyCode, times = 1) {
  for (let i = 0; i < times; i++) {
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key, code, windowsVirtualKeyCode: keyCode })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, windowsVirtualKeyCode: keyCode })
    await sleep(60)
  }
}

const click = (selectorJs, after = 900) => js(`(${selectorJs}).click(); wait(${after})`)
const top = () => js(`window.scrollTo({ top: 0, behavior: 'instant' }); wait(450)`)
/** Scroll so the step's heading sits just under the header */
const fromHeading = () =>
  js(`(() => { const h = card().querySelector('h1, h2'); window.scrollTo({ top: h.getBoundingClientRect().top + scrollY - 84, behavior: 'instant' }); return wait(450) })()`)

async function shot(name, clip) {
  const r = await send('Page.captureScreenshot', clip ? { format: 'png', captureBeyondViewport: true, clip: { ...clip, scale: 1 } } : { format: 'png' })
  writeFileSync(join(name.startsWith('/') ? '' : SCREENS, name.startsWith('/') ? name : `${name}.png`), Buffer.from(r.data, 'base64'))
  log('saved', name)
}

// ---------------------------------------------------------------- the flow, step by step

async function intoRoom(thought, who) {
  await click(`document.querySelector('.ms-cta')`, 900)
  await click(`[...document.querySelectorAll('.ms-thought')].find((b) => b.textContent.includes(${JSON.stringify(thought)}))`, 500)
  await click(`document.querySelector('.step-foot .btn--primary')`, 1500)
  await click(`document.querySelector('.ms-voice--${who}')`, 900)
  return click(`next()`, 1600)
}

/** Hin's room up to the rise; `answer` is how much it will matter in a year */
async function hinRoom({ answer, shots = false }) {
  await click(`btn('Something I made got criticised')`, 700)
  if (shots) await top(), await shot('hin-fact')
  await click(`next()`, 1400)
  await tap(`btn('My effort')`), await tap(`btn('Mine to move')`)
  await tap(`btn('My boss’s opinion')`), await tap(`btn('Let it be')`)
  if (shots) await fromHeading(), await shot('hin-sort')
  await tap(`btn('How I talk to myself')`), await tap(`btn('Mine to move')`)
  await tap(`btn('Other people’s results')`), await tap(`btn('Let it be')`)
  await click(`next()`, 1400)
  await click(`btn('Courage')`, 2400)
  if (shots) await top(), await shot('hin-step')
  await click(`next()`, 1400)
  await js(`document.querySelector('[role=slider]').focus(); true`)
  await press('ArrowUp', 'ArrowUp', 38, 12)
  await sleep(2000)
  if (shots) await top(), await shot('hin-rise')
  await click(`btn(${JSON.stringify(answer)})`, 500)
  await click(`next()`, 1600)
}

/** Hin's room, lighter: the card, then the ooca Garden poster once its phone has toured the app (~15s) and come to rest */
async function endings() {
  await viewport(390, 844)
  // Hin's room, lighter: the card and the ooca Garden poster
  await fresh('en')
  await intoRoom('I’m not good enough', 'hin')
  await hinRoom({ answer: 'A little' })
  await sleep(2500)
  await top(), await shot('hin-ending')
  await js(`window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }); wait(17000)`)
  await shot('hin-ending-next')

  // Desktop: the card beside the ooca Garden poster
  await viewport(1440, 900, false)
  await fresh('en')
  await intoRoom('I’m not good enough', 'hin')
  await hinRoom({ answer: 'A little' })
  await sleep(17000)
  await top(), await shot('desk-ending')

}

async function screens() {
  // Landing, thought, voices, then Hin's room heavy for weeks: the care tier
  await viewport(390, 844)
  await fresh('en')
  await shot('m-landing')
  await click(`document.querySelector('.ms-cta')`, 900)
  await click(`document.querySelectorAll('.ms-thought')[0]`, 700)
  await shot('m-thought')
  await click(`document.querySelector('.step-foot .btn--primary')`, 1600)
  await click(`document.querySelector('.ms-voice--hin')`, 1200)
  await top(), await shot('m-voices')
  await click(`next()`, 1600)
  await hinRoom({ answer: 'A lot', shots: true })
  await click(`btn('Two weeks or more')`, 600)
  await top(), await shot('hin-duration')
  await click(`next()`, 4000)
  await js(`document.querySelector('.panel--next').scrollIntoView({ block: 'center', behavior: 'instant' }); wait(500)`)
  await shot('m-care')

  await endings()
  // the endings finish on the desktop size: everything after this is a phone screen again
  await viewport(390, 844)

  // mooca's room
  await fresh('en')
  await intoRoom('Everyone’s ahead of me', 'mooca')
  await click(`btn('Sunny')`, 900)
  await click(`btn('Content')`, 1200)
  await shot('mooca-weather')
  await click(`next()`, 1600)
  await click(`btn('growing')`, 1800)
  await top(), await shot('mooca-lining')
  await click(`next()`, 1600)
  await click(`document.querySelectorAll('.soften__word')[0]`, 1200)
  await shot('mooca-swap')
  await click(`document.querySelector('.soften__swaps .chips button')`, 700)
  await click(`document.querySelectorAll('.soften__word')[1]`, 900)
  await click(`document.querySelector('.soften__swaps .chips button')`, 700)
  await click(`next()`, 5500)
  await top(), await shot('mooca-ending')

  // Bua's room
  await fresh('en')
  await intoRoom('I’m not good enough', 'bua')
  await click(`btn('Chest')`, 700)
  await click(`btn('Uncomfortable')`, 1000)
  await fromHeading(), await shot('bua-body')
  await click(`next()`, 1600)
  await click(`btn('Begin')`, 13500)
  await top(), await shot('bua-lamp')
  // the rest of the five breaths, then on to kindness
  for (let i = 0; i < 70 && !(await js(`!!btn('I hope I’m gentle')`)); i++) {
    if (await js(`!!next()`)) await click(`next()`, 1500)
    else await sleep(1000)
  }
  await click(`btn('I hope I’m gentle')`, 700)
  await tap(`document.querySelector('.kind__hold')`, 6500)
  await sleep(1500)
  await fromHeading(), await shot('bua-kind')
  await click(`next()`, 4500)
  await top(), await shot('bua-ending')

  // Thai
  await fresh('th')
  await shot('th-landing')
  await click(`document.querySelector('.ms-cta')`, 900)
  await click(`document.querySelectorAll('.ms-thought')[0]`, 500)
  await click(`document.querySelector('.step-foot .btn--primary')`, 1600)
  await click(`document.querySelector('.ms-voice--hin')`, 1200)
  await top(), await shot('th-voices')

  await sheet()
}

/** The identity sheet, top of the page */
async function sheet() {
  await viewport(1440, 900, false)
  await go(`${BASE}/?sheet`, 2000)
  await shot('x-sheet-crop', { x: 0, y: 0, width: 1440, height: 1576 })
}

/** Each friend on its own, happy, on its colour (taken from the identity sheet's mood row) */
async function avatars() {
  await viewport(600, 600)
  for (const [name, svg, size, tint] of [
    ['av-mooca', 'svg.mooca--sunny', 190, '#dff5f2, #eefaf8'],
    ['av-hin', 'svg.rock--happy', 170, '#fdf1d8, #fef8ea'],
    ['av-bua', 'svg.lotus--happy', 160, '#fde6e5, #fef3f2'],
  ]) {
    await go(`${BASE}/?sheet`, 1500)
    await js(`(() => {
      const svg = [...document.querySelectorAll('${svg}')].find((s) => !s.closest('.landscape')).cloneNode(true);
      svg.setAttribute('width', ${size}); svg.setAttribute('height', ${size});
      document.body.innerHTML = '';
      document.body.style.cssText = 'margin:0;background:#fff';
      const box = document.createElement('div');
      box.style.cssText = 'position:fixed;left:0;top:0;width:${size}px;height:${size}px;background:linear-gradient(180deg, ${tint})';
      box.appendChild(svg);
      document.body.appendChild(box);
      window.scrollTo(0, 0);
      return wait(600);
    })()`)
    await shot(name, { x: 0, y: 0, width: size, height: size })
  }
}

/** Clip the union of the elements a selector finds (scrolled into view), with a little margin */
async function shotOf(name, selectorJs, pad = 0) {
  const r = await js(`(() => {
    const els = (${selectorJs});
    els[0].scrollIntoView({ block: 'start', behavior: 'instant' });
    const rs = els.map((e) => e.getBoundingClientRect());
    const x = Math.min(...rs.map((r) => r.left)) - ${pad}, y = Math.min(...rs.map((r) => r.top)) + scrollY - ${pad};
    const w = Math.max(...rs.map((r) => r.right)) + ${pad} - x, h = Math.max(...rs.map((r) => r.bottom)) + scrollY + ${pad} - y;
    return { x: Math.max(0, x), y: Math.max(0, y), width: w, height: h };
  })()`)
  await sleep(500)
  await shot(name, r)
}

/** The mascot update page: before and after, the friends' moods, mooca's weathers, what we tried, the moment */
async function mascot() {
  await viewport(1440, 900, false)
  await go(`${BASE}/?sandbox`, 2500)
  // the earlier flat look beside the new one, in the same landscape
  await shotOf('mascot-before-after', `[...document.querySelectorAll('#in-landscape ~ .sbx__scenes .sbx__scene')].slice(0, 2)`)
  // the four floating poses that were tried
  await shotOf('mascot-floating', `[...document.getElementById('g-mooca-floating-options').parentElement.querySelectorAll('.sbx__hero')]`, 6)
  // the three friends in their moods, from the identity sheet
  await go(`${BASE}/?sheet`, 2000)
  await shotOf('mascot-moods', `[document.querySelector('section[aria-labelledby=companions]')]`)
  // mooca's five skies
  await shotOf('mascot-skies', `[document.querySelector('.skies__row')]`)
  // the moment before the card, on a phone
  await viewport(390, 844)
  await fresh('en')
  await intoRoom('I’m not good enough', 'hin')
  await click(`btn('Something I made got criticised')`, 600)
  await click(`next()`, 1400)
  await tap(`btn('My effort')`), await tap(`btn('Mine to move')`)
  await tap(`btn('My boss’s opinion')`), await tap(`btn('Let it be')`)
  await tap(`btn('How I talk to myself')`), await tap(`btn('Mine to move')`)
  await tap(`btn('Other people’s results')`), await tap(`btn('Let it be')`)
  await click(`next()`, 1400)
  await click(`btn('Courage')`, 1800)
  await click(`next()`, 1400)
  await js(`document.querySelector('[role=slider]').focus(); true`)
  await press('ArrowUp', 'ArrowUp', 38, 12)
  await sleep(1500)
  await click(`btn('A little')`, 400)
  await js(`next().click(); wait(1500)`)
  await top(), await shot('mascot-moment')
}

// ---------------------------------------------------------------- the board's pages, one image each

async function pages() {
  await send('Emulation.setDeviceMetricsOverride', { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false })
  await go(`${BASE}/board/index.html`, 1500)
  await js(`document.fonts.ready.then(() => wait(800))`)
  const ids = ['cover', 'opportunity', 'journey', 'rooms', 'flow', 'ending', 'system', 'mascot', 'next']
  for (const [i, id] of ids.entries()) {
    const r = await js(`(() => { const r = document.getElementById('${id}').getBoundingClientRect(); return { x: r.left + scrollX, y: r.top + scrollY, width: r.width, height: r.height } })()`)
    await shot(join(EXPORT, `${String(i + 1).padStart(2, '0')}-${id}.png`), r)
  }
}

try {
  await send('Page.enable')
  if (!only || only === 'screens') await screens()
  if (only === 'endings') await endings()
  if (!only || only === 'mascot') await mascot()
  if (only === 'sheet') await sheet()
  if (!only || only === 'screens' || only === 'avatars') await avatars()
  if (!only || only === 'pages') await pages()
} finally {
  ws.close()
  chrome.kill()
}

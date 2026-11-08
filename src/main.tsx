import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import Mindscape from './Mindscape'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'
import '@fontsource/nunito/800.css'
import '@fontsource/prompt/thai-300.css'
import '@fontsource/prompt/thai-400.css'
import '@fontsource/prompt/thai-500.css'
import '@fontsource/prompt/thai-600.css'
import './styles.css'

// Design-review pages load only when asked for, so people using Mindscape never download them
const Sandbox = lazy(() => import('./Sandbox'))
const IdentitySheet = lazy(() => import('./IdentitySheet'))
const InnerWeather = lazy(() => import('./App'))
const Promo = lazy(() => import('./Promo'))
const Heal = lazy(() => import('./Heal'))

const params = new URLSearchParams(location.search)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      {params.has('sandbox') ? (
        <Sandbox />
      ) : params.has('sheet') ? (
        <IdentitySheet />
      ) : params.has('weather') ? (
        <InnerWeather />
      ) : params.has('promo') ? (
        <Promo />
      ) : params.has('heal') || params.has('garden') ? (
        <Heal />
      ) : (
        <Mindscape />
      )}
    </Suspense>
  </StrictMode>,
)

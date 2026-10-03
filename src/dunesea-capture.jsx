import { createElement } from 'react'
import { createRoot } from 'react-dom/client'
import DuneSea from './components/DuneSea.jsx'

function Capture() {
  return createElement(
    'div',
    { style: { position: 'fixed', inset: 0 } },
    createElement(DuneSea, { active: false })
  )
}

createRoot(document.getElementById('capture-root')).render(createElement(Capture))
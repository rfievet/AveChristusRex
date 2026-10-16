import { BrowserRouter } from 'react-router-dom'
import LocaleRouter from './i18n/LocaleProvider'

// On GitHub Pages the app lives under /AveChristusRex/. Vite injects that as
// BASE_URL; strip the trailing slash for the router basename ('/' locally).
const basename = import.meta.env.BASE_URL.replace(/\/$/, '')

function App() {
  return (
    <BrowserRouter basename={basename}>
      <LocaleRouter />
    </BrowserRouter>
  )
}

export default App

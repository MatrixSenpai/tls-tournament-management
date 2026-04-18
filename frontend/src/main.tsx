import { createRoot } from 'react-dom/client'
import './assets/index.scss'
import { App } from './App'
import * as _ from 'bootstrap'

const root = document.getElementById('root')!
createRoot(root).render(<App />)

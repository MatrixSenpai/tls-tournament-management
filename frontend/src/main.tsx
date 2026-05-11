import React from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'

import * as bootstrap from 'bootstrap'
const _ = bootstrap

// @ts-ignore
import './assets/main.scss'

const container = document.getElementById('root')!
const root = createRoot(container)
root.render(<App />)

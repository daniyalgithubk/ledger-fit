import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'
import Layout from './components/Layout/Layout'
import Home from './pages/Home'
import { BrowserRouter , Routes, Route } from 'react-router-dom'
import Plan from './pages/plan/Plan'
import Week from './pages/week/Week'
import Zones from './pages/zones/Zones'



function App() {
  
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plan" element={<Plan />} />
          <Route path="/week" element={<Week />} />
          <Route path="/zones" element={<Zones />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}


export default App

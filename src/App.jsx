import { HashRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import MapPage from './pages/MapPage.jsx'
import DressCode from './pages/DressCode.jsx'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/dress-code" element={<DressCode />} />
      </Routes>
    </HashRouter>
  )
}

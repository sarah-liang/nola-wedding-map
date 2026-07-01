import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home.jsx'
import MapPage from './pages/MapPage.jsx'
import DressCode from './pages/DressCode.jsx'

const FEATURE_DRESS_CODE = import.meta.env.VITE_FEATURE_DRESS_CODE === 'true'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<MapPage />} />
        <Route
          path="/dress-code"
          element={FEATURE_DRESS_CODE ? <DressCode /> : <Navigate to="/" replace />}
        />
      </Routes>
    </HashRouter>
  )
}

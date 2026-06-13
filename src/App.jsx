import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import PageBackground from './components/PageBackground'
import MobilePageBackground from './components/MobilePageBackground'
import Home from './pages/Home'
import { isMobile } from './utils/device'

function App() {
  const [mobile, setMobile] = useState(() => isMobile())

  useEffect(() => {
    const onResize = () => setMobile(isMobile())
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <div className="font-sans antialiased">
        {mobile ? <MobilePageBackground /> : <PageBackground />}
        <Header />
        <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
        <Footer />
      </div>
    </Router>
  )
}

export default App

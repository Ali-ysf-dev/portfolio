import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import Header from './components/Header'
import PageBackground from './components/PageBackground'

const Home = lazy(() => import('./pages/Home'))
const Footer = lazy(() => import('./components/Footer'))

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div className="font-sans antialiased">
        <PageBackground />
        <Header />
        <Suspense fallback={<div style={{ minHeight: '100vh' }} aria-hidden="true" />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Suspense>
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </div>
    </Router>
  )
}

export default App

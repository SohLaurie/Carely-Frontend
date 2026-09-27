import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bot, X } from 'lucide-react'
import AssistantPage from './screens/Assistant/AssistantPage'

import Landing from './screens/Landing'
import HouseholdDashboard from './screens/Household/Dashboard'
import Profile from './screens/Household/screens/Profile'
import BookingForm from './screens/Household/screens/BookingForm'
import RequestPending from './screens/Household/screens/RequestPending'
import BookingConfirmed from './screens/Household/screens/BookingConfirmed'
import Payment from './screens/Household/screens/Payment'
import OTPArrival from './screens/Household/screens/OTPArrival'
import Completion from './screens/Household/screens/Completion'
import RateReview from './screens/Household/screens/RateReview'
import CaregiverDashboard from './screens/Caregiver/Dashboard'
import AdminDashboard from './screens/Admin/Dashboard'
import Register from './screens/Household/screens/Register'
import RegisterPro from './screens/Household/screens/RegisterPro'
import Pack from './screens/Household/screens/Pack'
import Login from './screens/Household/screens/Login'
import ForgotPassword from './screens/Household/screens/ForgotPassword'




export default function App() {
  const [screen, setScreen] = useState('landing')
  const [screenParams, setScreenParams] = useState({})
  const navigate = useNavigate()
  const location = useLocation()

  // Sync URL pathname to screen state
  useEffect(() => {
    const path = location.pathname.substring(1).replace(/\/$/, '') // remove leading/trailing slash
    if (path === 'caregiver') {
      setScreen('caregiver')
    } else if (path === 'admin') {
      setScreen('admin')
    } else if (path === 'search') {
      navigate('/household', { replace: true })
      setScreen('search')
    } else if (path === 'household') {
      setScreen('search')
    } else if (path === 'profile') {
      setScreen('profile')
    } else if (path === 'booking') {
      setScreen('booking')
    } else if (path === 'pending') {
      setScreen('pending')
    } else if (path === 'confirmed') {
      setScreen('confirmed')
    } else if (path === 'payment') {
      setScreen('payment')
    } else if (path === 'otp') {
      setScreen('otp')
    } else if (path === 'completion') {
      setScreen('completion')
    } else if (path === 'review') {
      setScreen('review')
    } else if (path === 'register') {
      setScreen('register')
    } else if (path === 'registerpro') {
      setScreen('registerpro')
    } else if (path === 'pack') {
      setScreen('pack')
    } else if (path === 'login') {
      setScreen('login')
    } else if (path === 'forgot-password' || path === 'forgot' || path === 'reset-password') {
      setScreen('forgot-password')
    } else if (path === 'landing' || path === '') {
      setScreen('landing')
    }
  }, [location.pathname])

  const handleNavigate = (targetScreen, params = {}) => {
    const s = (targetScreen === 'household') ? 'search' : targetScreen
    setScreen(s)
    setScreenParams(params)
    if (targetScreen === 'landing') {
      navigate('/')
    } else if (targetScreen === 'search' || targetScreen === 'household') {
      navigate('/household')
    } else {
      navigate(`/${targetScreen}`)
    }
  }


  const nav = { onNavigate: handleNavigate, currentScreen: screen, screenParams }


  // Carely Assistant state
  const [chatOpen, setChatOpen] = useState(false)
  const [chatExpanded, setChatExpanded] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div>
        {screen === 'landing'    && <Landing {...nav} />}
        {screen === 'register'   && <Register {...nav} />}
        {screen === 'registerpro' && <RegisterPro {...nav} />}
        {screen === 'pack'       && <Pack {...nav} />}
        {screen === 'login'      && <Login {...nav} />}
        {screen === 'forgot-password' && <ForgotPassword {...nav} />}
        {(screen === 'search' || screen === 'household') && <HouseholdDashboard {...nav} />}
        {screen === 'profile'    && <Profile {...nav} />}
        {screen === 'booking'    && <BookingForm {...nav} />}
        {screen === 'pending'    && <RequestPending {...nav} />}
        {screen === 'confirmed'  && <BookingConfirmed {...nav} />}
        {screen === 'payment'    && <Payment {...nav} />}
        {screen === 'otp'        && <OTPArrival {...nav} />}
        {screen === 'completion' && <Completion {...nav} />}
        {screen === 'review'     && <RateReview {...nav} />}
        {screen === 'caregiver'  && <CaregiverDashboard {...nav} />}
        {screen === 'admin'      && <AdminDashboard {...nav} />}
      </div>

      {/* ── Carely Assistant (fullscreen or mini floating) ── */}
      <AssistantPage
        open={chatOpen}
        expanded={chatExpanded}
        onClose={() => { setChatOpen(false); setChatExpanded(false) }}
        onToggleExpand={() => setChatExpanded(p => !p)}
        onNavigateLogin={() => handleNavigate('login')}
      />

      {/* ── Floating toggle button (hidden when fullscreen) ── */}
      {!chatExpanded && (
        <div className="fixed bottom-6 right-6 z-[999]">
          <button
            onClick={() => setChatOpen(p => !p)}
            className="w-14 h-14 bg-[#1E4030] hover:bg-[#152e22] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 duration-200 cursor-pointer"
            aria-label="Toggle Carely AI Chat"
          >
            {chatOpen ? <X size={22} /> : <Bot size={22} />}
          </button>
        </div>
      )}
    </div>
  )
}







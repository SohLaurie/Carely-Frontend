import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Bot, X, Send, Maximize2, Minimize2 } from 'lucide-react'
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
    } else if (path === 'landing' || path === '') {
      setScreen('landing')
    }
  }, [location.pathname])

  const handleNavigate = (targetScreen, params = {}) => {
    setScreen(targetScreen)
    setScreenParams(params)
    if (targetScreen === 'landing') {
      navigate('/')
    } else if (targetScreen === 'search') {
      navigate('/household')
    } else {
      navigate(`/${targetScreen}`)
    }
  }

  const nav = { onNavigate: handleNavigate, currentScreen: screen, screenParams }


  // Chatbot state hooks
  const [chatOpen, setChatOpen] = useState(false)
  const [chatExpanded, setChatExpanded] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: "Hello! I'm your Carely AI Assistant. How can I help you find the right caregiver today?" }
  ])
  const [chatInput, setChatInput] = useState('')
  const [botTyping, setBotTyping] = useState(false)

  const handleSendChat = (directText = '') => {
    const textToSend = directText || chatInput
    if (!textToSend.trim()) return

    const newMsgs = [...chatMessages, { sender: 'user', text: textToSend }]
    setChatMessages(newMsgs)
    if (!directText) setChatInput('')
    setBotTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const query = textToSend.toLowerCase()
      let reply = "I'm not sure about that. I can recommend top-rated nursing, babysitting, or cleaning caregivers in Yaounde and Douala. Try asking about 'escrow' or 'nurse'!"

      if (query.includes('nurse') || query.includes('nursing') || query.includes('medical') || query.includes('elder')) {
        reply = "We have certified home nurses available (like Marie-Claire Nkomo in Yaounde). They specialize in post-surgical care, palliative care, and geriatric support."
      } else if (query.includes('baby') || query.includes('sit') || query.includes('child') || query.includes('kid')) {
        reply = "For childcare, our top caregiver is Fatima Bello in Akwa, Douala. She has 5 years of early childhood education experience and pediatric first aid certification."
      } else if (query.includes('clean') || query.includes('house') || query.includes('cook') || query.includes('domestic')) {
        reply = "Elise Fouda is our expert housekeeper in Omnisports, Yaounde. She has over 6 years of experience in deep cleaning, organizing, and laundry."
      } else if (query.includes('escrow') || query.includes('payment') || query.includes('pay') || query.includes('fee')) {
        reply = "Carely uses a secure escrow system. When you request a booking, you pay into our escrow account. The funds are held safely and only released to the caregiver after the sessions are completed."
      } else if (query.includes('background') || query.includes('check') || query.includes('verify') || query.includes('trust')) {
        reply = "Every caregiver on our network undergoes strict verification: ID check, reference checks with at least 3 families, and certification validation. Only 5% of applicants are approved."
      }

      setChatMessages(prev => [...prev, { sender: 'bot', text: reply }])
      setBotTyping(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background">
      <div>
        {screen === 'landing'    && <Landing {...nav} />}
        {screen === 'register'   && <Register {...nav} />}
        {screen === 'registerpro' && <RegisterPro {...nav} />}
        {screen === 'pack'       && <Pack {...nav} />}
        {screen === 'login'      && <Login {...nav} />}
        {screen === 'search'     && <HouseholdDashboard {...nav} />}
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

      {/* Floating AI Chatbot Button & Drawer */}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col items-end">
        {/* Chat window */}
        {/* Chat window */}
        {chatOpen && (
          <div className={
            chatExpanded
              ? "fixed inset-4 sm:inset-10 z-[1000] w-auto h-auto max-w-none mb-0 bg-white border border-[#E2D9CF] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn"
              : "w-80 sm:w-96 h-[480px] bg-white border border-[#E2D9CF] rounded-2xl shadow-xl flex flex-col overflow-hidden mb-4 animate-fadeIn"
          }>
            {/* Chat header */}
            <div className="bg-[#1E4030] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                  <Bot size={16} className="text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">Carely Assistant</h3>
                  <span className="text-[10px] text-white/60">Powered by Carely AI</span>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setChatExpanded(!chatExpanded)}
                  title={chatExpanded ? "Minimize Chat" : "Maximize Chat"}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                >
                  {chatExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                </button>
                <button
                  onClick={() => {
                    setChatOpen(false)
                    setChatExpanded(false)
                  }}
                  className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FAF8F5]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#1E4030] text-white rounded-tr-none'
                        : 'bg-white text-[#1C1A17] border border-[#E2D9CF] rounded-tl-none shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {botTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-[#E2D9CF] rounded-2xl rounded-tl-none px-3 py-2 shadow-sm">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-[#8A7E74] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-[#8A7E74] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="w-1.5 h-1.5 bg-[#8A7E74] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Suggestions */}
            {chatMessages.length === 1 && (
              <div className="px-4 pb-3 pt-1 bg-[#FAF8F5] flex flex-wrap gap-1.5">
                {[
                  "Find a Nurse",
                  "How does Escrow work?",
                  "Background Check policy"
                ].map(sug => (
                  <button
                    key={sug}
                    onClick={() => handleSendChat(sug)}
                    className="bg-white border border-[#E2D9CF] hover:bg-secondary text-[10px] text-[#1E4030] font-semibold px-2.5 py-1 rounded-full transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            )}

            {/* Chat Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSendChat()
              }}
              className="p-3 border-t border-[#E2D9CF] bg-white flex gap-2 items-center"
            >
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                className="flex-1 text-xs px-3 py-2 border border-[#E2D9CF] rounded-xl outline-none focus:ring-1 focus:ring-[#1E4030] bg-[#FAF8F5]"
              />
              <button
                type="submit"
                disabled={!chatInput.trim()}
                className="bg-[#1E4030] hover:bg-[#152e22] text-white p-2 rounded-xl transition-colors disabled:opacity-40 flex items-center justify-center"
              >
                <Send size={12} />
              </button>
            </form>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className="w-14 h-14 bg-[#1E4030] hover:bg-[#152e22] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 duration-200"
        >
          {chatOpen ? <X size={22} /> : <Bot size={22} />}
        </button>
      </div>
    </div>
  )
}

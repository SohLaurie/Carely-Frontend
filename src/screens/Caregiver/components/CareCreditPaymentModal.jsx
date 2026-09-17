import React, { useState, useEffect, useRef } from 'react'
import { X, Lock, ShieldCheck, Smartphone, CheckCircle2, AlertCircle, RefreshCw, ArrowLeft, Check, Coins } from 'lucide-react'
import { purchaseCareCredits, verifyCareCreditPurchase } from '../../../services/carecreditApi'

const CC_PER_PACK = 20
const FCFA_PER_PACK = 5

export default function CareCreditPaymentModal({ isOpen, onClose, onSuccess, creditAmount = 20 }) {
  const fcfaAmount = (creditAmount / CC_PER_PACK) * FCFA_PER_PACK
  const [provider, setProvider] = useState('mtn')
  const [phone, setPhone] = useState('')
  const [step, setStep] = useState('form')
  const [loading, setLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [error, setError] = useState('')
  const [campayRef, setCampayRef] = useState(null)
  const pollRef = useRef(null)

  useEffect(() => {
    if (!isOpen) { setStep('form'); setError(''); setPhone(''); setCampayRef(null) }
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [isOpen])

  useEffect(() => {
    if (step === 'processing' && campayRef) {
      pollRef.current = setInterval(async () => {
        try {
          const res = await verifyCareCreditPurchase(campayRef, creditAmount)
          if (res?.confirmed) {
            clearInterval(pollRef.current)
            setStep('success')
            if (onSuccess) onSuccess(res.wallet)
          }
        } catch {}
      }, 4000)
    } else {
      if (pollRef.current) clearInterval(pollRef.current)
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [step, campayRef])

  if (!isOpen) return null

  const handlePay = async (e) => {
    e.preventDefault()
    if (!phone.trim()) { setError('Please enter your mobile money phone number.'); return }
    setLoading(true); setError('')
    try {
      const res = await purchaseCareCredits({ credits: creditAmount, phoneNumber: phone.trim(), providerName: provider })
      if (res?.confirmed) {
        setStep('success')
        if (onSuccess) onSuccess(res.wallet)
      } else {
        setCampayRef(res?.campayRef || null)
        setStep('processing')
      }
    } catch (err) {
      setError(err.message || 'Payment initiation failed. Please try again.')
    } finally { setLoading(false) }
  }

  const handleVerify = async () => {
    if (!campayRef) return
    setVerifyLoading(true); setError('')
    try {
      const res = await verifyCareCreditPurchase(campayRef, creditAmount)
      if (res?.confirmed) {
        setStep('success')
        if (onSuccess) onSuccess(res.wallet)
      } else {
        setError('Payment not yet detected. Please authorize on your phone and try again.')
      }
    } catch (err) {
      setError(err.message || 'Could not verify status.')
    } finally { setVerifyLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#E2D9CF] w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        <div className="bg-[#1E4030] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <Coins size={18} className="text-emerald-300" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold">Purchase CareCredits</h3>
              <p className="text-[11px] text-white/70">{creditAmount} CC for {fcfaAmount} FCFA</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handlePay} className="space-y-5">
              <div className="bg-[#EDF7F2] border border-green-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#1E4030] uppercase tracking-wider block">Purchasing</span>
                  <p className="text-xs text-[#1E4030]/80 mt-0.5">{creditAmount} CareCredits</p>
                </div>
                <span className="font-display text-2xl font-black text-[#1E4030]">{fcfaAmount} XAF</span>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1C1A17]">Select Mobile Wallet</label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setProvider('mtn')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${provider === 'mtn' ? 'border-amber-400 bg-amber-50/70 shadow-2xs' : 'border-[#E2D9CF] bg-white hover:bg-[#FAF8F5]'}`}>
                    <div className="w-9 h-9 bg-amber-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center mb-2 shadow-xs">MTN</div>
                    <h4 className="font-bold text-xs text-[#1C1A17]">MTN MoMo</h4>
                    <p className="text-[10px] text-[#8A7E74]">Prompt &middot; *126#</p>
                  </button>
                  <button type="button" onClick={() => setProvider('orange')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${provider === 'orange' ? 'border-orange-500 bg-orange-50/70 shadow-2xs' : 'border-[#E2D9CF] bg-white hover:bg-[#FAF8F5]'}`}>
                    <div className="w-9 h-9 bg-orange-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center mb-2 shadow-xs">OM</div>
                    <h4 className="font-bold text-xs text-[#1C1A17]">Orange Money</h4>
                    <p className="text-[10px] text-[#8A7E74]">Prompt &middot; #150#</p>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Mobile Money Phone Number</label>
                <div className="relative">
                  <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                  <input type="tel" required placeholder="+237 6XX XX XX XX" value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#E2D9CF] rounded-xl text-xs sm:text-sm text-[#1C1A17] font-medium focus:outline-none focus:border-[#1E4030] focus:ring-1 focus:ring-[#1E4030]" />
                </div>
                <p className="text-[10px] text-[#8A7E74]">A payment push of {fcfaAmount} XAF will be sent to this number via Campay.</p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                {loading ? <><RefreshCw size={15} className="animate-spin" /><span>Initiating...</span></> : <><Lock size={15} /><span>Pay {fcfaAmount} XAF · Get {creditAmount} CC</span></>}
              </button>
            </form>
          )}

          {step === 'processing' && (
            <div className="space-y-6 text-center py-2 animate-fadeIn">
              <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-[#1E4030]/15 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-[#1E4030] border-t-transparent rounded-full animate-spin"></div>
                <Smartphone size={32} className="text-[#1E4030] animate-pulse" />
              </div>
              <div className="space-y-1.5">
                <h4 className="font-display text-lg font-bold text-[#1C1A17]">USSD Prompt Sent!</h4>
                <p className="text-xs text-[#8A7E74] leading-relaxed max-w-xs mx-auto">
                  Approve the <span className="font-bold text-[#1E4030]">{fcfaAmount} XAF</span> prompt on <strong>{phone}</strong> with your PIN.
                </p>
              </div>
              <div className="space-y-2.5 pt-2">
                <button type="button" onClick={handleVerify} disabled={verifyLoading}
                  className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                  {verifyLoading ? <><RefreshCw size={14} className="animate-spin" /><span>Checking...</span></> : <><CheckCircle2 size={15} /><span>I Authorized · Verify Now</span></>}
                </button>
                <button type="button" onClick={() => setStep('form')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#8A7E74] hover:text-[#1C1A17] font-semibold transition-colors cursor-pointer">
                  <ArrowLeft size={13} /><span>Change number or method</span>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="space-y-5 text-center py-3 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Check size={32} strokeWidth={3} />
              </div>
              <div className="space-y-1">
                <h4 className="font-display text-xl font-bold text-[#1E4030]">{creditAmount} CareCredits Added!</h4>
                <p className="text-xs text-[#8A7E74] max-w-xs mx-auto">Your {fcfaAmount} XAF payment was confirmed. {creditAmount} CC have been added to your wallet.</p>
              </div>
              <div className="bg-[#EDF7F2] border border-green-200 rounded-2xl p-4 text-xs text-[#1E4030] font-medium">
                You can now accept new client bookings and remain visible on Explore.
              </div>
              <button type="button" onClick={onClose}
                className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer">
                Back to Wallet
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

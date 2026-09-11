import React, { useState, useEffect, useRef } from 'react'
import {
  X, Lock, ShieldCheck, Smartphone, CheckCircle2,
  AlertCircle, RefreshCw, ArrowLeft, Check
} from 'lucide-react'
import { paySubscription, fetchSubscriptionStatus } from '../../../services/admin.service.js'

export default function SubscriptionPaymentModal({
  isOpen,
  onClose,
  initialPhone = '',
  onPaymentSuccess
}) {
  const detectProvider = (ph) => {
    const cleaned = String(ph).replace(/\D/g, '')
    if (cleaned.includes('69') || cleaned.startsWith('655') || cleaned.startsWith('656') || cleaned.startsWith('657') || cleaned.startsWith('658') || cleaned.startsWith('659')) {
      return 'orange'
    }
    return 'mtn'
  }

  const [provider, setProvider] = useState(() => detectProvider(initialPhone))
  const [phoneNumber, setPhoneNumber] = useState(initialPhone)
  const [loading, setLoading] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [step, setStep] = useState('form') // 'form' | 'processing' | 'success'
  const [errorMsg, setErrorMsg] = useState('')
  const [ussdInfo, setUssdInfo] = useState(null)

  const pollIntervalRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setPhoneNumber(initialPhone || '')
      setProvider(detectProvider(initialPhone))
      setStep('form')
      setErrorMsg('')
      setLoading(false)
      setVerifyLoading(false)
      setUssdInfo(null)
    }
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [isOpen, initialPhone])

  useEffect(() => {
    if (step === 'processing') {
      pollIntervalRef.current = setInterval(async () => {
        try {
          const status = await fetchSubscriptionStatus()
          if (status && status.subscriptionPaid) {
            clearInterval(pollIntervalRef.current)
            setStep('success')
            if (onPaymentSuccess) onPaymentSuccess(status)
          }
        } catch {
          // Ignore transient polling error
        }
      }, 4000)
    } else {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [step, onPaymentSuccess])

  if (!isOpen) return null

  const handleStartPayment = async (e) => {
    e.preventDefault()
    if (!phoneNumber || !phoneNumber.trim()) {
      setErrorMsg('Please enter a valid mobile money phone number.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await paySubscription(phoneNumber.trim())
      setUssdInfo(res)
      setStep('processing')
    } catch (err) {
      setErrorMsg(err.message || 'Payment initiation failed. Please verify your phone number and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualVerify = async () => {
    setVerifyLoading(true)
    setErrorMsg('')
    try {
      const status = await fetchSubscriptionStatus()
      if (status && status.subscriptionPaid) {
        setStep('success')
        if (onPaymentSuccess) onPaymentSuccess(status)
      } else {
        setErrorMsg('Payment not yet detected. Please authorize the prompt on your phone and try again.')
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not verify status. Please try again.')
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#FAF8F5] border border-[#E2D9CF] w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-fadeIn">
        
        {/* Modal Header */}
        <div className="bg-[#1E4030] text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
              <ShieldCheck size={18} className="text-emerald-300" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold">Provider Activation</h3>
              <p className="text-[11px] text-white/70">Annual platform subscription fee</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3.5 rounded-2xl flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Form Step */}
          {step === 'form' && (
            <form onSubmit={handleStartPayment} className="space-y-5">
              
              {/* Fee Notice Banner */}
              <div className="bg-[#EDF7F2] border border-green-200 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#1E4030] uppercase tracking-wider block">Activation Fee</span>
                  <p className="text-xs text-[#1E4030]/80 mt-0.5">Full 1-year provider activation</p>
                </div>
                <div className="text-right">
                  <span className="font-display text-2xl font-black text-[#1E4030]">25 XAF</span>
                </div>
              </div>

              {/* Wallet Provider Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[#1C1A17]">Select Mobile Wallet</label>
                <div className="grid grid-cols-2 gap-3">
                  {/* MTN */}
                  <button
                    type="button"
                    onClick={() => setProvider('mtn')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      provider === 'mtn'
                        ? 'border-amber-400 bg-amber-50/70 shadow-2xs'
                        : 'border-[#E2D9CF] bg-white hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="w-9 h-9 bg-amber-400 text-black font-extrabold text-xs rounded-xl flex items-center justify-center mb-2 shadow-xs">
                      MTN
                    </div>
                    <h4 className="font-bold text-xs text-[#1C1A17]">MTN MoMo</h4>
                    <p className="text-[10px] text-[#8A7E74]">Prompt &middot; *126#</p>
                  </button>

                  {/* Orange Money */}
                  <button
                    type="button"
                    onClick={() => setProvider('orange')}
                    className={`p-3.5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                      provider === 'orange'
                        ? 'border-orange-500 bg-orange-50/70 shadow-2xs'
                        : 'border-[#E2D9CF] bg-white hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="w-9 h-9 bg-orange-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center mb-2 shadow-xs">
                      OM
                    </div>
                    <h4 className="font-bold text-xs text-[#1C1A17]">Orange Money</h4>
                    <p className="text-[10px] text-[#8A7E74]">Prompt &middot; #150#</p>
                  </button>
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">
                  Mobile Money Phone Number
                </label>
                <div className="relative">
                  <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                  <input
                    type="tel"
                    required
                    placeholder="+237 6XX XX XX XX"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-[#E2D9CF] rounded-xl text-xs sm:text-sm text-[#1C1A17] font-medium focus:outline-none focus:border-[#1E4030] focus:ring-1 focus:ring-[#1E4030]"
                  />
                </div>
                <p className="text-[10px] text-[#8A7E74]">
                  A payment push of 25 XAF will be sent to this number via Campay.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" />
                    <span>Initiating Payment...</span>
                  </>
                ) : (
                  <>
                    <Lock size={15} />
                    <span>Authorize 25 XAF Payment</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Processing / USSD Pending */}
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
                  Please approve the <span className="font-bold text-[#1E4030]">25 XAF</span> prompt on your phone (<strong>{phoneNumber}</strong>) with your PIN.
                </p>
              </div>

              <div className="bg-white border border-[#E2D9CF] rounded-2xl p-4 text-xs text-left space-y-1.5">
                <div className="flex items-center gap-2 font-bold text-[#1C1A17]">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span>Awaiting Mobile Money Confirmation</span>
                </div>
                <p className="text-[11px] text-[#8A7E74]">
                  {provider === 'orange'
                    ? 'If the USSD prompt does not pop up automatically, dial #150*50# to approve.'
                    : 'If the USSD prompt does not pop up automatically, dial *126# to approve.'}
                </p>
                {ussdInfo?.ussdCode && (
                  <p className="text-[11px] font-mono font-bold text-[#1E4030]">
                    USSD Code: {ussdInfo.ussdCode}
                  </p>
                )}
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleManualVerify}
                  disabled={verifyLoading}
                  className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3 px-4 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {verifyLoading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Checking Status...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={15} />
                      <span>I Have Authorized &middot; Verify Now</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="inline-flex items-center gap-1.5 text-xs text-[#8A7E74] hover:text-[#1C1A17] font-semibold transition-colors cursor-pointer"
                >
                  <ArrowLeft size={13} />
                  <span>Change number or payment method</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Success */}
          {step === 'success' && (
            <div className="space-y-5 text-center py-3 animate-fadeIn">
              <div className="w-16 h-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                <Check size={32} strokeWidth={3} />
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-xl font-bold text-[#1E4030]">Subscription Activated!</h4>
                <p className="text-xs text-[#8A7E74] leading-relaxed max-w-xs mx-auto">
                  Your payment of 25 XAF was confirmed. Your provider profile is now fully active and visible to clients!
                </p>
              </div>

              <div className="bg-[#EDF7F2] border border-green-200 rounded-2xl p-4 text-xs text-[#1E4030] font-medium">
                You can now receive and accept client booking requests directly from your dashboard.
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3.5 px-5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer"
              >
                Go to Dashboard
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

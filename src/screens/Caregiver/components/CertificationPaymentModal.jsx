import React, { useState, useEffect, useRef } from 'react'
import {
  X, Lock, Award, Smartphone, CheckCircle2,
  AlertCircle, RefreshCw, ArrowLeft, Check, ShieldCheck
} from 'lucide-react'
import { payCertification, fetchCertificationStatus } from '../../../services/admin.service.js'

export default function CertificationPaymentModal({
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
          const status = await fetchCertificationStatus()
          if (status && (status.isCertified || status.certificationPaid)) {
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
      setErrorMsg('Please enter your mobile money phone number.')
      return
    }

    setLoading(true)
    setErrorMsg('')

    try {
      const res = await payCertification(phoneNumber.trim())
      setUssdInfo({
        ussdCode: res?.ussdCode || res?.ussd_code || '*126#',
        operator: res?.operator || (provider === 'orange' ? 'Orange Money' : 'MTN MoMo'),
        reference: res?.reference
      })
      setStep('processing')
    } catch (err) {
      setErrorMsg(err.message || 'Payment initiation failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualCheck = async () => {
    setVerifyLoading(true)
    setErrorMsg('')
    try {
      const status = await fetchCertificationStatus()
      if (status && (status.isCertified || status.certificationPaid)) {
        setStep('success')
        if (onPaymentSuccess) onPaymentSuccess(status)
      } else {
        setErrorMsg('Payment not yet detected. Please confirm the USSD prompt on your phone and try again.')
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not verify payment status.')
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl border border-[#E2D9CF] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-[#E2D9CF] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 border border-emerald-200 text-emerald-800 flex items-center justify-center">
              <Award size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-[#1C1A17]">Activate Certified Badge</h3>
              <p className="text-xs text-[#8A7E74]">One-time fee of 25 XAF via Mobile Money</p>
            </div>
          </div>
          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[#8A7E74] hover:text-[#1C1A17] hover:bg-[#EFECE6] transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 'form' && (
            <form onSubmit={handleStartPayment} className="space-y-4">
              <div className="bg-[#FAF8F5] border border-[#E2D9CF] rounded-2xl p-4 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8A7E74] font-medium">Certification Tier</span>
                  <span className="font-bold text-[#1C1A17] flex items-center gap-1">
                    <ShieldCheck size={14} className="text-emerald-700" /> Certified Provider
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#8A7E74] font-medium">Badge Activation Fee</span>
                  <span className="font-extrabold text-[#1E4030] text-sm">25 XAF</span>
                </div>
                <p className="text-[11px] text-[#8A7E74] pt-1 border-t border-[#E2D9CF]">
                  Earn trust with clients. The official Certified badge will appear on your card and profile.
                </p>
              </div>

              {/* Operator select */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">
                  Mobile Money Provider
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setProvider('mtn')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      provider === 'mtn'
                        ? 'bg-amber-50 border-amber-400 text-amber-900 ring-2 ring-amber-400/20 shadow-xs'
                        : 'bg-[#FAF8F5] border-[#E2D9CF] text-[#8A7E74] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shrink-0" />
                    MTN MoMo
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvider('orange')}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      provider === 'orange'
                        ? 'bg-orange-50 border-orange-400 text-orange-900 ring-2 ring-orange-400/20 shadow-xs'
                        : 'bg-[#FAF8F5] border-[#E2D9CF] text-[#8A7E74] hover:bg-[#F3EFEA]'
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                    Orange Money
                  </button>
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wide">
                  Payment Phone Number
                </label>
                <div className="relative">
                  <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                  <input
                    type="tel"
                    placeholder="e.g. 683904430 or +237 6..."
                    value={phoneNumber}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value)
                      setProvider(detectProvider(e.target.value))
                    }}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-xs text-[#1C1A17] font-medium outline-none focus:border-[#1E4030] focus:ring-1 focus:ring-[#1E4030]"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3 rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw size={14} className="animate-spin" />
                      <span>Sending USSD Prompt...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={13} />
                      <span>Pay 25 XAF & Activate Badge</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 'processing' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto animate-pulse">
                <Smartphone size={28} />
              </div>
              <div>
                <h4 className="font-bold text-[#1C1A17] text-sm">USSD Prompt Sent!</h4>
                <p className="text-xs text-[#8A7E74] mt-1 max-w-xs mx-auto">
                  Please check your phone ({phoneNumber}). Authorize the 25 XAF payment with your PIN.
                </p>
              </div>

              {ussdInfo?.ussdCode && (
                <div className="bg-[#FAF8F5] border border-[#E2D9CF] p-3 rounded-xl text-xs text-[#5A5248]">
                  Did not receive the popup? Dial <strong className="text-[#1E4030] font-mono">{ussdInfo.ussdCode}</strong> to approve the pending payment.
                </div>
              )}

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleManualCheck}
                  disabled={verifyLoading}
                  className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {verifyLoading ? (
                    <RefreshCw size={13} className="animate-spin" />
                  ) : (
                    <CheckCircle2 size={13} />
                  )}
                  <span>I have confirmed the payment</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="w-full py-2 text-xs font-semibold text-[#8A7E74] hover:text-[#1C1A17] flex items-center justify-center gap-1 cursor-pointer"
                >
                  <ArrowLeft size={12} />
                  <span>Change phone number</span>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h4 className="font-display font-bold text-lg text-[#1C1A17]">Certified Badge Activated!</h4>
                <p className="text-xs text-[#8A7E74] mt-1 max-w-xs mx-auto">
                  Your 25 XAF payment was successful. The official Certified badge is now active on your explore card and profile.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3 rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
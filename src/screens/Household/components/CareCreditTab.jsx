import React, { useState, useEffect, useCallback } from 'react'
import { Coins, ArrowDownToLine, RefreshCw, Phone, CheckCircle2, AlertCircle, Gift } from 'lucide-react'
import { getCareCreditWallet, withdrawCareCredits } from '../../../services/carecreditApi'

const CC_PER_PACK = 20
const FCFA_PER_PACK = 5

export default function CareCreditTab() {
  const [wallet, setWallet] = useState({ balance: 0, held: 0, available: 0, equivalentFcfa: 0 })
  const [monthlyStats, setMonthlyStats] = useState({ earned: 0, consumed_month: 0 })
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)

  const [creditsToRedeem, setCreditsToRedeem] = useState(20)
  const [redeemPhone, setRedeemPhone] = useState('')
  const [redeemLoading, setRedeemLoading] = useState(false)
  const [redeemMsg, setRedeemMsg] = useState('')
  const [redeemErr, setRedeemErr] = useState('')

  const loadWallet = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getCareCreditWallet()
      if (data) {
        if (data.wallet) setWallet(data.wallet)
        if (data.monthlyStats) setMonthlyStats(data.monthlyStats)
        if (Array.isArray(data.transactions)) setTransactions(data.transactions)
      }
    } catch (err) {
      console.warn('Could not load CC wallet:', err.message)
    } finally { setLoading(false) }
  }, [])

  useEffect(() => { loadWallet() }, [loadWallet])

  const fcfaEquiv = ((parseInt(creditsToRedeem, 10) || 0) / CC_PER_PACK) * FCFA_PER_PACK

  const handleRedeem = async (e) => {
    e.preventDefault()
    setRedeemErr(''); setRedeemMsg('')
    const amount = parseInt(creditsToRedeem, 10)
    if (!amount || amount <= 0 || amount % CC_PER_PACK !== 0) {
      setRedeemErr(`Credits must be a multiple of ${CC_PER_PACK}.`); return
    }
    if (amount > wallet.available) {
      setRedeemErr(`Insufficient available credits. You have ${wallet.available} CC available.`); return
    }
    if (!redeemPhone.trim()) { setRedeemErr('Please enter a phone number.'); return }
    setRedeemLoading(true)
    try {
      const res = await withdrawCareCredits({ credits: amount, phoneNumber: redeemPhone.trim() })
      setRedeemMsg(res?.message || `Redemption initiated: ${amount} CC → ${res?.fcfaAmount || '?'} FCFA`)
      await loadWallet()
      setCreditsToRedeem(20); setRedeemPhone('')
    } catch (err) {
      setRedeemErr(err.message || 'Redemption failed. Please try again.')
    } finally { setRedeemLoading(false) }
  }

  const typeLabel = { REFERRAL_EARN: '+Referral Reward', WITHDRAWAL: 'Redeemed' }
  const typeColor = { REFERRAL_EARN: 'text-emerald-600', WITHDRAWAL: 'text-rose-600' }

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
          <Coins size={22} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1E4030]">CareCredits</h2>
          <p className="text-sm text-[#8A7E74]">Earn CareCredits by referring friends and redeem them for cash.</p>
        </div>
        <button onClick={loadWallet} title="Refresh"
          className="ml-auto w-9 h-9 rounded-xl border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1E4030] hover:bg-[#EDF7F2] transition-all cursor-pointer">
          <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Balance Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#1E4030] text-white rounded-3xl p-6 space-y-3 shadow-md">
          <div className="flex items-center gap-2">
            <Gift size={18} className="text-emerald-300" />
            <span className="text-xs font-bold text-white/70 uppercase tracking-wider">Available CareCredits</span>
          </div>
          <p className="text-4xl font-black">{wallet.available} <span className="text-lg font-semibold text-white/60">CC</span></p>
          <p className="text-xs text-white/60">≈ {wallet.equivalentFcfa} FCFA value</p>
        </div>
        <div className="bg-white border border-[#E2D9CF] rounded-3xl p-6 space-y-3 shadow-sm">
          <span className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider block">Earned This Month</span>
          <p className="text-4xl font-black text-[#1E4030]">{monthlyStats.earned} <span className="text-lg font-semibold text-[#8A7E74]">CC</span></p>
          <p className="text-xs text-[#8A7E74]">From referrals · 5 CC per successful booking</p>
        </div>
      </div>

      {/* How it works */}
      {wallet.available === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-3xl p-5 space-y-2">
          <h4 className="font-bold text-sm text-blue-900">How to earn CareCredits</h4>
          <ul className="text-xs text-blue-700 space-y-1 list-disc list-inside">
            <li>Share your referral code from the <strong>Refer &amp; Earn</strong> tab</li>
            <li>When a new client uses your code and completes a booking, you earn <strong>5 CC</strong></li>
            <li>Redeem 20 CC for <strong>5 FCFA</strong> sent directly to your mobile money</li>
          </ul>
        </div>
      )}

      {/* Redeem panel */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl shadow-sm overflow-hidden">
        <div className="bg-[#1E4030] text-white px-6 py-4">
          <h3 className="font-bold text-sm">Redeem CareCredits</h3>
          <p className="text-[11px] text-white/70 mt-0.5">Convert your earned CC to mobile money. Rate: 20 CC → 5 FCFA</p>
        </div>
        <form onSubmit={handleRedeem} className="p-6 space-y-4">
          {redeemErr && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2">
              <AlertCircle size={14} className="shrink-0 mt-0.5" /><span>{redeemErr}</span>
            </div>
          )}
          {redeemMsg && (
            <div className="bg-[#EDF7F2] border border-green-200 text-[#1E4030] text-xs p-3 rounded-xl flex items-start gap-2">
              <CheckCircle2 size={14} className="shrink-0 mt-0.5" /><span>{redeemMsg}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Credits to Redeem (multiples of 20)</label>
            <input type="number" min={20} step={20} value={creditsToRedeem}
              onChange={e => setCreditsToRedeem(Math.max(20, Math.round(parseInt(e.target.value, 10) / 20) * 20 || 20))}
              className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-sm font-bold text-[#1C1A17] focus:outline-none focus:border-[#1E4030] focus:ring-1 focus:ring-[#1E4030]" />
            <p className="text-xs text-[#8A7E74]">= <span className="font-bold text-[#1E4030]">{fcfaEquiv} FCFA</span> sent to your mobile money</p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Mobile Money Number</label>
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
              <input type="tel" placeholder="+237 6XX XX XX XX" value={redeemPhone}
                onChange={e => setRedeemPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] font-medium focus:outline-none focus:border-[#1E4030] focus:ring-1 focus:ring-[#1E4030]" />
            </div>
          </div>

          <button type="submit" disabled={redeemLoading || wallet.available < 20}
            className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50">
            {redeemLoading
              ? <><RefreshCw size={15} className="animate-spin" /><span>Processing...</span></>
              : <><ArrowDownToLine size={16} /><span>Redeem CareCredit</span></>}
          </button>
        </form>
      </div>

      {/* Transaction History */}
      {transactions.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Transaction History</h4>
          <div className="divide-y divide-[#F0EBE5] border border-[#E2D9CF] rounded-2xl overflow-hidden">
            {transactions.slice(0, 10).map(tx => (
              <div key={tx.id} className="flex items-center justify-between px-4 py-3 bg-white hover:bg-[#FAF8F5] transition-colors">
                <div className="space-y-0.5">
                  <p className={`text-xs font-bold ${typeColor[tx.type] || 'text-[#1C1A17]'}`}>{typeLabel[tx.type] || tx.type}</p>
                  <p className="text-[10px] text-[#8A7E74]">{tx.note || ''}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-extrabold ${tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{tx.amount > 0 ? '+' : ''}{tx.amount} CC</p>
                  <p className="text-[10px] text-[#8A7E74]">{new Date(tx.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

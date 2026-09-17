import React, { useState, useEffect, useCallback } from 'react'
import { Coins, TrendingUp, Lock, Gift, ArrowDownToLine, RefreshCw, Phone, CheckCircle2, AlertCircle, Copy, Check } from 'lucide-react'
import { getCareCreditWallet, withdrawCareCredits } from '../../../services/carecreditApi'
import CareCreditPaymentModal from './CareCreditPaymentModal'
import { getStoredUser } from '../../../services/api'

const CC_PER_PACK = 20
const FCFA_PER_PACK = 5

function StatCard({ icon: Icon, label, value, sub, color = 'green' }) {
  const colors = {
    green: 'bg-[#EDF7F2] text-[#1E4030] border-green-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    rose: 'bg-rose-50 text-rose-600 border-rose-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
  }
  return (
    <div className="bg-white border border-[#E2D9CF] rounded-3xl p-5 shadow-sm space-y-3">
      <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold text-[#8A7E74] uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-extrabold text-[#1E4030] mt-0.5">{value} <span className="text-sm font-semibold text-[#8A7E74]">CC</span></p>
        {sub && <p className="text-xs text-[#8A7E74] mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

export default function CareCreditTab() {
  const [activePanel, setActivePanel] = useState('purchase')
  const [wallet, setWallet] = useState({ balance: 0, held: 0, available: 0, equivalentFcfa: 0 })
  const [monthlyStats, setMonthlyStats] = useState({ earned: 0, consumed_month: 0 })
  const [referralCode, setReferralCode] = useState('')
  const [transactions, setTransactions] = useState([])
  const [walletLoading, setWalletLoading] = useState(true)

  // Purchase state
  const [creditsToBuy, setCreditsToBuy] = useState(20)
  const [showPayModal, setShowPayModal] = useState(false)

  // Withdraw state
  const [creditsToWithdraw, setCreditsToWithdraw] = useState(20)
  const [withdrawPhone, setWithdrawPhone] = useState('')
  const [withdrawLoading, setWithdrawLoading] = useState(false)
  const [withdrawMsg, setWithdrawMsg] = useState('')
  const [withdrawErr, setWithdrawErr] = useState('')

  // Copied referral code
  const [copied, setCopied] = useState(false)

  const loadWallet = useCallback(async () => {
    setWalletLoading(true)
    try {
      const data = await getCareCreditWallet()
      if (data) {
        if (data.wallet) setWallet(data.wallet)
        if (data.monthlyStats) setMonthlyStats(data.monthlyStats)
        if (data.referralCode) setReferralCode(data.referralCode)
        if (Array.isArray(data.transactions)) setTransactions(data.transactions)
      }
    } catch (err) {
      console.warn('Could not load CC wallet:', err.message)
    } finally {
      setWalletLoading(false)
    }
  }, [])

  useEffect(() => { loadWallet() }, [loadWallet])

  const handleWithdraw = async (e) => {
    e.preventDefault()
    setWithdrawErr(''); setWithdrawMsg('')
    const amount = parseInt(creditsToWithdraw, 10)
    if (!amount || amount <= 0 || amount % CC_PER_PACK !== 0) {
      setWithdrawErr(`Credits must be a multiple of ${CC_PER_PACK}.`); return
    }
    if (amount > wallet.available) {
      setWithdrawErr(`Insufficient available credits. You have ${wallet.available} CC available.`); return
    }
    if (!withdrawPhone.trim()) { setWithdrawErr('Please enter a phone number.'); return }
    setWithdrawLoading(true)
    try {
      const res = await withdrawCareCredits({ credits: amount, phoneNumber: withdrawPhone.trim() })
      setWithdrawMsg(res?.message || `Withdrawal initiated: ${amount} CC → ${res?.fcfaAmount || '?'} FCFA`)
      await loadWallet()
      setCreditsToWithdraw(20); setWithdrawPhone('')
    } catch (err) {
      setWithdrawErr(err.message || 'Withdrawal failed. Please try again.')
    } finally { setWithdrawLoading(false) }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const fcfaBuy = ((parseInt(creditsToBuy, 10) || 0) / CC_PER_PACK) * FCFA_PER_PACK
  const fcfaWithdraw = ((parseInt(creditsToWithdraw, 10) || 0) / CC_PER_PACK) * FCFA_PER_PACK

  const typeLabel = { PURCHASE: '+Purchase', JOB_HOLD: 'Hold (booking)', JOB_DEDUCT: 'Used (booking)', JOB_REFUND: '+Refund', REFERRAL_EARN: '+Referral Reward', WITHDRAWAL: 'Withdrawal' }
  const typeColor = { PURCHASE: 'text-emerald-600', JOB_HOLD: 'text-amber-600', JOB_DEDUCT: 'text-rose-600', JOB_REFUND: 'text-blue-600', REFERRAL_EARN: 'text-emerald-600', WITHDRAWAL: 'text-rose-600' }

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-[#EDF7F2] rounded-2xl flex items-center justify-center border border-green-200/60 text-[#1E4030] shadow-sm">
          <Coins size={22} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-[#1E4030]">CareCred</h2>
          <p className="text-sm text-[#8A7E74]">Manage your CareCredits — purchase, use, and withdraw.</p>
        </div>
        <button onClick={loadWallet} title="Refresh" className="ml-auto w-9 h-9 rounded-xl border border-[#E2D9CF] bg-white flex items-center justify-center text-[#8A7E74] hover:text-[#1E4030] hover:bg-[#EDF7F2] transition-all cursor-pointer">
          <RefreshCw size={15} className={walletLoading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Coins} label="Total in Wallet" value={wallet.balance} sub={`≈ ${wallet.equivalentFcfa} FCFA`} color="green" />
        <StatCard icon={Gift} label="Earned / Referrals" value={monthlyStats.earned} sub="This month" color="blue" />
        <StatCard icon={TrendingUp} label="Consumed" value={monthlyStats.consumed_month} sub="This month (bookings)" color="rose" />
        <StatCard icon={Lock} label="Pending (On Hold)" value={wallet.held} sub={`${wallet.available} CC available`} color="amber" />
      </div>

      {/* Panel Tabs */}
      <div className="bg-white border border-[#E2D9CF] rounded-3xl overflow-hidden shadow-sm">
        <div className="flex border-b border-[#E2D9CF]">
          {[{ id: 'purchase', label: 'Purchase Credits' }, { id: 'redeem', label: 'Redeem Credits' }].map(t => (
            <button key={t.id} onClick={() => setActivePanel(t.id)}
              className={`flex-1 py-3.5 text-xs font-bold transition-all cursor-pointer ${activePanel === t.id ? 'bg-[#1E4030] text-white' : 'text-[#8A7E74] hover:text-[#1C1A17] hover:bg-[#FAF8F5]'}`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-6">
          {/* ── PURCHASE CREDITS PANEL ── */}
          {activePanel === 'purchase' && (
            <div className="space-y-6">
              {/* Referral Code */}
              {referralCode && (
                <div className="bg-[#EDF7F2] border border-green-200 rounded-2xl p-4 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold text-[#1E4030] uppercase tracking-wider">Your Referral Code</p>
                    <p className="text-xl font-black text-[#1E4030] tracking-widest mt-0.5">{referralCode}</p>
                    <p className="text-[10px] text-[#1E4030]/70 mt-0.5">Share this code — earn +5 CC per successful referral</p>
                  </div>
                  <button onClick={handleCopyCode}
                    className="w-10 h-10 rounded-xl bg-white border border-green-200 text-[#1E4030] flex items-center justify-center hover:bg-[#1E4030] hover:text-white transition-all cursor-pointer shrink-0">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              )}

              {/* Buy Credits */}
              <div className="bg-white border border-[#E2D9CF] rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-sm text-[#1C1A17]">Buy CareCredits</h3>
                <p className="text-xs text-[#8A7E74]">Rate: <span className="font-bold text-[#1E4030]">20 CC = 5 FCFA</span>. Enter a multiple of 20.</p>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Credits to Purchase</label>
                  <input type="number" min={20} step={20} value={creditsToBuy}
                    onChange={e => setCreditsToBuy(Math.max(20, Math.round(parseInt(e.target.value, 10) / 20) * 20 || 20))}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-sm font-bold text-[#1C1A17] focus:outline-none focus:border-[#1E4030] focus:ring-1 focus:ring-[#1E4030]" />
                  <p className="text-xs text-[#8A7E74]">= <span className="font-bold text-[#1E4030]">{fcfaBuy} FCFA</span></p>
                </div>
                <button onClick={() => setShowPayModal(true)}
                  className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer">
                  <Coins size={16} />
                  Purchase {creditsToBuy} CareCredits
                </button>
              </div>

              {/* Withdraw Credits */}
              <form onSubmit={handleWithdraw} className="bg-white border border-[#E2D9CF] rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-sm text-[#1C1A17]">Withdraw CareCredits</h3>
                <p className="text-xs text-[#8A7E74]">Convert CC back to FCFA. Rate: <span className="font-bold text-[#1E4030]">20 CC → 5 FCFA</span>. Available: <span className="font-bold text-[#1E4030]">{wallet.available} CC</span></p>

                {withdrawErr && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" /><span>{withdrawErr}</span>
                  </div>
                )}
                {withdrawMsg && (
                  <div className="bg-[#EDF7F2] border border-green-200 text-[#1E4030] text-xs p-3 rounded-xl flex items-start gap-2">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" /><span>{withdrawMsg}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Credits to Withdraw</label>
                  <input type="number" min={20} step={20} value={creditsToWithdraw}
                    onChange={e => setCreditsToWithdraw(Math.max(20, Math.round(parseInt(e.target.value, 10) / 20) * 20 || 20))}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-sm font-bold text-[#1C1A17] focus:outline-none focus:border-[#1E4030] focus:ring-1 focus:ring-[#1E4030]" />
                  <p className="text-xs text-[#8A7E74]">= <span className="font-bold text-[#1E4030]">{fcfaWithdraw} FCFA</span> sent to your mobile money</p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Mobile Money Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                    <input type="tel" placeholder="+237 6XX XX XX XX" value={withdrawPhone}
                      onChange={e => setWithdrawPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] font-medium focus:outline-none focus:border-[#1E4030] focus:ring-1 focus:ring-[#1E4030]" />
                  </div>
                </div>

                <button type="submit" disabled={withdrawLoading}
                  className="w-full border-2 border-[#1E4030] text-[#1E4030] hover:bg-[#1E4030] hover:text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                  {withdrawLoading ? <><RefreshCw size={15} className="animate-spin" /><span>Processing...</span></> : <><ArrowDownToLine size={16} /><span>Withdraw {creditsToWithdraw} CC → {fcfaWithdraw} FCFA</span></>}
                </button>
              </form>
            </div>
          )}

          {/* ── REDEEM CREDITS PANEL ── */}
          {activePanel === 'redeem' && (
            <div className="space-y-5">
              <div className="bg-[#EDF7F2] border border-green-200 rounded-2xl p-5 space-y-2">
                <p className="text-xs font-bold text-[#1E4030] uppercase tracking-wider">Referral-Earned Credits</p>
                <p className="text-3xl font-black text-[#1E4030]">{Number(monthlyStats.earned)} <span className="text-base font-semibold text-[#8A7E74]">CC earned this month</span></p>
                <p className="text-xs text-[#8A7E74]">All earned CareCredits are in your total wallet balance. You can redeem (withdraw) them at the same rate: 20 CC → 5 FCFA.</p>
              </div>

              <form onSubmit={handleWithdraw} className="bg-white border border-[#E2D9CF] rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-sm text-[#1C1A17]">Redeem CareCredits to Mobile Money</h3>
                <p className="text-xs text-[#8A7E74]">Available to redeem: <span className="font-bold text-[#1E4030]">{wallet.available} CC (≈ {wallet.equivalentFcfa} FCFA)</span></p>

                {withdrawErr && (
                  <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-start gap-2">
                    <AlertCircle size={14} className="shrink-0 mt-0.5" /><span>{withdrawErr}</span>
                  </div>
                )}
                {withdrawMsg && (
                  <div className="bg-[#EDF7F2] border border-green-200 text-[#1E4030] text-xs p-3 rounded-xl flex items-start gap-2">
                    <CheckCircle2 size={14} className="shrink-0 mt-0.5" /><span>{withdrawMsg}</span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Credits to Redeem</label>
                  <input type="number" min={20} step={20} value={creditsToWithdraw}
                    onChange={e => setCreditsToWithdraw(Math.max(20, Math.round(parseInt(e.target.value, 10) / 20) * 20 || 20))}
                    className="w-full px-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-sm font-bold text-[#1C1A17] focus:outline-none focus:border-[#1E4030] focus:ring-1 focus:ring-[#1E4030]" />
                  <p className="text-xs text-[#8A7E74]">= <span className="font-bold text-[#1E4030]">{fcfaWithdraw} FCFA</span></p>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Mobile Money Number</label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7E74]" />
                    <input type="tel" placeholder="+237 6XX XX XX XX" value={withdrawPhone}
                      onChange={e => setWithdrawPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#FAF8F5] border border-[#E2D9CF] rounded-xl text-sm text-[#1C1A17] font-medium focus:outline-none focus:border-[#1E4030] focus:ring-1 focus:ring-[#1E4030]" />
                  </div>
                </div>

                <button type="submit" disabled={withdrawLoading}
                  className="w-full bg-[#1E4030] hover:bg-[#152e22] text-white py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60">
                  {withdrawLoading ? <><RefreshCw size={15} className="animate-spin" /><span>Processing...</span></> : <><ArrowDownToLine size={16} /><span>Redeem CareCredit</span></>}
                </button>
              </form>
            </div>
          )}

          {/* Transaction History */}
          {transactions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[#8A7E74] uppercase tracking-wider">Recent Transactions</h4>
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
      </div>

      {/* Purchase Modal */}
      <CareCreditPaymentModal
        isOpen={showPayModal}
        onClose={() => setShowPayModal(false)}
        creditAmount={parseInt(creditsToBuy, 10) || 20}
        onSuccess={async (updatedWallet) => {
          setShowPayModal(false)
          if (updatedWallet) setWallet(updatedWallet)
          await loadWallet()
        }}
      />
    </div>
  )
}

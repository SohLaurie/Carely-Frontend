import { useState } from 'react'
import { ArrowLeft, Lock, Check, Loader2, CreditCard, Wallet } from 'lucide-react'
import { CAREGIVERS } from '../../../data'

const CAREGIVER = CAREGIVERS[0]

export default function Payment({ onNavigate }) {
  const c = CAREGIVER
  const [provider, setProvider] = useState('mtn')
  const [phone, setPhone] = useState('')
  const [confirming, setConfirming] = useState(false)

  const handlePay = () => {
    setConfirming(true)
    setTimeout(() => { setConfirming(false); onNavigate('confirmed') }, 2000)
  }

  const mtnColor = '#F5A623'
  const orangeColor = '#FF6900'
  const activeColor = provider === 'mtn' ? mtnColor : orangeColor

  return (
    <div className="bg-background min-h-screen">
      <div className="max-w-lg mx-auto px-4 py-12">
        <button
          onClick={() => onNavigate('pending')}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft size={15} />
          Back
        </button>

        <h1 className="font-display text-2xl font-semibold text-primary mb-1">Secure Payment</h1>
        <p className="text-muted-foreground text-sm mb-8">
          Your funds will be held in escrow and only released after you confirm the service.
        </p>

        <div className="space-y-5">
          {/* Amount */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Amount Due</p>
            <div className="flex items-baseline gap-2 mb-1">
              <span className="font-display text-4xl font-semibold text-primary">11,500</span>
              <span className="text-muted-foreground font-medium">XAF</span>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Week 1 of 3 (3 sessions x 3,500 XAF x 3h + fee)</p>

            <div className="flex items-center gap-3 p-3 bg-secondary rounded-xl text-sm">
              <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-medium text-foreground">{c.name}</p>
                <p className="text-xs text-muted-foreground">Mon/Wed/Fri &middot; 09:00 – 12:00</p>
              </div>
            </div>
          </div>

          {/* Escrow explanation */}
          <div className="flex items-start gap-3 bg-primary/5 border border-primary/15 rounded-xl p-4">
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
              <Lock size={15} className="text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-primary mb-0.5">Escrow Payment</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The amount is charged now but held by Carely. {c.name.split(' ')[0]} receives payment (minus commission) only after you confirm the service.
              </p>
            </div>
          </div>

          {/* Provider selector */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Choose Your Operator</p>
            <div className="grid grid-cols-2 gap-3">
              {/* MTN */}
              <button
                onClick={() => setProvider('mtn')}
                className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                  provider === 'mtn' ? 'border-[#F5A623] bg-[#FFFBF0]' : 'border-border bg-card hover:border-[#F5A623]/40'
                }`}
              >
                {provider === 'mtn' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#F5A623] rounded-full flex items-center justify-center">
                    <Check size={10} strokeWidth={3} className="text-white" />
                  </span>
                )}
                <div className="w-10 h-10 bg-[#F5A623] rounded-xl flex items-center justify-center mb-3">
                  <Wallet size={18} className="text-white" />
                </div>
                <p className="font-semibold text-sm text-foreground">MTN Mobile Money</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Cameroon &middot; +237</p>
              </button>

              {/* Orange */}
              <button
                onClick={() => setProvider('orange')}
                className={`relative p-4 rounded-2xl border-2 transition-all text-left ${
                  provider === 'orange' ? 'border-[#FF6900] bg-[#FFF7F3]' : 'border-border bg-card hover:border-[#FF6900]/40'
                }`}
              >
                {provider === 'orange' && (
                  <span className="absolute top-2.5 right-2.5 w-5 h-5 bg-[#FF6900] rounded-full flex items-center justify-center">
                    <Check size={10} strokeWidth={3} className="text-white" />
                  </span>
                )}
                <div className="w-10 h-10 bg-[#FF6900] rounded-xl flex items-center justify-center mb-3">
                  <CreditCard size={18} className="text-white" />
                </div>
                <p className="font-semibold text-sm text-foreground">Orange Money</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Cameroon &middot; +237</p>
              </button>
            </div>
          </div>

          {/* Phone number */}
          <div className="bg-card rounded-2xl border border-border p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {provider === 'mtn' ? 'MTN' : 'Orange'} Number
            </p>
            <div className="flex items-center gap-3">
              <div
                className="px-3 py-2.5 rounded-xl border border-border text-sm font-semibold bg-secondary shrink-0"
                style={{ color: activeColor }}
              >
                +237
              </div>
              <input
                type="tel"
                placeholder="6XX XXX XXX"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                maxLength={9}
                className="flex-1 px-3 py-2.5 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background tracking-widest"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              You will receive a confirmation from {provider === 'mtn' ? 'MTN Mobile Money' : 'Orange Money'} with your usual PIN prompt.
            </p>
          </div>

          {/* Summary */}
          <div className="bg-secondary rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operator</span>
              <span className="font-medium">{provider === 'mtn' ? 'MTN Mobile Money' : 'Orange Money'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Number</span>
              <span className="font-medium">{phone ? `+237 ${phone}` : '—'}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-border">
              <span>Amount Due Now</span>
              <span className="text-primary">11,500 XAF</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handlePay}
            disabled={phone.length < 9 || confirming}
            style={{ backgroundColor: activeColor }}
            className="w-full text-white font-bold py-4 rounded-xl transition-all text-sm opacity-100 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 inline-flex items-center justify-center gap-2"
          >
            {confirming ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Lock size={15} />
                Confirm Payment — 11,500 XAF
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted-foreground leading-relaxed">
            By confirming, you agree to Carely Terms of Service. Funds will be released to the caregiver after service validation.
          </p>
        </div>
      </div>
    </div>
  )
}

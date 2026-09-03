import {
  Globe,
  ChevronRight,
  ShieldCheck,
  Lock,
  Star as StarIcon,
  Shield,
  Stethoscope,
  Baby,
  Sparkles,
  Droplets,
  Shirt,
  Utensils,
  Users,
  TrendingUp,
  Leaf,
  UserCheck,
  ClipboardCheck,
  Key,
  Heart,
  Share2,
  Send,
  AtSign,
  Mail,
  LogIn,
} from "lucide-react";
import { SPECIALTY_META } from "../data";
import girlImg from "../assets/man.jpg";

const SERVICES = [
  {
    key: "nursing",
    title: "Home Nursing",
    desc: "Certified nurses for post-operative care, chronic disease management, and elderly care at home.",
    cta: "Find a Nurse",
    Icon: Stethoscope,
  },
  {
    key: "babysitting",
    title: "Babysitting",
    desc: "Certified childcare professionals for babies and children from 6 months to 10 years.",
    cta: "Find a Babysitter",
    Icon: Baby,
  },
  {
    key: "cleaning",
    title: "Domestic Cleaning",
    desc: "Expert housekeepers for full home cleaning, dusting, tidying, and general daily maintenance.",
    cta: "Find a Cleaner",
    Icon: Sparkles,
  },
  {
    key: "indoor_cleaning",
    title: "Indoor Cleaning",
    desc: "Deep interior housekeeping, surface disinfection, floor tile scrubbing, and room sanitization.",
    cta: "Book Indoor Clean",
    Icon: Sparkles,
  },
  {
    key: "pet_care",
    title: "Pet Walking",
    desc: "Reliable pet sitters and walkers for daily dog walking, routine feeding, and caring companionship.",
    cta: "Find a Pet Walker",
    Icon: Heart,
  },
  {
    key: "gardening",
    title: "Gardening",
    desc: "Compound landscaping, professional lawn mowing, hedge trimming, flower care, and weed removal.",
    cta: "Hire a Gardener",
    Icon: Leaf,
  },
  {
    key: "laundry_ironing",
    title: "Laundry & Ironing",
    desc: "Full garment washing, delicate fabric care, crisp steam pressing, and closet folding service.",
    cta: "Book Laundry Care",
    Icon: Shirt,
  },
  {
    key: "fridge_cleaning",
    title: "Fridge Cleaning",
    desc: "Deep freezer defrosting, shelf sterilization, mold removal, and complete odor neutralization.",
    cta: "Clean My Fridge",
    Icon: Droplets,
  },
];

const TRUST_POINTS = [
  {
    Icon: ShieldCheck,
    title: "Identity Verified",
    desc: "Every provider is verified with an official government-issued ID.",
  },
  {
    Icon: ClipboardCheck,
    title: "Credentials Checked",
    desc: "Professional certifications and background checks are reviewed.",
  },
  {
    Icon: Lock,
    title: "Escrow Protection",
    desc: "Payments are held securely in escrow until service is confirmed.",
  },
  {
    Icon: Shield,
    title: "Dispute Guarantee",
    desc: "If anything goes wrong, our team intervenes within 4 business hours.",
  },
];

const STATS = [
  { Icon: Users, num: "250+", label: "Active providers" },
  { Icon: StarIcon, num: "4.8", label: "Average rating" },
  { Icon: TrendingUp, num: "1,200+", label: "Families served" },
];

export default function Landing({ onNavigate }) {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    if (id === "top") {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Header / Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 h-16 flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={(e) => handleScrollTo(e, "top")}
          >
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <Leaf size={18} className="text-primary" />
            </div>
            <span className="font-display text-lg font-semibold text-primary">
              Carely
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#home"
              onClick={(e) => handleScrollTo(e, "top")}
              className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Home
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => handleScrollTo(e, "how-it-works")}
              className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              How it works
            </a>
            <a
              href="#services"
              onClick={(e) => handleScrollTo(e, "services")}
              className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Services
            </a>
            <a
              href="#reviews"
              onClick={(e) => handleScrollTo(e, "reviews")}
              className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Reviews
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('login')}
              className="text-base font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogIn size={15} />
              <span>Log in</span>
            </button>
            <button
              onClick={() => onNavigate("pack")}
              className="bg-[#1E4030] text-white text-base font-bold px-5 py-2.5 rounded-xl hover:bg-[#152e22] transition-colors inline-flex items-center gap-1 shadow-sm"
            >
              <span>Get Started</span>
              <span className="font-bold">&rarr;</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-background pt-10 pb-20 lg:pt-16 lg:pb-28">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side text content */}
            <div className="space-y-6">
              {/* Location Badge */}
              <div className="inline-flex items-center gap-2 bg-[#FDF6F0] text-[#D97706] text-xs font-semibold px-4 py-2 rounded-full border border-[#FDE68A]/40">
                <span className="w-1.5 h-1.5 bg-[#D97706] rounded-full"></span>
                Available in Yaounde &amp; Douala
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight tracking-tight text-[#1E4030]">
                Trusted services <br />
                <span className="text-[#E29578]">for your everyday needs</span>
              </h1>

              {/* Description */}
              <p className="text-[#8A7E74] text-base leading-relaxed max-w-lg">
                Carely  connects Cameroonian households with verified service providers for cleaning, childcare, home assistance, 
                and more with secure escrow payments, verified arrivals, and reliable booking management.
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => onNavigate("search")}
                  className="bg-[#1E4030] text-white hover:bg-[#152e22] px-8 py-4 rounded-full font-bold text-sm transition-all text-center shadow-lg hover:shadow-xl"
                >
                  Find a provider
                </button>
                <button
                  onClick={() => onNavigate('pack')}
                  className="border border-[#E2D9CF] text-[#1C1A17] hover:bg-[#E2D9CF]/10 px-8 py-3.5 rounded-full font-semibold text-sm transition-colors text-center"
                >
                  Become a provider
                </button>
              </div>

              {/* Stats Block */}
              <div className="border-t border-[#E2D9CF] pt-6 mt-8">
                <div className="flex flex-wrap items-center gap-6 lg:gap-8">
                  <div>
                    <div className="font-display text-3xl font-bold text-[#1E4030]">
                      847
                    </div>
                    <div className="text-[#8A7E74] text-xs mt-0.5">
                      Verified providers
                    </div>
                  </div>
                  <div className="hidden sm:block w-[1px] h-8 bg-[#E2D9CF]"></div>
                  <div>
                    <div className="font-display text-3xl font-bold text-[#1E4030]">
                      4.8â˜…
                    </div>
                    <div className="text-[#8A7E74] text-xs mt-0.5">
                      Average rating
                    </div>
                  </div>
                  <div className="hidden sm:block w-[1px] h-8 bg-[#E2D9CF]"></div>
                  <div>
                    <div className="font-display text-3xl font-bold text-[#1E4030]">
                      2,400+
                    </div>
                    <div className="text-[#8A7E74] text-xs mt-0.5">
                      Families served
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side image & floating card */}
            <div className="relative">
              <div className="aspect-[4/5] sm:aspect-square md:aspect-[4/3] lg:aspect-[4/5] rounded-[32px] overflow-hidden border border-[#E2D9CF]/40 shadow-md">
                <img
                  src={girlImg}
                  alt="Caregiver at home"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Marie-Claire Card */}
              <div className="absolute bottom-6 left-6 right-6 bg-white rounded-2xl shadow-lg border border-[#E2D9CF]/40 p-4 max-w-sm flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border border-[#E2D9CF]">
                    <img
                      src="https://images.unsplash.com/photo-1627328543975-3f0ba8a823b0?w=400&h=400&fit=crop&auto=format"
                      alt="Marie-Claire N."
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-[#1C1A17]">
                      Marie-Claire N.
                    </h4>
                    <p className="text-[#8A7E74] text-[10px] mt-0.5">
                      Nurse &middot; &star; 4.9
                    </p>
                  </div>
                </div>
                <span className="bg-green-50 text-green-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-green-200 shrink-0">
                  Available
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-[#FAF8F5] py-20 border-b border-[#E2D9CF]/60"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="text-xs font-semibold tracking-wider text-[#D97706] uppercase block mb-3">
              Simple &amp; Transparent
            </span>
            <h2 className="font-display text-4xl font-semibold text-[#1E4030]">
              How it works
            </h2>
          </div>

          <div className="relative">
            {/* Horizontal connection line for desktop */}
            <div className="hidden md:block absolute top-7 left-12 right-12 h-[1px] bg-[#E2D9CF]"></div>

            <div className="grid md:grid-cols-4 gap-8 relative z-10">
              {/* Step 1 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-[#1E4030] text-white font-bold rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-[#1E4030]">
                  01
                </div>
                <h3 className="font-semibold text-base text-[#1E4030] mb-2.5">
                  Describe your need
                </h3>
                <p className="text-xs text-[#8A7E74] leading-relaxed max-w-[200px] mx-auto">
                  Choose the type of service and specify the duration whether 
                  one-time session or recurring schedule.
                </p>
              </div>

              {/* Step 2 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-[#1E4030] text-white font-bold rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-[#1E4030]">
                  02
                </div>
                <h3 className="font-semibold text-base text-[#1E4030] mb-2.5">
                  Choose a provider
                </h3>
                <p className="text-xs text-[#8A7E74] leading-relaxed max-w-[200px] mx-auto">
                  Our algorithm shows you available, verified providers rated
                  by other families.
                </p>
              </div>

              {/* Step 3 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-[#1E4030] text-white font-bold rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-[#1E4030]">
                  03
                </div>
                <h3 className="font-semibold text-base text-[#1E4030] mb-2.5">
                  Confirm and pay
                </h3>
                <p className="text-xs text-[#8A7E74] leading-relaxed max-w-[200px] mx-auto">
                  Payment is secured in escrow;the provider receives
                  their funds only after the service.
                </p>
              </div>

              {/* Step 4 */}
              <div className="text-center">
                <div className="w-14 h-14 bg-[#1E4030] text-white font-bold rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm border border-[#1E4030]">
                  04
                </div>
                <h3 className="font-semibold text-base text-[#1E4030] mb-2.5">
                  Confirm arrival
                </h3>
                <p className="text-xs text-[#8A7E74] leading-relaxed max-w-[200px] mx-auto">
                  A unique OTP code secures each session. You know it is really
                  your provider who is present.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="max-w-7xl mx-auto px-6 lg:px-12 py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl font-semibold text-primary mb-3">
            Our Services
          </h2>
          <p className="text-muted-foreground">
            Find the right provider for your needs
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SERVICES.map(({ key, title, desc, cta, Icon }) => {
            const meta = SPECIALTY_META[key] || { bg: '#EDF7F2', color: '#1E4030' };
            return (
              <div
                key={key}
                onClick={() => onNavigate("search")}
                className="bg-card rounded-2xl border border-border p-6 cursor-pointer hover:border-primary/40 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: meta.bg }}
                >
                  <Icon size={22} style={{ color: meta.color }} />
                </div>
                <h3 className="font-semibold text-foreground text-lg mb-2">
                  {title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5">
                  {desc}
                </p>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:underline"
                  style={{ color: meta.color }}
                >
                  {cta}
                  <ChevronRight size={14} />
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Trust section */}
      <section className="bg-secondary py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-semibold text-primary mb-3">
              Why Carely?
            </h2>
            <p className="text-muted-foreground">
              Trust at the heart of every booking
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TRUST_POINTS.map(({ Icon, title, desc }) => (
              <div
                key={title}
                className="bg-card rounded-2xl p-5 border border-border text-center"
              >
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">
                  {title}
                </h3>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Reviews Section */}
      <section id="reviews" className="bg-[#1E4030] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left Side: Verification details */}
            <div>
              <span className="text-xs font-semibold tracking-wider text-[#E29578] uppercase block mb-3">
                Trust &amp; Security
              </span>
              <h2 className="font-display text-3xl lg:text-4xl font-semibold leading-tight mb-6">
                Every provider is rigorously verified
              </h2>
              <p className="text-white/70 text-sm leading-relaxed mb-8">
                National ID verification, reference checks, phone interviews,
                and continuous monitoring via family reviews.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* ID Checked */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <UserCheck size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white mb-0.5">
                      Identity verified
                    </h4>
                    <p className="text-white/60 text-xs">
                      ID / Passport checked
                    </p>
                  </div>
                </div>

                {/* References Checked */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <ClipboardCheck size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white mb-0.5">
                      References checked
                    </h4>
                    <p className="text-white/60 text-xs">
                      Professional history
                    </p>
                  </div>
                </div>

                {/* Secure Payment */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <Lock size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white mb-0.5">
                      Secure payment
                    </h4>
                    <p className="text-white/60 text-xs">MTN / Orange Escrow</p>
                  </div>
                </div>

                {/* OTP Arrival */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-3 hover:bg-white/10 transition-colors">
                  <div className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center shrink-0">
                    <Key size={18} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-white mb-0.5">
                      Arrival OTP
                    </h4>
                    <p className="text-white/60 text-xs">
                      Real-time confirmation
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side: What families say */}
            <div>
              <h2 className="font-display text-2xl font-semibold mb-8 text-white">
                What families say
              </h2>

              <div className="space-y-6">
                {/* Review 1 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon
                          key={i}
                          size={13}
                          className="text-accent fill-accent"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider border border-white/10 px-2.5 py-0.5 rounded-full">
                      Home Nursing
                    </span>
                  </div>
                  <blockquote className="text-white/80 text-sm italic leading-relaxed my-4 block">
                    "Since I started using Carely, I leave for the office
                    without worry. Marie-Claire takes care of my mother with
                    patience and attention that I wouldn't have thought possible
                    at this rate."
                  </blockquote>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0 border border-white/10">
                      C
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">
                        Carine Ngo
                      </p>
                      <p className="text-white/50 text-[11px]">Yaounde</p>
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon
                          key={i}
                          size={13}
                          className="text-accent fill-accent"
                        />
                      ))}
                    </div>
                    <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider border border-white/10 px-2.5 py-0.5 rounded-full">
                      Babysitting
                    </span>
                  </div>
                  <blockquote className="text-white/80 text-sm italic leading-relaxed my-4 block">
                    "The booking process is simple, the identity verification
                    reassured us, and Fatima has become a member of our family.
                    Our children ask for her by name!"
                  </blockquote>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white shrink-0 border border-white/10">
                      T
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-white">
                        Thierry &amp; AimÃ©e Fotso
                      </p>
                      <p className="text-white/50 text-[11px]">Douala</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
        <div className="bg-gradient-to-br from-[#EFECE6] to-[#E0D8CE] rounded-[32px] px-8 py-20 text-center">
          <h2 className="font-display text-3xl lg:text-4xl font-semibold text-[#1E4030] mb-4">
            Ready to find your provider?
          </h2>
          <p className="text-sm text-[#8A7E74] mb-8 max-w-xl mx-auto leading-relaxed">
            Join over 2,400 families who trust Carely for the care that truly
            matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => onNavigate("search")}
              className="w-full sm:w-auto bg-[#1E4030] text-white font-semibold px-8 py-3.5 rounded-full hover:bg-[#152e22] transition-colors shadow-sm text-sm"
            >
              Find a provider
            </button>
            <button
              onClick={() => onNavigate('pack')}
              className="w-full sm:w-auto border border-[#1E4030] text-[#1E4030] font-semibold px-8 py-3.5 rounded-full hover:bg-[#1E4030]/5 transition-colors text-sm"
            >
              Become a provider
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E2D9CF] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {/* Logo, About, Socials, & Newsletter */}
            <div className="col-span-1 md:col-span-3 lg:col-span-2 space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-[#1E4030] text-white rounded-xl flex items-center justify-center shadow-sm">
                  <Heart size={16} className="fill-white text-[#1E4030]" />
                </div>
                <span className="font-display text-lg font-semibold text-[#1E4030]">
                  Carely
                </span>
              </div>

              <p className="text-xs text-[#8A7E74] leading-relaxed max-w-sm">
                Connecting families with trusted providers across Cameroon.
                Safe, verified and always available.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-2">
                {[
                  { Icon: Share2, href: "#share" },
                  { Icon: Send, href: "#telegram" },
                  { Icon: AtSign, href: "#threads" },
                  { Icon: Mail, href: "#mail" },
                ].map(({ Icon, href }, idx) => (
                  <a
                    key={idx}
                    href={href}
                    className="w-9 h-9 rounded-xl border border-[#E2D9CF] flex items-center justify-center text-[#8A7E74] hover:text-[#1E4030] hover:border-[#1E4030] bg-[#FAF8F5] transition-all"
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>

              {/* Newsletter Form */}
              <div className="flex flex-col sm:flex-row gap-2 max-w-sm pt-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2.5 border border-[#E2D9CF] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#1E4030] bg-[#FAF8F5] text-[#1C1A17]"
                />
                <button className="bg-[#1E4030] hover:bg-[#152e22] text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-colors inline-flex items-center justify-center gap-1.5 shrink-0">
                  <Mail size={13} />
                  Subscribe
                </button>
              </div>
            </div>

            {/* Column 2 - COMPANY */}
            <div>
              <h4 className="text-[11px] font-bold text-[#8A7E74] tracking-wider uppercase mb-4">
                Company
              </h4>
              <ul className="space-y-2.5 text-xs text-[#8A7E74]">
                <li>
                  <a
                    href="#about"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#careers"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#press"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Press
                  </a>
                </li>
                <li>
                  <a
                    href="#blog"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3 - SERVICES */}
            <div>
              <h4 className="text-[11px] font-bold text-[#8A7E74] tracking-wider uppercase mb-4">
                Services
              </h4>
              <ul className="space-y-2.5 text-xs text-[#8A7E74]">
                <li>
                  <a
                    href="#babysitting"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Babysitting
                  </a>
                </li>
                <li>
                  <a
                    href="#elderly-care"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Elderly Care
                  </a>
                </li>
                <li>
                  <a
                    href="#nursing"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Home Nursing
                  </a>
                </li>
                <li>
                  <a
                    href="#cleaning"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Cleaning
                  </a>
                </li>
                <li>
                  <a
                    href="#cooking"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Cooking
                  </a>
                </li>
                <li>
                  <a
                    href="#driver"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Driver
                  </a>
                </li>
                <li>
                  <a
                    href="#housekeeping"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Housekeeping
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4 - SUPPORT */}
            <div>
              <h4 className="text-[11px] font-bold text-[#8A7E74] tracking-wider uppercase mb-4">
                Support
              </h4>
              <ul className="space-y-2.5 text-xs text-[#8A7E74]">
                <li>
                  <a
                    href="#help"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#contact"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a
                    href="#safety"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Safety
                  </a>
                </li>
                <li>
                  <a
                    href="#community"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Community
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 5 - LEGAL */}
            <div>
              <h4 className="text-[11px] font-bold text-[#8A7E74] tracking-wider uppercase mb-4">
                Legal
              </h4>
              <ul className="space-y-2.5 text-xs text-[#8A7E74]">
                <li>
                  <a
                    href="#privacy"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#cookies"
                    className="hover:text-[#1C1A17] transition-colors"
                  >
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-[#E2D9CF]/50 mt-12 pt-8 text-center">
            <p className="text-[11px] text-[#8A7E74]">
              &copy; 2026 Carely &middot; Yaounde &amp; Douala &middot; All
              rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}





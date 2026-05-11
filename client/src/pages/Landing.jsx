import { useNavigate } from 'react-router-dom';
import { useUser, SignInButton, SignUpButton } from '@clerk/clerk-react';
import { Sprout, ShoppingCart, Star, ArrowRight, CheckCircle2, Leaf, TrendingUp, Shield } from 'lucide-react';

const features = [
  {
    icon: Leaf,
    title: 'Fresh from the Farm',
    desc: 'Connect directly with local farmers for the freshest produce, sourced sustainably.',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  {
    icon: TrendingUp,
    title: 'Real-time Pricing',
    desc: 'Get live market alerts and fair pricing data to make smarter procurement decisions.',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    icon: Shield,
    title: 'Trusted Network',
    desc: 'Every farmer is verified. Read reviews and ratings from verified buyers before ordering.',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
];

const stats = [
  { value: '2,400+', label: 'Verified Farmers' },
  { value: '98%', label: 'Fulfillment Rate' },
  { value: '15K+', label: 'Orders Completed' },
  { value: '4.8★', label: 'Avg. Rating' },
];

const steps = [
  { step: '01', title: 'Sign Up', desc: 'Create your account as a Farmer or Seller in under 2 minutes.' },
  { step: '02', title: 'Set Up Profile', desc: 'Add your location, products, and preferences to get matched.' },
  { step: '03', title: 'Connect & Trade', desc: 'Browse farmers, place orders, and track deliveries seamlessly.' },
];

export default function Landing() {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  if (isSignedIn) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* ── Hero ── */}
      <section className="hero-gradient relative overflow-hidden min-h-[85vh] flex items-center">
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-green-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-green-300/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-24 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-8">
            <Sprout className="w-4 h-4 text-green-400" />
            <span className="text-green-300 text-sm font-medium">Sri Lanka's #1 Agricultural Marketplace</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6">
            Farm to Market,
            <br />
            <span className="text-green-400">Simplified.</span>
          </h1>

          <p className="text-green-100/80 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Agriconnect bridges the gap between farmers and sellers. Place orders,
            manage products, and grow your business — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <SignUpButton mode="modal">
              <button className="btn-primary text-base px-8 py-3.5 rounded-xl shadow-lg shadow-green-900/30 hover:shadow-green-900/50">
                Get Started Free <ArrowRight className="w-4 h-4" />
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border-2 border-white/30 text-white font-semibold text-base hover:bg-white/10 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center justify-center gap-5 mt-12 text-green-200/70 text-sm">
            {['No credit card required', 'Free for farmers', 'Secure & encrypted'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-green-400" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-white dark:bg-[#161b22] border-y border-gray-100 dark:border-[#30363d]">
        <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {stats.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-extrabold text-green-700 dark:text-green-400 mb-1">{value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
            Everything you need to trade smarter
          </h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Whether you're a farmer managing inventory or a seller sourcing produce, Agriconnect gives you the tools to succeed.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, desc, color, bg }) => (
            <div key={title} className="card p-6">
              <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="bg-green-950 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">How it works</h2>
            <p className="text-green-300/70 max-w-xl mx-auto">Get started in minutes. No technical knowledge required.</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4">
                  <span className="text-green-400 font-bold text-lg">{step}</span>
                </div>
                <h3 className="text-white font-bold mb-2">{title}</h3>
                <p className="text-green-300/70 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For Farmers / For Sellers ── */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Farmer */}
          <div className="card p-8 border-green-200 dark:border-green-900/50 bg-gradient-to-br from-green-50 to-white dark:from-green-950/30 dark:to-[#161b22]">
            <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-5">
              <Sprout className="w-6 h-6 text-green-700 dark:text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">For Farmers</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Manage your farm products, receive orders, and connect with verified buyers.</p>
            <ul className="space-y-2 mb-6">
              {['List unlimited products', 'Receive & manage orders', 'Build your reputation', 'Market price alerts'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <SignUpButton mode="modal">
              <button className="btn-primary w-full">Join as Farmer</button>
            </SignUpButton>
          </div>

          {/* Seller */}
          <div className="card p-8 border-purple-200 dark:border-purple-900/50 bg-gradient-to-br from-purple-50 to-white dark:from-purple-950/30 dark:to-[#161b22]">
            <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center mb-5">
              <ShoppingCart className="w-6 h-6 text-purple-700 dark:text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">For Sellers</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-5">Discover verified farmers, source fresh produce, and streamline your supply chain.</p>
            <ul className="space-y-2 mb-6">
              {['Browse verified farmers', 'Place & track orders', 'Rate & review farmers', 'Smart search & filters'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" /> {item}
                </li>
              ))}
            </ul>
            <SignUpButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-semibold rounded-lg transition-colors">
                Join as Seller
              </button>
            </SignUpButton>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="hero-gradient py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Star className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-3xl font-extrabold text-white mb-3">Ready to transform your agricultural business?</h2>
          <p className="text-green-200/80 mb-8">Join thousands of farmers and sellers already using Agriconnect.</p>
          <SignUpButton mode="modal">
            <button className="btn-primary px-10 py-3.5 text-base rounded-xl shadow-lg">
              Start for Free <ArrowRight className="w-4 h-4" />
            </button>
          </SignUpButton>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-950 text-green-300/60 text-center text-sm py-6">
        © {new Date().getFullYear()} Agriconnect. Connecting farms to markets across Sri Lanka.
      </footer>
    </div>
  );
}

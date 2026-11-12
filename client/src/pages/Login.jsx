import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Leaf,
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  Menu,
  X,
  Activity,
  BrainCircuit,
  BarChart3,
  Zap,
  CarFront,
  Utensils,
  ShoppingBag,
  CheckCircle2,
  Globe2,
  Sprout,
  Recycle,
  Lightbulb,
  TreePine,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: Activity,
      title: "Carbon Tracking",
      description:
        "Record your everyday activities and understand their environmental impact.",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: BrainCircuit,
      title: "AI-Powered Insights",
      description:
        "Get intelligent suggestions and personalized ways to reduce emissions.",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description:
        "Visualize your footprint with category-wise reports and activity trends.",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: Sprout,
      title: "Eco Challenges",
      description:
        "Build greener habits through practical and achievable daily challenges.",
      color: "bg-orange-100 text-orange-700",
    },
  ];

  const categories = [
    { icon: CarFront, name: "Transport", description: "Travel smarter" },
    { icon: Zap, name: "Electricity", description: "Save energy" },
    { icon: Utensils, name: "Food", description: "Eat consciously" },
    { icon: ShoppingBag, name: "Shopping", description: "Consume wisely" },
  ];

  const steps = [
    {
      number: "01",
      title: "Track your activities",
      description: "Add your travel, electricity, food and shopping activities.",
      icon: Activity,
    },
    {
      number: "02",
      title: "Understand your impact",
      description: "See your estimated carbon footprint through clear analytics.",
      icon: BarChart3,
    },
    {
      number: "03",
      title: "Get AI recommendations",
      description: "Discover practical suggestions based on your footprint.",
      icon: BrainCircuit,
    },
    {
      number: "04",
      title: "Make a difference",
      description: "Build sustainable habits and work towards a greener future.",
      icon: TreePine,
    },
  ];

  const tips = [
    "Walk or cycle for short-distance journeys whenever possible.",
    "Switch off lights and appliances when they are not in use.",
    "Carry a reusable water bottle instead of buying plastic bottles.",
    "Plan your shopping and choose reusable products.",
  ];

  const [tipIndex, setTipIndex] = useState(0);

  return (
    <div className="min-h-screen bg-[#f7faf6] text-[#183b2d] overflow-x-hidden">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-green-100">
        <div className="max-w-7xl mx-auto px-5 lg:px-8 h-20 flex items-center justify-between">

          <a href="#home" className="flex items-center gap-3">
            <div className="bg-green-700 text-white p-2.5 rounded-xl">
              <Leaf size={25} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Eco<span className="text-green-600">Track</span>
              </h1>
              <p className="text-[10px] tracking-[2px] text-gray-500 uppercase">
                Live greener
              </p>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
            <a href="#features" className="hover:text-green-700">Features</a>
            <a href="#how-it-works" className="hover:text-green-700">How It Works</a>
            <a href="#categories" className="hover:text-green-700">Categories</a>
            <a href="#eco-tips" className="hover:text-green-700">Eco Tips</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <a href="#login" className="px-5 py-2.5 font-semibold text-green-700 hover:bg-green-50 rounded-xl">
              Sign In
            </a>
            <Link
              to="/register"
              className="bg-green-700 hover:bg-green-800 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2"
            >
              Get Started <ArrowRight size={17} />
            </Link>
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenu(!mobileMenu)}
            aria-label="Toggle navigation"
          >
            {mobileMenu ? <X /> : <Menu />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-white border-t p-5 flex flex-col gap-4">
            <a href="#features" onClick={() => setMobileMenu(false)}>Features</a>
            <a href="#how-it-works" onClick={() => setMobileMenu(false)}>How It Works</a>
            <a href="#categories" onClick={() => setMobileMenu(false)}>Categories</a>
            <a href="#eco-tips" onClick={() => setMobileMenu(false)}>Eco Tips</a>
            <a href="#login" onClick={() => setMobileMenu(false)}>Sign In</a>
            <Link to="/register" className="bg-green-700 text-white p-3 rounded-xl text-center">
              Create Account
            </Link>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section id="home" className="relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-green-200/40 blur-3xl rounded-full" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-lime-200/30 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 py-16 lg:py-24 grid lg:grid-cols-2 gap-14 items-center">

          <div>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-semibold mb-7">
              <Globe2 size={17} />
              Your journey towards sustainable living
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight">
              Understand your impact.
              <span className="block text-green-700 mt-2">
                Change the future.
              </span>
            </h1>

            <p className="text-gray-600 text-lg leading-8 mt-7 max-w-xl">
              Every choice matters. Track your carbon footprint, explore AI-powered
              insights, and take meaningful steps towards a healthier planet.
            </p>

            <div className="flex flex-wrap gap-4 mt-9">
              <a
                href="#login"
                className="bg-green-700 hover:bg-green-800 text-white px-7 py-4 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-green-900/10"
              >
                Start Tracking <ArrowRight size={19} />
              </a>

              <a
                href="#features"
                className="border border-green-200 hover:bg-green-50 px-7 py-4 rounded-xl font-bold flex items-center gap-2"
              >
                Explore Features <ChevronRight size={19} />
              </a>
            </div>

            <div className="flex flex-wrap gap-5 mt-10 text-sm text-gray-500">
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-600" />
                Easy activity tracking
              </span>
              <span className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-green-600" />
                AI-powered suggestions
              </span>
            </div>
          </div>

          {/* HERO VISUAL */}
          <div className="relative">
            <div className="bg-[#123b2e] rounded-[2rem] p-7 md:p-9 shadow-2xl shadow-green-900/20 text-white relative overflow-hidden">
              <div className="absolute -right-12 -top-12 w-56 h-56 bg-green-400/10 rounded-full" />
              <div className="absolute -left-16 -bottom-20 w-64 h-64 bg-lime-300/10 rounded-full" />

              <div className="relative">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-green-200 text-sm">Your sustainability journey</p>
                    <h2 className="text-2xl font-bold mt-1">A better tomorrow</h2>
                  </div>
                  <div className="bg-white/10 p-3 rounded-2xl">
                    <Leaf size={27} className="text-lime-300" />
                  </div>
                </div>

                <div className="mt-9 bg-white/10 border border-white/10 rounded-2xl p-5">
                  <div className="flex justify-between items-center">
                    <span className="text-green-100 text-sm">Your daily choices</span>
                    <Sparkles className="text-lime-300" size={20} />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mt-5">
                    <div className="bg-white/10 rounded-xl p-4">
                      <CarFront className="text-lime-300 mb-3" />
                      <p className="font-semibold">Transport</p>
                      <p className="text-green-200 text-xs mt-1">Track your travel</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <Zap className="text-yellow-300 mb-3" />
                      <p className="font-semibold">Energy</p>
                      <p className="text-green-200 text-xs mt-1">Save electricity</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <Utensils className="text-orange-200 mb-3" />
                      <p className="font-semibold">Food</p>
                      <p className="text-green-200 text-xs mt-1">Make mindful choices</p>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                      <ShoppingBag className="text-pink-200 mb-3" />
                      <p className="font-semibold">Shopping</p>
                      <p className="text-green-200 text-xs mt-1">Choose responsibly</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <div className="bg-lime-300 text-green-950 p-3 rounded-xl">
                    <Sprout size={24} />
                  </div>
                  <div>
                    <p className="font-bold">Small actions create big change.</p>
                    <p className="text-green-200 text-xs mt-1">Start with one sustainable habit.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex absolute -left-7 top-1/3 bg-white shadow-xl p-4 rounded-2xl items-center gap-3">
              <div className="bg-green-100 p-3 rounded-xl text-green-700">
                <TreePine size={25} />
              </div>
              <div>
                <p className="font-bold text-sm">Think Green</p>
                <p className="text-xs text-gray-500">Act for tomorrow</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOGIN */}
      <section id="login" className="py-20 px-5 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">

          <div>
            <div className="inline-flex items-center gap-2 text-green-700 font-bold text-sm mb-4">
              <ShieldCheck size={18} /> YOUR PERSONAL ECO DASHBOARD
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              Your greener journey
              <span className="text-green-700"> starts here.</span>
            </h2>

            <p className="text-gray-500 leading-7 mt-5 max-w-lg">
              Sign in to record activities, monitor your footprint, explore
              analytics and get personalized recommendations from your AI
              sustainability assistant.
            </p>

            <div className="mt-8 space-y-5">
              {[
                "Monitor your daily carbon footprint",
                "Explore personalized AI recommendations",
                "View your activity history and analytics",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="text-green-600 shrink-0" size={21} />
                  <span className="text-gray-700 font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-10 bg-green-50 border border-green-100 rounded-2xl p-5 max-w-md">
              <div className="flex items-center gap-3">
                <div className="bg-green-700 text-white p-3 rounded-xl">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="font-bold">Your account, your data</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Sign in to access your personal dashboard.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* LOGIN FORM */}
          <div className="bg-[#f7faf6] border border-green-100 rounded-[2rem] p-7 md:p-10 shadow-xl shadow-green-900/5">
            <div className="flex items-center gap-3 mb-7">
              <div className="bg-green-700 text-white p-3 rounded-2xl">
                <Leaf size={27} />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold">Welcome Back</h3>
                <p className="text-sm text-gray-500">Sign in to EcoTrack</p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2">
                  Email Address
                </label>
                <div className="flex items-center border border-gray-200 bg-white rounded-xl px-4 focus-within:ring-2 focus-within:ring-green-500">
                  <Mail className="text-gray-400" size={19} />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full p-4 outline-none bg-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
                  Password
                </label>
                <div className="flex items-center border border-gray-200 bg-white rounded-xl px-4 focus-within:ring-2 focus-within:ring-green-500">
                  <Lock className="text-gray-400" size={19} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="w-full p-4 outline-none bg-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-green-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-green-900/10 disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign In to EcoTrack"}
                {!loading && <ArrowRight size={19} />}
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <div className="h-px bg-gray-200 flex-1" />
              <span className="text-xs text-gray-400">NEW TO ECOTRACK?</span>
              <div className="h-px bg-gray-200 flex-1" />
            </div>

            <Link
              to="/register"
              className="w-full border-2 border-green-700 text-green-800 hover:bg-green-50 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              Create Your Free Account <ArrowRight size={18} />
            </Link>

            <p className="text-center text-xs text-gray-400 mt-6">
              By continuing, you agree to use EcoTrack responsibly.
            </p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-green-700 font-bold text-sm uppercase tracking-wider">
              What EcoTrack offers
            </span>
            <h2 className="text-4xl font-extrabold mt-4">
              Everything you need to live greener
            </h2>
            <p className="text-gray-500 mt-4 leading-7">
              Simple tools that help turn environmental awareness into everyday action.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-white border border-green-100 rounded-3xl p-7 hover:-translate-y-2 hover:shadow-xl transition duration-300"
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.color}`}>
                    <Icon size={27} />
                  </div>
                  <h3 className="font-extrabold text-xl mt-6">{feature.title}</h3>
                  <p className="text-gray-500 leading-7 text-sm mt-3">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="py-20 px-5 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-green-700 font-bold text-sm uppercase tracking-wider">
              Understand your lifestyle
            </span>
            <h2 className="text-4xl font-extrabold mt-3">
              Track the things that matter
            </h2>
            <p className="text-gray-500 mt-4">
              Explore the main areas that contribute to your everyday footprint.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div key={category.name} className="rounded-3xl bg-[#f5f9f3] p-7 text-center border border-green-100 hover:border-green-400 transition">
                  <div className="w-16 h-16 mx-auto bg-green-100 text-green-700 rounded-2xl flex items-center justify-center">
                    <Icon size={30} />
                  </div>
                  <h3 className="font-bold text-lg mt-5">{category.name}</h3>
                  <p className="text-gray-500 text-sm mt-2">{category.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-green-700 font-bold text-sm uppercase tracking-wider">
              Getting started is easy
            </span>
            <h2 className="text-4xl font-extrabold mt-3">How EcoTrack works</h2>
            <p className="text-gray-500 mt-4">
              Four simple steps to make more informed everyday choices.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative bg-white border border-green-100 rounded-3xl p-7">
                  <span className="text-5xl font-black text-green-100">{step.number}</span>
                  <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 flex items-center justify-center mt-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-xl mt-5">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-6 mt-3">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ECO TIP */}
      <section id="eco-tips" className="px-5 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#123b2e] rounded-[2rem] p-8 md:p-12 text-white flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="flex items-start gap-5">
              <div className="bg-lime-300 text-green-950 p-4 rounded-2xl shrink-0">
                <Lightbulb size={32} />
              </div>
              <div>
                <span className="text-lime-300 text-sm font-bold uppercase tracking-wider">
                  Your Eco Tip
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold mt-2">
                  One small change can matter.
                </h2>
                <p className="text-green-100 mt-3 max-w-xl leading-7">
                  {tips[tipIndex]}
                </p>
              </div>
            </div>

            <button
              onClick={() => setTipIndex((tipIndex + 1) % tips.length)}
              className="bg-lime-300 hover:bg-lime-200 text-green-950 px-6 py-4 rounded-xl font-bold flex items-center gap-2 shrink-0"
            >
              Another Tip <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-5 pb-24">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex justify-center mb-5">
            <div className="bg-green-100 text-green-700 p-4 rounded-2xl">
              <Recycle size={35} />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold">
            Ready to make a difference?
          </h2>
          <p className="text-gray-500 mt-5 max-w-2xl mx-auto leading-7">
            Start understanding your environmental impact today. Your journey
            towards more sustainable living begins with one small step.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-3 mt-8 bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-xl font-bold"
          >
            Join EcoTrack Today <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#102d25] text-white px-5 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="bg-green-600 p-2 rounded-xl">
                  <Leaf size={22} />
                </div>
                <h2 className="text-2xl font-extrabold">EcoTrack</h2>
              </div>
              <p className="text-green-200 text-sm leading-7 mt-5 max-w-xs">
                Making sustainability easier through carbon tracking, analytics
                and AI-powered insights.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-5">Explore</h3>
              <div className="space-y-3 text-sm text-green-200 flex flex-col">
                <a href="#features" className="hover:text-white">Features</a>
                <a href="#categories" className="hover:text-white">Categories</a>
                <a href="#how-it-works" className="hover:text-white">How It Works</a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-5">Get Started</h3>
              <div className="space-y-3 text-sm text-green-200 flex flex-col">
                <a href="#login" className="hover:text-white">Sign In</a>
                <Link to="/register" className="hover:text-white">Create Account</Link>
                <a href="#eco-tips" className="hover:text-white">Eco Tips</a>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-5">Our Mission</h3>
              <p className="text-sm text-green-200 leading-7">
                Helping people make informed choices for a cleaner and greener future.
              </p>
            </div>
          </div>

          <div className="border-t border-white/10 mt-10 pt-7 flex flex-col sm:flex-row justify-between gap-3 text-xs text-green-300">
            <p>© 2026 EcoTrack. All rights reserved.</p>
            <p>Track your impact. Live sustainably. 🌱</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Login;
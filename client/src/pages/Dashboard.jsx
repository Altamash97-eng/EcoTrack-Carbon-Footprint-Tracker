
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "../App.css";

import {
  Leaf, LayoutDashboard, Activity, PlusCircle, BarChart3,
  Zap, Car, Utensils, ShoppingBag, ArrowUpRight,
  User, LogOut, Menu, X, Sparkles, TrendingUp, CalendarDays,
  ChevronRight, Globe2, ShieldCheck, Target, Wind, RefreshCw
} from "lucide-react";

import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip
} from "recharts";

const COLORS = {
  Transport: "#26966B",
  Electricity: "#A3C94A",
  Food: "#F0A64A",
  Shopping: "#438EAD",
};

const ICONS = {
  Transport: Car,
  Electricity: Zap,
  Food: Utensils,
  Shopping: ShoppingBag,
};

function getTokenPayload() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return {};

    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");

    return JSON.parse(atob(base64));
  } catch {
    return {};
  }
}

function Dashboard() {
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [carbonEntries, setCarbonEntries] = useState([]);
  const [carbonStats, setCarbonStats] = useState({
    totalCO2: 0,
    totalActivities: 0,
    categoryStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const user = getTokenPayload();
  const isAdmin = user.role?.toLowerCase() === "admin";
  const firstName = user.name?.split(" ")[0] || "there";

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Activities", icon: Activity, path: "/activities" },
    { name: "Add Activity", icon: PlusCircle, path: "/add-activity" },
    { name: "Analytics", icon: BarChart3, path: "/analytics" },
    { name: "AI Hub", icon: Sparkles, path: "/ai-hub" },
    { name: "Profile", icon: User, path: "/profile" },
    { name: "Admin Panel", icon: ShieldCheck, path: "/admin" },
  ];

  const handleNavigation = (path) => {
    setMenuOpen(false);

    if (path === "/admin" && !isAdmin) {
      navigate("/dashboard", { replace: true });
      return;
    }

    navigate(path);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const fetchCarbonData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setErrorMessage("");

      const [entriesResponse, statsResponse] = await Promise.all([
        API.get("/carbon"),
        API.get("/carbon/stats"),
      ]);

      const entries = Array.isArray(entriesResponse.data)
        ? entriesResponse.data
        : entriesResponse.data?.entries || [];

      setCarbonEntries(entries);
      setCarbonStats(statsResponse.data || {});
    } catch (error) {
      console.error("Carbon dashboard error:", error);

      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setErrorMessage(
        "Unable to load your carbon data. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCarbonData();
  }, []);

  const total = Number(carbonStats.totalCO2 || 0);
  const activityCount = Number(carbonStats.totalActivities || 0);
  const average = activityCount ? total / activityCount : 0;

  const chartData = (carbonStats.categoryStats || []).map((item) => ({
    name: item._id,
    value: Number(item.totalCO2 || 0),
    color: COLORS[item._id] || "#64748b",
  }));

  const highestCategory = [...chartData].sort(
    (a, b) => b.value - a.value
  )[0];

  const stats = [
    {
      title: "Total emissions",
      value: total.toFixed(1),
      unit: "kg CO₂e",
      icon: Leaf,
      color: "bg-emerald-50 text-emerald-700",
      accent: "border-l-emerald-500",
    },
    {
      title: "Activities tracked",
      value: activityCount,
      unit: "activities",
      icon: Activity,
      color: "bg-blue-50 text-blue-700",
      accent: "border-l-blue-500",
    },
    {
      title: "Categories used",
      value: chartData.length,
      unit: "categories",
      icon: Target,
      color: "bg-amber-50 text-amber-700",
      accent: "border-l-amber-500",
    },
    {
      title: "Average per activity",
      value: average.toFixed(1),
      unit: "kg CO₂e",
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-700",
      accent: "border-l-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F4] text-[#183B2D] md:flex">

      {/* MOBILE OVERLAY */}
      {menuOpen && (
        <button
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`eco-sidebar fixed inset-y-0 left-0 z-40 flex w-[270px] flex-col px-5 py-7 text-white shadow-2xl transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-10 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#B8E986] text-[#153B2C] shadow-lg">
              <Leaf size={26} />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight">
                EcoTrack
              </h1>
              <p className="text-[10px] tracking-[2px] text-green-200/70">
                CARBON INTELLIGENCE
              </p>
            </div>
          </div>

          <button
            onClick={() => setMenuOpen(false)}
            className="rounded-xl p-2 hover:bg-white/10 md:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-4 px-3 text-[10px] font-bold tracking-[2px] text-green-200/50">
          MAIN MENU
        </div>

        <nav className="space-y-2">
          {navItems.map(({ name, icon: Icon, path }) => {
            const active = path === "/dashboard";

            return (
              <button
                key={path}
                onClick={() => handleNavigation(path)}
                className={`eco-sidebar-item group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                  active
                    ? "bg-[#B8E986] text-[#153B2C] shadow-lg shadow-black/10"
                    : "text-green-100/75 hover:text-white"
                }`}
              >
                <Icon size={19} />
                {name}

                {active && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-[#245D3F]" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-7 border-t border-white/10 pt-5">
          <button
            onClick={handleLogout}
            className="eco-sidebar-item flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-red-200 hover:bg-red-500/10"
          >
            <LogOut size={19} />
            Logout
          </button>
        </div>

        <div className="mt-auto rounded-3xl border border-white/10 bg-white/[0.06] p-5">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#B8E986] text-[#153B2C]">
            <Globe2 size={22} />
          </div>

          <h3 className="text-sm font-bold">
            Make every action count.
          </h3>

          <p className="mt-2 text-xs leading-6 text-green-100/60">
            Small sustainable choices today create a better tomorrow.
          </p>

          <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#B8E986]">
            <Wind size={15} />
            Think Green. Live Clean.
          </div>
        </div>

        <p className="mt-6 px-2 text-[10px] text-green-100/30">
          ECOTRACK · VERSION 1.0
        </p>
      </aside>

      {/* MAIN CONTENT */}
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-7 md:px-9 md:py-8">

        {/* HEADER */}
        <header className="mb-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMenuOpen(true)}
              className="rounded-xl border border-[#E5EBE3] bg-white p-2.5 shadow-sm md:hidden"
              aria-label="Open menu"
            >
              <Menu size={21} />
            </button>

            <div>
              <p className="text-sm font-medium text-[#819087]">
                Welcome back, {firstName} 👋
              </p>

              <h2 className="mt-1 text-2xl font-black tracking-tight sm:text-3xl">
                Your Dashboard
              </h2>

              <p className="mt-1 hidden text-sm text-[#87948A] sm:block">
                Here's an overview of your sustainability journey.
              </p>
            </div>
          </div>

          <button
            onClick={() => handleNavigation("/profile")}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border-4 border-white bg-[#DDF0D8] text-lg font-extrabold text-[#245D3F] shadow-md transition hover:scale-105"
            aria-label="Open profile"
          >
            {firstName.charAt(0).toUpperCase()}
          </button>
        </header>

        {/* ERROR MESSAGE */}
        {errorMessage && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {errorMessage}

            <button
              onClick={() => fetchCarbonData(true)}
              className="flex items-center gap-2 font-bold underline"
            >
              <RefreshCw size={15} />
              Retry
            </button>
          </div>
        )}

        {loading ? (
          <div className="eco-card flex min-h-[350px] flex-col items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#DDEBDD] border-t-[#26966B]" />
            <p className="mt-4 text-sm font-semibold text-[#819087]">
              Preparing your dashboard...
            </p>
          </div>
        ) : (
          <>
            {/* HERO */}
            <section className="relative mb-7 overflow-hidden rounded-[30px] bg-gradient-to-br from-[#123B2E] via-[#176447] to-[#25865A] p-6 text-white shadow-xl shadow-green-950/10 sm:p-9">
              <div className="pointer-events-none absolute -right-20 -top-28 h-80 w-80 rounded-full border-[45px] border-white/[0.05]" />
              <div className="pointer-events-none absolute -bottom-36 right-1/3 h-80 w-80 rounded-full bg-lime-300/[0.06] blur-3xl" />

              <div className="relative z-10 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
                <div>
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-green-100">
                    <Sparkles size={15} />
                    YOUR SUSTAINABILITY OVERVIEW
                  </div>

                  <p className="text-sm font-medium text-green-100/80">
                    Total carbon emissions
                  </p>

                  <div className="mt-2 flex flex-wrap items-baseline gap-3">
                    <h1 className="text-5xl font-black tracking-tight sm:text-6xl">
                      {total.toFixed(1)}
                    </h1>
                    <span className="text-xl font-semibold text-green-100">
                      kg CO₂e
                    </span>
                  </div>

                  <p className="mt-4 max-w-lg text-sm leading-7 text-green-50/75">
                    Every action counts. Understand your impact and take
                    meaningful steps towards a greener lifestyle.
                  </p>
                </div>

                <button
                  onClick={() => handleNavigation("/add-activity")}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#B8E986] px-6 py-4 text-sm font-extrabold text-[#153B2C] shadow-lg transition hover:-translate-y-1 hover:bg-[#C9F29B]"
                >
                  <PlusCircle size={19} />
                  Add New Activity
                  <ArrowUpRight size={17} />
                </button>
              </div>

              <div className="relative z-10 mt-8 flex flex-wrap gap-6 border-t border-white/15 pt-5 text-xs font-medium text-green-100/75">
                <span className="flex items-center gap-2">
                  <Leaf size={15} /> Track your impact
                </span>
                <span className="flex items-center gap-2">
                  <TrendingUp size={15} /> Understand your habits
                </span>
                <span className="flex items-center gap-2">
                  <Globe2 size={15} /> Build a greener future
                </span>
              </div>
            </section>

            {/* STATISTICS */}
            <section className="mb-7 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map(({ title, value, unit, icon: Icon, color, accent }) => (
                <div
                  key={title}
                  className={`group rounded-3xl border border-[#E8EEE6] border-l-4 ${accent} bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-6`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#819087]">
                        {title}
                      </p>

                      <div className="mt-4 flex flex-wrap items-baseline gap-2">
                        <h3 className="text-3xl font-black tracking-tight">
                          {value}
                        </h3>
                        <span className="text-xs font-medium text-[#89958D]">
                          {unit}
                        </span>
                      </div>
                    </div>

                    <div className={`rounded-2xl p-3 transition group-hover:scale-110 ${color}`}>
                      <Icon size={22} />
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* CHART AND INSIGHTS */}
            <section className="mb-7 grid grid-cols-1 gap-6 xl:grid-cols-5">

              {/* PIE CHART */}
              <div className="rounded-3xl border border-[#E8EEE6] bg-white p-5 shadow-sm sm:p-7 xl:col-span-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-extrabold">
                      Emissions by Category
                    </h3>
                    <p className="mt-1 text-sm text-[#89958D]">
                      Your carbon footprint breakdown
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#F1F7EF] p-3 text-[#39805A]">
                    <BarChart3 size={21} />
                  </div>
                </div>

                {chartData.length > 0 ? (
                  <>
                    <div className="mt-4 h-[260px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={72}
                            outerRadius={105}
                            paddingAngle={4}
                            stroke="none"
                          >
                            {chartData.map((entry) => (
                              <Cell key={entry.name} fill={entry.color} />
                            ))}
                          </Pie>

                          <Tooltip
                            formatter={(value) => [
                              `${Number(value).toFixed(2)} kg CO₂e`,
                              "Emissions",
                            ]}
                            contentStyle={{
                              borderRadius: "14px",
                              border: "1px solid #E8EEE6",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {chartData.map((item) => (
                        <div
                          key={item.name}
                          className="flex items-center gap-3 rounded-2xl bg-[#F8FAF7] p-3 transition hover:bg-[#F0F6ED]"
                        >
                          <span
                            className="h-3 w-3 shrink-0 rounded-full"
                            style={{ background: item.color }}
                          />
                          <span className="text-sm font-medium text-[#718078]">
                            {item.name}
                          </span>
                          <span className="ml-auto text-sm font-extrabold">
                            {item.value.toFixed(1)} kg
                          </span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex h-[300px] flex-col items-center justify-center text-center">
                    <div className="rounded-2xl bg-[#F1F7EF] p-4 text-[#39805A]">
                      <BarChart3 size={30} />
                    </div>
                    <p className="mt-4 font-bold">No emissions data yet</p>
                    <p className="mt-2 text-sm text-[#89958D]">
                      Add your first activity to see your chart.
                    </p>
                  </div>
                )}
              </div>

              {/* INSIGHTS */}
              <div className="flex flex-col rounded-3xl border border-[#E8EEE6] bg-white p-5 shadow-sm sm:p-7 xl:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[#EDF5EB] p-3 text-[#39805A]">
                    <Sparkles size={21} />
                  </div>

                  <div>
                    <h3 className="font-extrabold">Footprint Insights</h3>
                    <p className="text-xs text-[#89958D]">
                      Based on your recorded data
                    </p>
                  </div>
                </div>

                {highestCategory ? (
                  <div className="mt-7">
                    <p className="text-sm text-[#89958D]">
                      Highest emission category
                    </p>

                    <h2 className="mt-2 text-3xl font-black text-[#245D3F]">
                      {highestCategory.name}
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#7D8B81]">
                      This category represents{" "}
                      <strong>
                        {total > 0
                          ? ((highestCategory.value / total) * 100).toFixed(1)
                          : "0.0"}%
                      </strong>{" "}
                      of your recorded emissions.
                    </p>

                    <div className="mt-6 h-3 overflow-hidden rounded-full bg-[#EDF2EA]">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#26966B] to-[#A3C94A]"
                        style={{
                          width: `${total > 0 ? (highestCategory.value / total) * 100 : 0}%`,
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs font-medium text-[#89958D]">
                      {highestCategory.value.toFixed(1)} kg CO₂e recorded
                    </p>
                  </div>
                ) : (
                  <p className="my-auto py-10 text-sm text-[#89958D]">
                    Add activities to discover your footprint insights.
                  </p>
                )}

                <div className="mt-auto rounded-2xl bg-[#F1F7EF] p-4">
                  <p className="flex items-center gap-2 text-sm font-extrabold text-[#39805A]">
                    <Leaf size={17} />
                    A greener tip
                  </p>

                  <p className="mt-2 text-xs leading-6 text-[#718078]">
                    Review your highest-impact category to find practical ways
                    to reduce your footprint.
                  </p>

                  <button
                    onClick={() => handleNavigation("/ai-hub")}
                    className="mt-3 flex items-center gap-1 text-xs font-extrabold text-[#39805A] hover:gap-2"
                  >
                    Get AI Recommendations <ArrowUpRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            {/* RECENT ACTIVITIES */}
            <section className="overflow-hidden rounded-3xl border border-[#E8EEE6] bg-white shadow-sm">

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF1EC] px-5 py-5 sm:px-7">
                <div>
                  <h3 className="text-lg font-extrabold">
                    Recent Activities
                  </h3>
                  <p className="mt-1 text-sm text-[#89958D]">
                    Your latest recorded activities
                  </p>
                </div>

                <button
                  onClick={() => handleNavigation("/activities")}
                  className="flex items-center gap-1 rounded-xl bg-[#EDF5EB] px-4 py-2.5 text-sm font-extrabold text-[#39805A] transition hover:bg-[#DDEDD9]"
                >
                  View All <ChevronRight size={17} />
                </button>
              </div>

              <div className="divide-y divide-[#F0F2EE]">
                {carbonEntries.length > 0 ? (
                  carbonEntries.slice(0, 5).map((item) => {
                    const Icon = ICONS[item.category] || Leaf;
                    const color = COLORS[item.category] || "#26966B";

                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-3 px-5 py-4 transition hover:bg-[#FAFCF9] sm:gap-4 sm:px-7"
                      >
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                          style={{
                            backgroundColor: `${color}18`,
                            color,
                          }}
                        >
                          <Icon size={21} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-extrabold">
                            {item.activity}
                          </p>
                          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#96A198]">
                            <CalendarDays size={12} />
                            {item.category} ·{" "}
                            {item.date
                              ? new Date(item.date).toLocaleDateString()
                              : "Date unavailable"}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm font-black">
                            {Number(item.co2e || 0).toFixed(1)}
                          </p>
                          <p className="text-[10px] font-medium text-[#96A198]">
                            kg CO₂e
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="px-5 py-12 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EDF5EB] text-[#39805A]">
                      <Activity size={28} />
                    </div>

                    <p className="mt-4 font-extrabold">No activities yet</p>
                    <p className="mt-2 text-sm text-[#89958D]">
                      Start tracking your carbon footprint today.
                    </p>

                    <button
                      onClick={() => handleNavigation("/add-activity")}
                      className="mt-5 rounded-xl bg-[#245D3F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#176447]"
                    >
                      Add Your First Activity
                    </button>
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {/* FOOTER */}
        <footer className="py-9 text-center text-xs text-[#9AA49C]">
          <Leaf size={16} className="mx-auto mb-2 text-[#39805A]" />
          © 2026 EcoTrack · Building a more sustainable future
        </footer>
      </main>
    </div>
  );
}

export default Dashboard;

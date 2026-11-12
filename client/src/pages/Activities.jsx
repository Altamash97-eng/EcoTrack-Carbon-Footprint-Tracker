
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

import {
  Leaf,
  ArrowLeft,
  PlusCircle,
  RefreshCw,
  Activity,
  Zap,
  Car,
  Utensils,
  ShoppingBag,
  Search,
  Filter,
  CalendarDays,
  TrendingUp,
  BarChart3,
  LayoutDashboard,
  ChevronDown,
  Sparkles,
} from "lucide-react";

const COLORS = {
  Transport: {
    color: "#26966B",
    background: "#E8F5EA",
    icon: Car,
  },
  Electricity: {
    color: "#A3A52E",
    background: "#F3F5DE",
    icon: Zap,
  },
  Food: {
    color: "#D99137",
    background: "#FFF2E1",
    icon: Utensils,
  },
  Shopping: {
    color: "#438EAD",
    background: "#E8F2F8",
    icon: ShoppingBag,
  },
};

function Activities() {
  const navigate = useNavigate();

  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const fetchActivities = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const response = await API.get("/carbon");

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.entries || [];

      setActivities(data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message || "Unable to load activities."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const totalEmissions = activities.reduce(
    (sum, item) => sum + Number(item.co2e || 0),
    0
  );

  const categoriesUsed = new Set(
    activities.map((item) => item.category)
  ).size;

  const filteredActivities = useMemo(() => {
    return activities.filter((item) => {
      const matchesSearch =
        item.activity?.toLowerCase().includes(search.toLowerCase()) ||
        item.category?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [activities, search, category]);

  const summaryCards = [
    {
      title: "Total Activities",
      value: activities.length,
      unit: "recorded activities",
      icon: Activity,
      color: "bg-blue-50 text-blue-700",
      border: "border-l-blue-500",
    },
    {
      title: "Total Emissions",
      value: totalEmissions.toFixed(1),
      unit: "kg CO₂e",
      icon: Leaf,
      color: "bg-green-50 text-green-700",
      border: "border-l-green-500",
    },
    {
      title: "Categories Used",
      value: categoriesUsed,
      unit: "activity categories",
      icon: BarChart3,
      color: "bg-amber-50 text-amber-700",
      border: "border-l-amber-500",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F8F4] text-[#183B2D]">

      {/* TOP NAVIGATION */}
      <nav className="sticky top-0 z-20 border-b border-[#E8EEE6] bg-white/90 px-5 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E8F5EA] text-[#26966B]">
              <Leaf size={25} />
            </div>

            <div>
              <h1 className="text-xl font-black tracking-tight">
                EcoTrack
              </h1>
              <p className="text-[9px] font-bold tracking-[2px] text-[#8A998E]">
                CARBON INTELLIGENCE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/dashboard")}
              className="hidden items-center gap-2 rounded-xl border border-[#E5EBE3] px-4 py-2.5 text-sm font-semibold text-[#53665A] transition hover:bg-[#F4F8F2] sm:flex"
            >
              <LayoutDashboard size={17} />
              Dashboard
            </button>

            <button
              onClick={() => navigate("/add-activity")}
              className="flex items-center gap-2 rounded-xl bg-[#245D3F] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#176447]"
            >
              <PlusCircle size={17} />
              <span className="hidden sm:inline">Add Activity</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-7 sm:px-7 sm:py-10">

        {/* PAGE INTRODUCTION */}
        <section className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <button
              onClick={() => navigate("/dashboard")}
              className="mb-4 flex items-center gap-2 text-xs font-bold text-[#39805A] transition hover:gap-3"
            >
              <ArrowLeft size={15} />
              BACK TO DASHBOARD
            </button>

            <div className="flex items-center gap-2 text-[#39805A]">
              <Sparkles size={17} />
              <span className="text-xs font-bold tracking-[2px]">
                YOUR ECO JOURNEY
              </span>
            </div>

            <h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">
              Activity History
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#819087]">
              Explore your recorded activities and understand how your
              everyday choices affect the environment.
            </p>
          </div>

          <button
            onClick={() => fetchActivities(true)}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-xl border border-[#E5EBE3] bg-white px-4 py-3 text-sm font-bold text-[#39805A] shadow-sm transition hover:bg-[#F1F7EF] disabled:opacity-60"
          >
            <RefreshCw
              size={17}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </section>

        {/* SUMMARY CARDS */}
        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {summaryCards.map(({ title, value, unit, icon: Icon, color, border }) => (
            <div
              key={title}
              className={`group rounded-3xl border border-[#E8EEE6] border-l-4 ${border} bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-[#819087]">
                    {title}
                  </p>

                  <h2 className="mt-4 text-3xl font-black tracking-tight">
                    {value}
                  </h2>

                  <p className="mt-1 text-xs text-[#9AA49C]">{unit}</p>
                </div>

                <div className={`rounded-2xl p-4 transition group-hover:scale-110 ${color}`}>
                  <Icon size={25} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* HIGHLIGHT BANNER */}
        <section className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#123B2E] to-[#25865A] p-6 text-white shadow-lg sm:p-8">
          <div className="pointer-events-none absolute -right-10 -top-20 h-60 w-60 rounded-full border-[35px] border-white/[0.06]" />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-wider text-green-200">
                <TrendingUp size={16} />
                YOUR ENVIRONMENTAL IMPACT
              </div>

              <h2 className="text-2xl font-black sm:text-3xl">
                Every activity tells a story.
              </h2>

              <p className="mt-2 max-w-lg text-sm leading-6 text-green-100/75">
                Keep tracking your habits to discover opportunities
                for a more sustainable lifestyle.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 px-6 py-4 backdrop-blur-sm">
              <p className="text-xs font-medium text-green-100/75">
                Total recorded footprint
              </p>
              <p className="mt-2 text-3xl font-black">
                {totalEmissions.toFixed(1)}
                <span className="ml-2 text-sm font-semibold text-green-100">
                  kg CO₂e
                </span>
              </p>
            </div>
          </div>
        </section>

        {/* ACTIVITY TABLE */}
        <section className="overflow-hidden rounded-3xl border border-[#E8EEE6] bg-white shadow-sm">

          <div className="border-b border-[#EEF1EC] p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">
                  All Activities
                </h2>
                <p className="mt-1 text-sm text-[#89958D]">
                  Browse and filter your activity records.
                </p>
              </div>

              <span className="rounded-xl bg-[#EDF5EB] px-3 py-2 text-xs font-bold text-[#39805A]">
                {filteredActivities.length} RECORDS
              </span>
            </div>

            {/* SEARCH AND FILTER */}
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA49C]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search activities or categories..."
                  className="w-full rounded-xl border border-[#E5EBE3] bg-[#FAFCF9] py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#39805A] focus:ring-2 focus:ring-[#39805A]/10"
                />
              </div>

              <div className="relative">
                <Filter
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#819087]"
                />

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-[#E5EBE3] bg-[#FAFCF9] py-3 pl-11 pr-10 text-sm font-medium outline-none focus:border-[#39805A]"
                >
                  <option value="All">All Categories</option>
                  <option value="Transport">Transport</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                </select>

                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#819087]"
                />
              </div>
            </div>
          </div>

          {/* CONTENT */}
          {loading ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center">
              <div className="h-11 w-11 animate-spin rounded-full border-4 border-[#DDEBDD] border-t-[#26966B]" />
              <p className="mt-4 text-sm font-semibold text-[#819087]">
                Loading your activities...
              </p>
            </div>
          ) : error ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
              <p className="font-bold text-red-600">{error}</p>
              <button
                onClick={() => fetchActivities()}
                className="mt-4 rounded-xl bg-[#245D3F] px-5 py-3 text-sm font-bold text-white"
              >
                Try Again
              </button>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center px-5 text-center">
              <div className="rounded-2xl bg-[#EDF5EB] p-5 text-[#39805A]">
                <Leaf size={32} />
              </div>

              <h3 className="mt-4 font-extrabold">
                {activities.length === 0
                  ? "No activities recorded yet"
                  : "No matching activities"}
              </h3>

              <p className="mt-2 max-w-sm text-sm text-[#89958D]">
                {activities.length === 0
                  ? "Start tracking your carbon footprint by adding your first activity."
                  : "Try changing your search or selecting another category."}
              </p>

              {activities.length === 0 && (
                <button
                  onClick={() => navigate("/add-activity")}
                  className="mt-5 flex items-center gap-2 rounded-xl bg-[#245D3F] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#176447]"
                >
                  <PlusCircle size={17} />
                  Add Your First Activity
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left">
                <thead>
                  <tr className="bg-[#F8FAF7] text-xs font-bold uppercase tracking-wider text-[#819087]">
                    <th className="px-6 py-4">Activity</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Quantity</th>
                    <th className="px-6 py-4">CO₂ Emissions</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0F2EE]">
                  {filteredActivities.map((item) => {
                    const style = COLORS[item.category] || {
                      color: "#26966B",
                      background: "#E8F5EA",
                      icon: Leaf,
                    };

                    const Icon = style.icon;

                    return (
                      <tr
                        key={item._id}
                        className="transition hover:bg-[#FAFCF9]"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div
                              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                              style={{
                                color: style.color,
                                backgroundColor: style.background,
                              }}
                            >
                              <Icon size={19} />
                            </div>

                            <span className="max-w-[220px] truncate text-sm font-bold text-[#294536]">
                              {item.activity}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-5">
                          <span
                            className="rounded-full px-3 py-1.5 text-xs font-bold"
                            style={{
                              color: style.color,
                              backgroundColor: style.background,
                            }}
                          >
                            {item.category}
                          </span>
                        </td>

                        <td className="px-6 py-5 text-sm font-medium text-[#718078]">
                          {item.quantity}
                        </td>

                        <td className="px-6 py-5">
                          <span className="text-sm font-black text-[#27865B]">
                            {Number(item.co2e || 0).toFixed(2)} kg
                          </span>
                        </td>

                        <td className="px-6 py-5">
                          <span className="flex items-center gap-2 text-sm text-[#819087]">
                            <CalendarDays size={15} />
                            {item.date
                              ? new Date(item.date).toLocaleDateString()
                              : "N/A"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* FOOTER */}
        <footer className="py-9 text-center text-xs text-[#9AA49C]">
          <Leaf size={16} className="mx-auto mb-2 text-[#39805A]" />
          © 2026 EcoTrack · Building a more sustainable future
        </footer>
      </main>
    </div>
  );
}

export default Activities;

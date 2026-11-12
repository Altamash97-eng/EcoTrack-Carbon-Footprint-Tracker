
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Leaf,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart as PieIcon,
  CalendarDays,
  RefreshCw,
  Car,
  Zap,
  Utensils,
  ShoppingBag,
  Sprout,
  AlertCircle,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const COLORS = ["#16a34a", "#84cc16", "#f59e0b", "#0d9488"];

const categoryIcons = {
  Transport: Car,
  Electricity: Zap,
  Food: Utensils,
  Shopping: ShoppingBag,
};

function Analytics() {
  const navigate = useNavigate();

  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEntries = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await API.get("/carbon");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.entries || [];

      setEntries(data);
    } catch (err) {
      console.error("Analytics error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(
        err.response?.data?.message ||
        "Unable to load analytics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const total = entries.reduce(
    (sum, item) => sum + Number(item.co2e || 0),
    0
  );

  const categoryTotals = Object.values(
    entries.reduce((result, item) => {
      const category = item.category;

      if (!result[category]) {
        result[category] = {
          name: category,
          emissions: 0,
        };
      }

      result[category].emissions += Number(item.co2e || 0);
      return result;
    }, {})
  );

  const monthlyTotals = Object.values(
    entries.reduce((result, item) => {
      const date = new Date(item.date);

      if (Number.isNaN(date.getTime())) return result;

      const key = `${date.getFullYear()}-${date.getMonth()}`;

      const month = date.toLocaleString("en-IN", {
        month: "short",
        year: "numeric",
      });

      if (!result[key]) {
        result[key] = {
          month,
          emissions: 0,
          sortDate: new Date(
            date.getFullYear(),
            date.getMonth()
          ).getTime(),
        };
      }

      result[key].emissions += Number(item.co2e || 0);

      return result;
    }, {})
  ).sort((a, b) => a.sortDate - b.sortDate);

  const average = entries.length ? total / entries.length : 0;

  const highestCategory = categoryTotals.length
    ? [...categoryTotals].sort(
        (a, b) => b.emissions - a.emissions
      )[0]
    : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f8f4] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={35}
            className="animate-spin text-green-700 mx-auto mb-4"
          />
          <p className="text-gray-600 font-medium">
            Preparing your carbon analytics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8f4] px-4 py-6 sm:px-8 sm:py-9">

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">

        <div className="flex flex-wrap items-center justify-between gap-4 mb-7">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-700 transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <button
            onClick={fetchEntries}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:border-green-300 hover:text-green-700 transition"
          >
            <RefreshCw size={16} />
            Refresh Data
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-green-700 text-white p-3 rounded-2xl shadow-lg shadow-green-900/10">
            <BarChart3 size={27} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#183b2d]">
              Carbon Analytics
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Understand your environmental impact through data.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto">

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
            <AlertCircle size={19} />
            {error}
          </div>
        )}

        {/* Summary cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">

          <div className="bg-[#173d2e] text-white rounded-2xl p-6 shadow-lg shadow-green-950/10">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-100">
                Total CO₂ Emissions
              </span>
              <Leaf className="text-green-300" size={23} />
            </div>

            <h2 className="text-3xl font-bold mt-5">
              {total.toFixed(2)}
              <span className="text-base font-medium text-green-200 ml-2">
                kg
              </span>
            </h2>

            <p className="text-xs text-green-200 mt-2">
              Total recorded emissions
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Total Activities
              </span>
              <Activity className="text-green-600" size={23} />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-5">
              {entries.length}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              Activities tracked so far
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Categories Used
              </span>
              <PieIcon className="text-amber-500" size={23} />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-5">
              {categoryTotals.length}
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              Different activity categories
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Average Emissions
              </span>
              <TrendingUp className="text-teal-600" size={23} />
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mt-5">
              {average.toFixed(2)}
              <span className="text-sm font-medium text-gray-400 ml-2">
                kg
              </span>
            </h2>

            <p className="text-xs text-gray-400 mt-2">
              Average per recorded activity
            </p>
          </div>

        </section>

        {/* Insight banner */}
        <section className="bg-gradient-to-r from-green-700 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white mb-8 relative overflow-hidden">
          <div className="absolute -right-10 -top-16 w-52 h-52 rounded-full bg-white/10" />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="bg-white/15 p-3 rounded-xl">
                <Sprout size={27} />
              </div>

              <div>
                <p className="text-green-100 text-sm font-medium">
                  Your environmental insight
                </p>

                <h2 className="text-xl sm:text-2xl font-bold mt-1">
                  {highestCategory
                    ? `${highestCategory.name} is your largest emission category`
                    : "Start tracking your carbon footprint"}
                </h2>

                <p className="text-sm text-green-100 mt-2">
                  {highestCategory
                    ? `${highestCategory.emissions.toFixed(2)} kg CO₂e recorded in this category. Explore ways to reduce its impact.`
                    : "Add your first activity to discover your environmental impact."}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/add-activity")}
              className="shrink-0 bg-white text-green-800 px-5 py-3 rounded-xl text-sm font-bold hover:bg-green-50 transition"
            >
              Add Activity
            </button>
          </div>
        </section>

        {/* Charts */}
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">

          {/* Monthly chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-7">
              <div className="bg-green-50 text-green-700 p-2.5 rounded-xl">
                <CalendarDays size={21} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  Monthly Emissions
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Your recorded monthly CO₂ emissions
                </p>
              </div>
            </div>

            <div className="h-72">
              {monthlyTotals.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyTotals}
                    margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#e5e7eb"
                    />

                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#6b7280", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <YAxis
                      tick={{ fill: "#9ca3af", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "1px solid #e5e7eb",
                      }}
                      formatter={(value) => [
                        `${Number(value).toFixed(2)} kg`,
                        "Emissions",
                      ]}
                    />

                    <Bar
                      dataKey="emissions"
                      fill="#16a34a"
                      radius={[7, 7, 0, 0]}
                      maxBarSize={55}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-gray-400 text-sm">
                  No monthly activity data available.
                </div>
              )}
            </div>
          </div>

          {/* Category chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-7">
              <div className="bg-amber-50 text-amber-600 p-2.5 rounded-xl">
                <PieIcon size={21} />
              </div>

              <div>
                <h2 className="font-bold text-gray-900 text-lg">
                  Category Breakdown
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Emission contribution by category
                </p>
              </div>
            </div>

            <div className="h-72">
              {categoryTotals.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryTotals}
                      dataKey="emissions"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={100}
                      paddingAngle={3}
                    >
                      {categoryTotals.map((item, index) => (
                        <Cell
                          key={item.name}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      formatter={(value) => [
                        `${Number(value).toFixed(2)} kg`,
                        "Emissions",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-center text-gray-400 text-sm">
                  No category data available.
                </div>
              )}
            </div>

            {/* Category legend */}
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3 mt-2">
              {categoryTotals.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2 text-xs text-gray-600">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  />
                  {item.name}
                </div>
              ))}
            </div>
          </div>

        </section>

        {/* Activity history */}
        <section className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-7 shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="font-bold text-gray-900 text-lg">
                Activity History
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Your recorded carbon footprint activities
              </p>
            </div>

            <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold">
              {entries.length} Records
            </span>
          </div>

          {entries.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                    <th className="py-4 px-4 rounded-l-xl">Activity</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Quantity</th>
                    <th className="py-4 px-4">CO₂ Emissions</th>
                    <th className="py-4 px-4 rounded-r-xl">Date</th>
                  </tr>
                </thead>

                <tbody>
                  {entries.map((item) => {
                    const Icon = categoryIcons[item.category] || Leaf;

                    return (
                      <tr
                        key={item._id}
                        className="border-b border-gray-100 last:border-0 hover:bg-green-50/40 transition"
                      >
                        <td className="py-4 px-4 font-semibold text-gray-800 whitespace-nowrap">
                          {item.activity}
                        </td>

                        <td className="py-4 px-4">
                          <span className="inline-flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600">
                            <Icon size={14} className="text-green-700" />
                            {item.category}
                          </span>
                        </td>

                        <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                          {item.quantity}
                        </td>

                        <td className="py-4 px-4 font-bold text-green-700 whitespace-nowrap">
                          {Number(item.co2e || 0).toFixed(2)} kg
                        </td>

                        <td className="py-4 px-4 text-gray-500 whitespace-nowrap">
                          {item.date
                            ? new Date(item.date).toLocaleDateString("en-IN")
                            : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-green-50 text-green-700 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Activity size={27} />
              </div>

              <h3 className="font-bold text-gray-800">
                No activities recorded yet
              </h3>

              <p className="text-sm text-gray-400 mt-2 mb-5">
                Add your first activity to see your analytics here.
              </p>

              <button
                onClick={() => navigate("/add-activity")}
                className="bg-green-700 text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-green-800 transition"
              >
                Add Your First Activity
              </button>
            </div>
          )}

        </section>

        <p className="text-xs text-gray-400 text-center mt-8">
          EcoTrack · Carbon Footprint Analytics
        </p>

      </main>
    </div>
  );
}

export default Analytics;

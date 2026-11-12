
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  Users,
  Activity,
  Leaf,
  RefreshCw,
  LogOut,
  ArrowLeft,
  ShieldCheck,
  TrendingUp,
  CalendarDays,
  Database,
  AlertCircle,
  UserRound,
} from "lucide-react";

function Admin() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalActivities: 0,
    totalCO2: 0,
  });

  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchAdminData = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [statsResponse, usersResponse, activitiesResponse] =
        await Promise.all([
          API.get("/admin/stats"),
          API.get("/admin/users"),
          API.get("/admin/activities"),
        ]);

      setStats(statsResponse.data);
      setUsers(usersResponse.data);
      setActivities(activitiesResponse.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load admin data. Please check your admin login."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f4f8f4]">
        <div className="bg-green-100 p-5 rounded-2xl mb-4">
          <Leaf size={38} className="text-green-700 animate-pulse" />
        </div>
        <p className="text-gray-700 font-semibold">
          Loading EcoTrack Admin Panel...
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Fetching dashboard information
        </p>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      description: "Registered accounts",
      icon: Users,
      color: "blue",
    },
    {
      title: "Total Activities",
      value: stats.totalActivities,
      description: "Carbon records",
      icon: Activity,
      color: "orange",
    },
    {
      title: "Total CO₂ Emissions",
      value: `${Number(stats.totalCO2).toFixed(2)} kg`,
      description: "Combined recorded emissions",
      icon: Leaf,
      color: "green",
    },
  ];

  const colorStyles = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-700",
  };

  return (
    <div className="min-h-screen bg-[#f4f8f4] text-[#183b2d]">

      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-7 md:py-9">

        {/* Header */}
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-9">

          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="bg-green-700 p-2 rounded-xl text-white">
                <Leaf size={22} />
              </div>

              <span className="text-xl font-extrabold tracking-tight">
                EcoTrack
              </span>

              <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-purple-700">
                ADMIN
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Admin Dashboard
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Monitor platform activity, manage visibility, and track
              environmental impact.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              <ArrowLeft size={17} />
              Dashboard
            </button>

            <button
              onClick={() => fetchAdminData(true)}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white hover:bg-green-800 disabled:opacity-60 transition"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-100 transition"
            >
              <LogOut size={17} />
              Logout
            </button>
          </div>
        </header>

        {/* Welcome Banner */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#173d2e] to-[#258052] p-6 sm:p-8 text-white mb-8">
          <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border-[35px] border-white/5" />

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <div className="flex items-center gap-2 text-green-200 mb-3">
                <ShieldCheck size={20} />
                <span className="text-sm font-semibold">
                  Administrator Access
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold">
                Welcome to EcoTrack Control Center
              </h2>

              <p className="mt-2 text-sm text-green-50/80 max-w-2xl">
                Monitor registered users, carbon activities, and the
                overall environmental footprint recorded on your platform.
              </p>
            </div>

            <div className="hidden sm:flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10">
              <ShieldCheck size={42} className="text-green-200" />
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700 mb-7">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Unable to load admin information</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <section className="mb-9">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Platform Overview
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Key statistics from your EcoTrack platform.
              </p>
            </div>

            <Database size={21} className="text-green-700" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {statCards.map((card) => {
              const Icon = card.icon;

              return (
                <div
                  key={card.title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        {card.title}
                      </p>

                      <h3 className="mt-3 text-3xl font-extrabold text-gray-900">
                        {card.value}
                      </h3>
                    </div>

                    <div className={`rounded-2xl p-4 ${colorStyles[card.color]}`}>
                      <Icon size={27} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-5 text-xs text-gray-400">
                    <TrendingUp size={15} className="text-green-600" />
                    {card.description}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Registered Users */}
        <section className="rounded-3xl border border-gray-100 bg-white shadow-sm mb-8 overflow-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Users size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Registered Users
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Accounts registered on EcoTrack
                </p>
              </div>
            </div>

            <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
              {users.length} Users
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Joined Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-green-50/40 transition"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center text-green-700">
                          <UserRound size={19} />
                        </div>

                        <span className="font-semibold text-gray-800">
                          {user.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {user.email}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={15} />
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString()
                          : "Not available"}
                      </div>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      No registered users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* All Activities */}
        <section className="rounded-3xl border border-gray-100 bg-white shadow-sm overflow-hidden">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-green-50 p-3 text-green-700">
                <Activity size={22} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  All Carbon Activities
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Carbon activity records from all users
                </p>
              </div>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
              {activities.length} Records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
                <tr>
                  <th className="px-6 py-4">User</th>
                  <th className="px-6 py-4">Activity</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">CO₂ Emissions</th>
                  <th className="px-6 py-4">Date</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {activities.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-green-50/40 transition"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-800">
                      {item.user?.name || "Unknown"}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-700">
                      {item.activity}
                    </td>

                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-800">
                        {item.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 font-bold text-green-700">
                      {Number(item.co2e || 0).toFixed(2)} kg
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.date
                        ? new Date(item.date).toLocaleDateString()
                        : "Not available"}
                    </td>
                  </tr>
                ))}

                {activities.length === 0 && (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-12 text-center text-gray-400"
                    >
                      No carbon activities found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-9 text-center">
          <Leaf size={19} className="mx-auto mb-2 text-green-700" />
          <p className="text-xs text-gray-400">
            EcoTrack Admin Panel · Carbon Footprint Monitoring System
          </p>
        </footer>

      </main>
    </div>
  );
}

export default Admin;

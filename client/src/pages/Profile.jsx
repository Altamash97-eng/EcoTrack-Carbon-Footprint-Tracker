
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import {
  User,
  Mail,
  ShieldCheck,
  Leaf,
  ArrowLeft,
  LogOut,
  Sprout,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  LockKeyhole,
  LayoutDashboard,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showLogout, setShowLogout] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await API.get("/auth/profile");
        setUser(response.data.user);
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login", { replace: true });
          return;
        }

        setError(
          err.response?.data?.message || "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f8f4] flex items-center justify-center">
        <div className="text-center">
          <RefreshCw
            size={34}
            className="animate-spin text-green-700 mx-auto mb-4"
          />
          <p className="text-gray-500 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8f4] px-4 py-7 sm:px-8 sm:py-10">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-700 transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:border-green-300 hover:text-green-700 transition"
          >
            <LayoutDashboard size={17} />
            Dashboard
          </button>

        </div>

        {/* Page title */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-green-700 text-white p-3 rounded-2xl shadow-lg shadow-green-900/10">
            <Leaf size={26} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#183b2d]">
              My Profile
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and view your EcoTrack account information.
            </p>
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div className="bg-red-50 border border-red-100 text-red-700 p-5 rounded-2xl flex items-center gap-3">
            <AlertCircle size={21} />
            <div>
              <p className="font-semibold">Profile unavailable</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        ) : user ? (

          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.4fr] gap-6">

            {/* Profile identity card */}
            <div className="bg-[#173d2e] text-white rounded-3xl p-7 sm:p-9 shadow-xl shadow-green-950/10 relative overflow-hidden">

              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-green-400/10" />
              <div className="absolute -left-12 -bottom-16 w-44 h-44 rounded-full bg-green-400/10" />

              <div className="relative flex flex-col items-center text-center">

                <div className="w-28 h-28 rounded-full bg-white/10 border border-white/20 flex items-center justify-center mb-5">
                  <User size={52} className="text-green-200" />
                </div>

                <h2 className="text-2xl font-bold break-words">
                  {user.name}
                </h2>

                <p className="text-sm text-green-200 mt-2 break-all">
                  {user.email}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 bg-green-400/15 text-green-200 border border-green-300/20 px-4 py-2 rounded-full text-xs font-bold capitalize">
                  <ShieldCheck size={15} />
                  {user.role || "User"} Account
                </span>

                <div className="w-full h-px bg-white/15 my-8" />

                <div className="w-full flex items-center gap-3 bg-white/10 rounded-2xl p-4 text-left">
                  <div className="bg-green-300/15 p-3 rounded-xl">
                    <Sprout size={22} className="text-green-200" />
                  </div>

                  <div>
                    <p className="font-semibold text-sm">
                      Welcome to EcoTrack
                    </p>
                    <p className="text-xs text-green-200 mt-1">
                      Track your impact. Go greener.
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Account details */}
            <div className="space-y-6">

              <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">

                <div className="mb-7">
                  <h3 className="text-xl font-bold text-gray-900">
                    Account Information
                  </h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Your registered account details.
                  </p>
                </div>

                <div className="space-y-4">

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="bg-green-100 text-green-700 p-3 rounded-xl">
                      <User size={22} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">
                        Full Name
                      </p>
                      <p className="font-semibold text-gray-800 mt-1 break-words">
                        {user.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="bg-blue-100 text-blue-700 p-3 rounded-xl">
                      <Mail size={22} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-400 font-medium">
                        Email Address
                      </p>
                      <p className="font-semibold text-gray-800 mt-1 break-all">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                    <div className="bg-purple-100 text-purple-700 p-3 rounded-xl">
                      <ShieldCheck size={22} />
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 font-medium">
                        Account Role
                      </p>
                      <p className="font-semibold text-gray-800 mt-1 capitalize">
                        {user.role || "User"}
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Security information */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">

                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-green-50 text-green-700 p-3 rounded-xl">
                    <LockKeyhole size={21} />
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900">
                      Account Security
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                      Your account uses secure authentication.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-green-700 font-medium mt-4">
                  <CheckCircle2 size={17} />
                  Authentication session active
                </div>

              </div>

              {/* Logout */}
              <button
                onClick={() => setShowLogout(true)}
                className="w-full flex items-center justify-center gap-2 bg-red-50 border border-red-100 text-red-600 py-4 rounded-2xl font-bold hover:bg-red-100 transition"
              >
                <LogOut size={19} />
                Logout from EcoTrack
              </button>

            </div>
          </div>

        ) : null}

        <p className="text-xs text-gray-400 text-center mt-10">
          EcoTrack · Your personal sustainability account
        </p>

      </div>

      {/* Logout confirmation */}
      {showLogout && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-7 max-w-sm w-full shadow-2xl">

            <div className="bg-red-50 text-red-600 w-14 h-14 rounded-2xl flex items-center justify-center mb-5">
              <LogOut size={25} />
            </div>

            <h3 className="text-xl font-bold text-gray-900">
              Confirm Logout
            </h3>

            <p className="text-sm text-gray-500 mt-2 leading-relaxed">
              Are you sure you want to log out of your EcoTrack account?
            </p>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 border border-gray-200 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Profile;

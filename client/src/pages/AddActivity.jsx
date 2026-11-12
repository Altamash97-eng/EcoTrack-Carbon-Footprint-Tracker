
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Calculator,
  ArrowLeft,
  Car,
  Zap,
  Utensils,
  ShoppingBag,
  CheckCircle2,
  Loader2,
  Sprout,
  Info,
} from "lucide-react";
import API from "../services/api";

const activityOptions = [
  { name: "Petrol consumption", category: "Transport", unit: "litres", factor: 2.31 },
  { name: "Diesel consumption", category: "Transport", unit: "litres", factor: 2.68 },
  { name: "Car travel", category: "Transport", unit: "km", factor: 0.17 },
  { name: "Bus travel", category: "Transport", unit: "km", factor: 0.10 },
  { name: "Electricity usage", category: "Electricity", unit: "kWh", factor: 0.716 },
  { name: "Food consumption", category: "Food", unit: "kg", factor: 2.5 },
  { name: "Shopping purchases", category: "Shopping", unit: "kg", factor: 6 },
];

const categoryDetails = {
  Transport: {
    icon: Car,
    color: "bg-blue-50 text-blue-700 border-blue-100",
    description: "Track your fuel consumption and daily travel.",
  },
  Electricity: {
    icon: Zap,
    color: "bg-amber-50 text-amber-700 border-amber-100",
    description: "Measure the carbon impact of your electricity use.",
  },
  Food: {
    icon: Utensils,
    color: "bg-orange-50 text-orange-700 border-orange-100",
    description: "Estimate emissions associated with food consumption.",
  },
  Shopping: {
    icon: ShoppingBag,
    color: "bg-purple-50 text-purple-700 border-purple-100",
    description: "Track the footprint of your purchases.",
  },
};

function AddActivity() {
  const navigate = useNavigate();

  const [selectedActivity, setSelectedActivity] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const selected = activityOptions[selectedActivity];
  const category = categoryDetails[selected.category];
  const CategoryIcon = category.icon;

  const estimatedCO2 =
    quantity && Number(quantity) > 0 && Number.isFinite(Number(quantity))
      ? Number(quantity) * selected.factor
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!quantity || !Number.isFinite(Number(quantity)) || Number(quantity) <= 0) {
      setError("Please enter a valid quantity greater than zero.");
      return;
    }

    setLoading(true);

    try {
      await API.post("/carbon", {
        category: selected.category,
        activity: selected.name,
        quantity: Number(quantity),
        co2e: Number(estimatedCO2.toFixed(2)),
      });

      setSuccess(true);

      setTimeout(() => {
        navigate("/dashboard");
      }, 900);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setError(err.response?.data?.message || "Failed to add activity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f8f4] px-4 py-6 sm:px-8 sm:py-10">

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-green-700 transition mb-7"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-green-700 text-white p-3 rounded-2xl shadow-lg shadow-green-900/10">
            <Leaf size={27} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#183b2d]">
              Add Carbon Activity
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Every small action counts towards a greener future.
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-7 items-start">

        {/* Form card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-9">

          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest text-green-700 uppercase mb-2">
              Activity details
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              What would you like to track?
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Select an activity and enter the quantity to calculate its estimated emissions.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">

            {/* Activity selection */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Select Activity
              </label>

              <select
                value={selectedActivity}
                onChange={(e) => {
                  setSelectedActivity(Number(e.target.value));
                  setError("");
                }}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3.5 text-gray-800 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
              >
                {activityOptions.map((item, index) => (
                  <option key={item.name} value={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category information */}
            <div className={`rounded-2xl border p-5 ${category.color}`}>
              <div className="flex items-center gap-3">
                <div className="bg-white/80 p-3 rounded-xl">
                  <CategoryIcon size={23} />
                </div>

                <div>
                  <p className="text-xs font-semibold opacity-70 uppercase tracking-wider">
                    Activity category
                  </p>
                  <h3 className="font-bold text-lg">{selected.category}</h3>
                </div>
              </div>

              <p className="text-sm mt-3 opacity-80">
                {category.description}
              </p>

              <div className="mt-4 pt-4 border-t border-current/10 flex justify-between text-sm">
                <span className="opacity-70">Measurement unit</span>
                <strong>{selected.unit}</strong>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                Enter Quantity
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0.01"
                  step="any"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value);
                    setError("");
                    setSuccess(false);
                  }}
                  placeholder={`Enter quantity in ${selected.unit}`}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 pr-20 text-gray-800 outline-none focus:border-green-600 focus:ring-4 focus:ring-green-100 transition"
                  required
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500">
                  {selected.unit}
                </span>
              </div>
            </div>

            {/* Error and success */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 rounded-xl p-4 text-sm">
                <Info size={18} className="shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-700 rounded-xl p-4 text-sm font-medium">
                <CheckCircle2 size={19} />
                Activity added successfully! Redirecting to dashboard...
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white py-4 rounded-xl font-bold shadow-lg shadow-green-900/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={19} className="animate-spin" />
                  Saving Activity...
                </>
              ) : (
                <>
                  <CheckCircle2 size={19} />
                  Save Activity
                </>
              )}
            </button>

          </form>
        </div>

        {/* Emission preview panel */}
        <div className="space-y-6">

          <div className="bg-[#173d2e] text-white rounded-3xl p-7 sm:p-8 shadow-xl shadow-green-950/10 overflow-hidden relative">
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-green-400/10" />
            <div className="absolute -right-5 -bottom-16 w-40 h-40 rounded-full bg-green-400/10" />

            <div className="relative">
              <div className="flex items-center gap-2 text-green-300 mb-6">
                <Calculator size={21} />
                <span className="text-sm font-semibold">Live emission calculator</span>
              </div>

              <p className="text-green-100/70 text-sm mb-2">
                Your estimated carbon footprint
              </p>

              <div className="flex items-baseline gap-2">
                <h2 className="text-5xl sm:text-6xl font-bold tracking-tight">
                  {estimatedCO2.toFixed(2)}
                </h2>
                <span className="text-green-200 font-semibold">kg CO₂e</span>
              </div>

              <div className="h-px bg-white/15 my-7" />

              <div className="space-y-4 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-green-100/70">Selected activity</span>
                  <strong className="text-right">{selected.name}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-green-100/70">Quantity</span>
                  <strong>{quantity || "0"} {selected.unit}</strong>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-green-100/70">Emission factor</span>
                  <strong>{selected.factor} kg CO₂e</strong>
                </div>
              </div>

              <div className="mt-7 bg-white/10 rounded-xl p-4">
                <p className="text-xs text-green-100/80 leading-relaxed">
                  Estimated emissions = Quantity × Emission factor
                </p>
              </div>
            </div>
          </div>

          {/* Eco tip */}
          <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-green-100 text-green-700 p-3 rounded-xl">
                <Sprout size={23} />
              </div>
              <h3 className="font-bold text-gray-900">Make a greener choice</h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed">
              Small lifestyle changes can make a meaningful difference. Try public transport, save electricity, reduce food waste, and choose sustainable products.
            </p>
          </div>

          {/* Note */}
          <div className="flex gap-3 px-2 text-xs text-gray-500 leading-relaxed">
            <Info size={17} className="shrink-0 text-green-700" />
            <p>
              Emission factors are illustrative estimates for this academic project. Actual emissions may vary depending on location and usage.
            </p>
          </div>

        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-10">
        EcoTrack · Track your impact. Build a greener tomorrow.
      </p>
    </div>
  );
}

export default AddActivity;

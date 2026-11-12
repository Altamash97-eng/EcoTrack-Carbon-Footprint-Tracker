
import { useState } from "react";
import API from "../services/api";
import ReactMarkdown from "react-markdown";
import {
  Sparkles,
  MessageCircle,
  Brain,
  Lightbulb,
  Trophy,
  Send,
  Loader2,
  Leaf,
  Bot,
  User,
  Zap,
  Target,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  AlertCircle,
} from "lucide-react";

const features = [
  { id: "chat", label: "AI Chat", icon: MessageCircle },
  { id: "analyze", label: "AI Analysis", icon: Brain },
  { id: "recommendations", label: "Recommendations", icon: Lightbulb },
  { id: "challenge", label: "Eco Challenge", icon: Trophy },
];

function AIHub() {
  const [activeTab, setActiveTab] = useState("chat");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const setFeatureLoading = (key, value) => {
    setLoading((previous) => ({ ...previous, [key]: value }));
  };

  const setFeatureError = (key, value) => {
    setErrors((previous) => ({ ...previous, [key]: value }));
  };

  const sendMessage = async (event) => {
    event.preventDefault();

    const question = message.trim();
    if (!question || loading.chat) return;

    setMessages((previous) => [
      ...previous,
      { role: "user", text: question },
    ]);

    setMessage("");
    setFeatureLoading("chat", true);
    setFeatureError("chat", "");

    try {
      const response = await API.post("/ai/chat", {
        message: question,
      });

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: response.data.reply || "I couldn't generate a response.",
        },
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      setFeatureError(
        "chat",
        error.response?.data?.message ||
          "Unable to contact AI. Please try again."
      );
    } finally {
      setFeatureLoading("chat", false);
    }
  };

  const runFeature = async (feature) => {
    if (loading[feature]) return;

    setFeatureLoading(feature, true);
    setFeatureError(feature, "");
    setResults((previous) => ({ ...previous, [feature]: null }));

    try {
      const response = await API.get(`/ai/${feature}`);

      setResults((previous) => ({
        ...previous,
        [feature]: response.data,
      }));
    } catch (error) {
      console.error(`${feature} error:`, error);

      setFeatureError(
        feature,
        error.response?.data?.message ||
          "Unable to generate this result. Please try again."
      );
    } finally {
      setFeatureLoading(feature, false);
    }
  };

  const renderResult = (value) => {
    if (value === null || value === undefined) return null;

    if (typeof value === "string") {
      return (
        <div className="prose prose-sm max-w-none text-gray-700">
          <ReactMarkdown>{value}</ReactMarkdown>
        </div>
      );
    }

    if (typeof value === "number" || typeof value === "boolean") {
      return <p>{String(value)}</p>;
    }

    if (Array.isArray(value)) {
      return (
        <ul className="space-y-3">
          {value.map((item, index) => (
            <li
              key={index}
              className="rounded-xl bg-green-50 p-4"
            >
              {typeof item === "string"
                ? <ReactMarkdown>{item}</ReactMarkdown>
                : renderResult(item)}
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="space-y-4">
        {Object.entries(value).map(([key, item]) => {
          if (key === "success") return null;

          const title = key
            .replace(/([A-Z])/g, " $1")
            .replace(/_/g, " ")
            .replace(/^./, (letter) => letter.toUpperCase());

          return (
            <div key={key}>
              <h4 className="mb-2 text-sm font-bold text-green-800">
                {title}
              </h4>
              <div className="text-sm leading-6 text-gray-700">
                {renderResult(item)}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderFeaturePanel = (
    feature,
    title,
    description,
    icon,
    buttonText
  ) => {
    const Icon = icon;
    const result = results[feature];

    return (
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8">

        <div className="flex items-start gap-4 mb-7">
          <div className="bg-green-50 text-green-700 p-4 rounded-2xl">
            <Icon size={27} />
          </div>

          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900">
              {title}
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              {description}
            </p>
          </div>
        </div>

        <button
          onClick={() => runFeature(feature)}
          disabled={loading[feature]}
          className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-6 py-3.5 text-sm font-bold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading[feature] ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              {result ? "Generate Again" : buttonText}
            </>
          )}
        </button>

        {errors[feature] && (
          <div className="mt-5 flex gap-2 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700">
            <AlertCircle size={18} className="shrink-0" />
            {errors[feature]}
          </div>
        )}

        {result && (
          <div className="mt-7 rounded-2xl border border-green-100 bg-[#FAFCF9] p-5 sm:p-7">
            <div className="flex items-center gap-2 border-b border-green-100 pb-4 mb-5">
              <CheckCircle2 className="text-green-700" size={20} />
              <h4 className="font-bold text-green-800">
                AI Generated Result
              </h4>
            </div>

            {renderResult(result)}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f4f8f4] px-4 py-6 sm:px-8 sm:py-9 text-[#183b2d]">

      <main className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-xs font-bold text-green-800 mb-4">
            <Sparkles size={15} />
            POWERED BY GEMINI AI
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            EcoTrack AI Hub
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
            Your personal sustainability assistant. Understand your
            carbon footprint, receive intelligent recommendations,
            and take meaningful action.
          </p>
        </header>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#173d2e] via-[#216443] to-[#16845a] p-6 sm:p-9 text-white mb-8 shadow-xl shadow-green-950/10">

          <div className="absolute -right-12 -top-16 h-64 w-64 rounded-full border-[35px] border-white/5" />
          <div className="absolute -right-5 -bottom-20 h-48 w-48 rounded-full bg-green-300/10" />

          <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-7">

            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-green-200 mb-4">
                <Bot size={22} />
                <span className="text-sm font-semibold">
                  Your AI Sustainability Assistant
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                Make smarter choices for a greener planet.
              </h2>

              <p className="mt-3 text-sm leading-6 text-green-50/80">
                Ask questions, analyze your activities, and discover
                practical ways to reduce your environmental impact.
              </p>

              <button
                onClick={() => setActiveTab("chat")}
                className="mt-6 inline-flex items-center gap-2 bg-white text-green-800 px-5 py-3 rounded-xl text-sm font-bold hover:bg-green-50 transition"
              >
                Chat with AI
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="flex h-24 w-24 sm:h-32 sm:w-32 shrink-0 items-center justify-center rounded-3xl border border-white/20 bg-white/10">
              <Sparkles size={55} className="text-green-200" />
            </div>

          </div>
        </section>

        {/* Feature navigation */}
        <section className="mb-7">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">
                AI Tools
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Choose what you want the AI to help you with.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {features.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                  activeTab === id
                    ? "border-green-300 bg-green-50 text-green-800 shadow-sm"
                    : "border-gray-100 bg-white text-gray-600 hover:border-green-200 hover:bg-green-50/50"
                }`}
              >
                <div className={`p-2.5 rounded-xl ${
                  activeTab === id
                    ? "bg-green-100"
                    : "bg-gray-50"
                }`}>
                  <Icon size={21} />
                </div>

                <span className="text-xs sm:text-sm font-bold">
                  {label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* AI Chat */}
        {activeTab === "chat" && (
          <section className="bg-white overflow-hidden rounded-3xl border border-gray-100 shadow-sm">

            <div className="flex items-center gap-3 border-b border-gray-100 p-5 sm:p-6">
              <div className="bg-green-100 text-green-700 p-3 rounded-xl">
                <Bot size={23} />
              </div>

              <div>
                <h3 className="font-bold text-gray-900">
                  EcoTrack AI Assistant
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Ask anything about sustainable living
                </p>
              </div>

              <span className="ml-auto rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-bold text-green-700">
                GEMINI AI
              </span>
            </div>

            <div className="flex min-h-[360px] max-h-[500px] flex-col gap-4 overflow-y-auto bg-[#FAFCF9] p-5 sm:p-7">

              {messages.length === 0 && (
                <div className="m-auto max-w-md text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-100 text-green-700">
                    <Sparkles size={35} />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900">
                    How can I help you today?
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    Ask me how to reduce your carbon footprint,
                    save energy, travel sustainably, or make greener
                    food choices.
                  </p>

                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {[
                      "How can I reduce my daily emissions?",
                      "Give me eco-friendly travel tips",
                      "How can I save electricity?",
                    ].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setMessage(suggestion)}
                        className="rounded-full border border-green-200 bg-white px-3 py-2 text-xs font-medium text-green-800 hover:bg-green-50 transition"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((item, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    item.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {item.role === "assistant" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                      <Bot size={19} />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-4 text-sm leading-6 ${
                      item.role === "user"
                        ? "bg-green-700 text-white"
                        : "border border-gray-100 bg-white text-gray-700"
                    }`}
                  >
                    {item.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none">
                        <ReactMarkdown>{item.text}</ReactMarkdown>
                      </div>
                    ) : (
                      item.text
                    )}
                  </div>

                  {item.role === "user" && (
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-800">
                      <User size={19} />
                    </div>
                  )}
                </div>
              ))}

              {loading.chat && (
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Loader2 size={18} className="animate-spin text-green-700" />
                  EcoTrack AI is thinking...
                </div>
              )}

            </div>

            {errors.chat && (
              <div className="mx-5 mt-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                <AlertCircle size={17} />
                {errors.chat}
              </div>
            )}

            <form
              onSubmit={sendMessage}
              className="flex gap-2 border-t border-gray-100 bg-white p-4 sm:p-5"
            >
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Ask EcoTrack AI something..."
                maxLength={2000}
                className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 transition"
              />

              <button
                type="submit"
                disabled={!message.trim() || loading.chat}
                className="flex items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-bold text-white hover:bg-green-800 disabled:opacity-50 transition"
              >
                <Send size={17} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

          </section>
        )}

        {/* AI Analysis */}
        {activeTab === "analyze" &&
          renderFeaturePanel(
            "analyze",
            "Carbon Footprint Analysis",
            "Let AI analyze your recorded carbon activities and identify your major emission sources.",
            Brain,
            "Analyze My Footprint"
          )}

        {/* Recommendations */}
        {activeTab === "recommendations" &&
          renderFeaturePanel(
            "recommendations",
            "Personalized Green Recommendations",
            "Get practical suggestions based on your own activity records and highest-emission categories.",
            Lightbulb,
            "Generate Recommendations"
          )}

        {/* Challenge */}
        {activeTab === "challenge" &&
          renderFeaturePanel(
            "challenge",
            "Your 7-Day Eco Challenge",
            "Get a personalized sustainability challenge based on your recorded footprint.",
            Trophy,
            "Generate My Challenge"
          )}

        {/* Bottom feature cards */}
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Brain,
              title: "Smart Analysis",
              text: "Understand your recorded emissions.",
            },
            {
              icon: Target,
              title: "Personalized Actions",
              text: "Find practical ways to improve.",
            },
            {
              icon: Zap,
              title: "Daily Progress",
              text: "Build sustainable habits over time.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="bg-white border border-gray-100 rounded-2xl flex items-center gap-4 p-5 shadow-sm"
            >
              <div className="rounded-xl bg-green-50 p-3 text-green-700">
                <Icon size={22} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-gray-900">
                  {title}
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  {text}
                </p>
              </div>
            </div>
          ))}
        </section>

        <footer className="py-9 text-center text-xs text-gray-400">
          <Leaf size={15} className="mx-auto mb-2 text-green-700" />
          EcoTrack AI · Powered by Gemini
        </footer>

      </main>
    </div>
  );
}

export default AIHub;

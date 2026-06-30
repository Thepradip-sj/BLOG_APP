import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createBlog } from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  callGemini, geminiPrompts,
  getGeminiKey, saveGeminiKey, clearGeminiKey, hasGeminiKey,
} from "../services/gemini";


const KeySetup = ({ onSaved }) => {
  const [key, setKey] = useState("");

  const save = () => {
    if (!key.trim()) return;
    saveGeminiKey(key);
    onSaved();
  };

  return (
    <div className="space-y-3">
      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
        Paste your Gemini API key to enable AI writing. Keys are stored locally in your browser only.
      </p>
      <input
        type="password"
        placeholder="AIza…"
        value={key}
        onChange={(e) => setKey(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && save()}
        className="w-full px-3 py-2.5 text-sm rounded-xl outline-none"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "#f1f5f9",
        }}
        onFocus={(e) => (e.target.style.borderColor = "rgba(99,102,241,0.6)")}
        onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
      />
      <div className="flex items-center justify-between">
        <a
          href="https://aistudio.google.com/api-keys"
          target="_blank"
          rel="noreferrer"
          className="text-[10px] underline"
          style={{ color: "#818cf8" }}
        >
          Get a free key →
        </a>
        <button
          onClick={save}
          disabled={!key.trim()}
          className="px-4 py-1.5 rounded-xl text-xs font-bold"
          style={{
            background: key.trim()
              ? "linear-gradient(135deg,#6366f1,#4338ca)"
              : "rgba(255,255,255,0.06)",
            color: key.trim() ? "#fff" : "rgba(255,255,255,0.25)",
            transition: "all 0.2s",
          }}
        >
          Save key
        </button>
      </div>
    </div>
  );
};


const AiAction = ({ icon, label, desc, active, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl text-left"
    style={{
      background: active ? "rgba(99,102,241,0.22)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${active ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.07)"}`,
      transition: "all 0.15s",
    }}
  >
    <span style={{ fontSize: 15, marginTop: 1 }}>{icon}</span>
    <div>
      <p className="text-xs font-semibold" style={{ color: active ? "#a5b4fc" : "#f1f5f9" }}>
        {label}
      </p>
      <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.35)" }}>
        {desc}
      </p>
    </div>
  </button>
);


const ACTIONS = [
  { key: "generate",   icon: "✦", label: "Generate post",   desc: "Full post from your title" },
  { key: "improve",    icon: "✨", label: "Improve writing", desc: "Polish & fix existing content" },
  { key: "outline",    icon: "📋", label: "Outline",         desc: "Structured section outline" },
  { key: "intro",      icon: "🎯", label: "Write intro",     desc: "Hook opening paragraph" },
  { key: "conclusion", icon: "🏁", label: "Write conclusion",desc: "Strong closing paragraph" },
  { key: "tags",       icon: "🏷️", label: "Suggest tags",    desc: "5 relevant keywords" },
];

const AiPanel = ({ title, content, onInsert, onClose }) => {
  const [hasKey, setHasKey] = useState(hasGeminiKey);
  const [activeAction, setActiveAction] = useState("generate");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleClearKey = () => {
    clearGeminiKey();
    setHasKey(false);
    setResult("");
  };

  const run = async () => {
    setLoading(true);
    setError("");
    setResult("");
    try {
      let prompt;
      switch (activeAction) {
        case "generate":   prompt = geminiPrompts.generate(title || "my blog post"); break;
        case "improve":    prompt = geminiPrompts.improve(content || ""); break;
        case "outline":    prompt = geminiPrompts.outline(title || "my blog post"); break;
        case "intro":      prompt = geminiPrompts.intro(title || "my blog post"); break;
        case "conclusion": prompt = geminiPrompts.conclusion(content || ""); break;
        case "tags":       prompt = geminiPrompts.tags(title || "", content || ""); break;
        default:           prompt = geminiPrompts.generate(title);
      }
      const text = await callGemini(prompt);
      setResult(text);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      style={{
        width: "min(360px, 90vw)",
        background: "linear-gradient(160deg,#12122a 0%,#0f1623 100%)",
        border: "1px solid rgba(99,102,241,0.22)",
        borderRadius: 20,
        display: "flex",
        flexDirection: "column",
        maxHeight: "calc(100vh - 80px)",
        overflow: "hidden",
        boxShadow: "0 8px 48px rgba(99,102,241,0.18)",
        flexShrink: 0,
      }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
            style={{ background: "linear-gradient(135deg,#6366f1,#4338ca)" }}
          >
            G
          </div>
          <span className="text-sm font-bold" style={{ color: "#f1f5f9" }}>Gemini AI</span>
          <span
            className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
            style={{ background: "rgba(99,102,241,0.2)", color: "#a5b4fc" }}
          >
            Assistant
          </span>
        </div>
        <button
          onClick={onClose}
          style={{ color: "rgba(255,255,255,0.35)", fontSize: 20, lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

        {/* Key section */}
        {hasKey ? (
          <div
            className="flex items-center justify-between px-3 py-2 rounded-xl"
            style={{
              background: "rgba(134,239,172,0.08)",
              border: "1px solid rgba(134,239,172,0.2)",
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ color: "#86efac", fontSize: 13 }}>✓</span>
              <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.6)" }}>
                API key saved
              </span>
            </div>
            <button
              onClick={handleClearKey}
              className="text-[10px] font-semibold"
              style={{ color: "#fb7185" }}
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest mb-3"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              API Key
            </p>
            <KeySetup onSaved={() => setHasKey(true)} />
          </div>
        )}

        {/* Actions */}
        {hasKey && (
          <>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest mb-2"
                style={{ color: "rgba(255,255,255,0.35)" }}>
                Action
              </p>
              <div className="space-y-1.5">
                {ACTIONS.map((a) => (
                  <AiAction
                    key={a.key}
                    {...a}
                    active={activeAction === a.key}
                    onClick={() => { setActiveAction(a.key); setResult(""); setError(""); }}
                  />
                ))}
              </div>
            </div>

            {/* Context hint */}
            <div
              className="px-3 py-2 rounded-xl text-[10px] leading-relaxed"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.07)",
                color: "rgba(255,255,255,0.35)",
              }}
            >
              {activeAction === "generate" && `Using title: "${title || "(no title yet)"}"`}
              {activeAction === "improve"  && `Will rewrite your ${content.length} chars of content`}
              {activeAction === "outline"  && `Outline for: "${title || "(no title yet)"}"`}
              {activeAction === "intro"    && `Intro for: "${title || "(no title yet)"}"`}
              {activeAction === "conclusion" && `Conclusion from your ${content.length} chars`}
              {activeAction === "tags"     && `Tags for: "${title || "(no title)"}"`}
            </div>

            {/* Run button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={run}
              disabled={loading}
              className="w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              style={{
                background: loading
                  ? "rgba(99,102,241,0.25)"
                  : "linear-gradient(135deg,#6366f1,#4338ca)",
                color: loading ? "rgba(255,255,255,0.4)" : "#fff",
                boxShadow: loading ? "none" : "0 4px 20px rgba(99,102,241,0.3)",
                cursor: loading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
            >
              {loading ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                    className="block w-4 h-4 rounded-full"
                    style={{ border: "2px solid rgba(255,255,255,0.25)", borderTopColor: "#fff" }}
                  />
                  Generating…
                </>
              ) : (
                <>✦ Run Gemini</>
              )}
            </motion.button>
          </>
        )}

        {/* Error */}
        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs px-3 py-2.5 rounded-xl leading-relaxed"
            style={{
              color: "#fb7185",
              background: "rgba(233,69,96,0.1)",
              border: "1px solid rgba(233,69,96,0.2)",
            }}
          >
            ⚠ {error}
          </motion.p>
        )}

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "rgba(255,255,255,0.35)" }}>
              Result
            </p>
            <div
              className="text-xs leading-relaxed p-3 rounded-xl whitespace-pre-wrap max-h-52 overflow-y-auto"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              {result}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => onInsert(result)}
                className="flex-1 py-2 rounded-xl text-xs font-bold"
                style={{
                  background: "linear-gradient(135deg,#e94560,#c2185b)",
                  color: "#fff",
                  boxShadow: "0 2px 12px rgba(233,69,96,0.3)",
                }}
              >
                ↓ Insert into post
              </button>
              <button
                onClick={copy}
                className="px-3 py-2 rounded-xl text-xs font-medium"
                style={{
                  background: copied ? "rgba(134,239,172,0.15)" : "rgba(255,255,255,0.06)",
                  color: copied ? "#86efac" : "rgba(255,255,255,0.45)",
                  border: `1px solid ${copied ? "rgba(134,239,172,0.3)" : "rgba(255,255,255,0.08)"}`,
                  transition: "all 0.2s",
                }}
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

const CreateBlog = () => {
  const [form, setForm] = useState({ title: "", content: "", img: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [charCount, setCharCount] = useState(0);
  const [aiOpen, setAiOpen] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createBlog(form);
      navigate("/");
    } catch {
      setError("Failed to publish. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setContent = (val) => {
    setForm((f) => ({ ...f, content: val }));
    setCharCount(val.length);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.09)",
    color: "#f1f5f9",
    transition: "border-color 0.2s",
  };

  return (
    <div
      className="min-h-screen relative overflow-x-hidden"
      style={{ background: "linear-gradient(160deg,#0a0a14 0%,#0d1117 100%)" }}
    >
      {/* ambient glows */}
      <div className="absolute pointer-events-none" style={{
        width: 480, height: 480, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(233,69,96,0.12) 0%,transparent 70%)",
        top: -120, left: -120,
      }} />
      <div className="absolute pointer-events-none" style={{
        width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle,rgba(99,102,241,0.1) 0%,transparent 70%)",
        bottom: -80, right: -80,
      }} />

      
      <div className="flex gap-6 max-w-5xl mx-auto px-6 py-12 relative z-10 items-start">

        {/* ── Main form ── */}
        <div className="flex-1 min-w-0">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm font-medium mb-8"
            style={{ color: "rgba(255,255,255,0.38)" }}
          >
            <span style={{ fontSize: 16 }}>←</span> Back to blogs
          </button>

          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-2"
              style={{ color: "#e94560" }}>
              New post
            </p>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-4xl font-extrabold"
                style={{ color: "#f1f5f9", letterSpacing: "-0.02em" }}>
                Write something great
              </h1>

              {/* AI toggle */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setAiOpen((v) => !v)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                style={{
                  background: aiOpen
                    ? "linear-gradient(135deg,#6366f1,#4338ca)"
                    : "rgba(99,102,241,0.14)",
                  color: aiOpen ? "#fff" : "#a5b4fc",
                  border: "1px solid rgba(99,102,241,0.35)",
                  boxShadow: aiOpen ? "0 4px 20px rgba(99,102,241,0.3)" : "none",
                  transition: "all 0.2s",
                }}
              >
                <span>✦</span>
                {aiOpen ? "Hide AI" : "AI Assist"}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 24,
              padding: "2rem",
              backdropFilter: "blur(20px)",
            }}
          >
            <form onSubmit={submit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "rgba(255,255,255,0.38)" }}>Title</label>
                <input
                  required
                  placeholder="Give your post a compelling title…"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-base font-semibold outline-none"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.55)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>

              {/* Cover image */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest mb-2"
                  style={{ color: "rgba(255,255,255,0.38)" }}>
                  Cover image URL{" "}
                  <span style={{ textTransform: "none", letterSpacing: 0, color: "rgba(255,255,255,0.22)" }}>
                    (optional)
                  </span>
                </label>
                <input
                  placeholder="https://example.com/image.jpg"
                  value={form.img}
                  onChange={(e) => setForm({ ...form, img: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.55)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                />
                {form.img && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 overflow-hidden rounded-xl"
                  >
                    <img
                      src={form.img}
                      alt="Cover preview"
                      className="w-full object-cover rounded-xl"
                      style={{ maxHeight: 180 }}
                      onError={(e) => (e.target.style.display = "none")}
                    />
                  </motion.div>
                )}
              </div>

              {/* Content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.38)" }}>Content</label>
                  <span className="text-xs tabular-nums" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {charCount} chars
                  </span>
                </div>
                <textarea
                  required
                  placeholder="Start writing your post here… or use AI Assist →"
                  rows={10}
                  value={form.content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm leading-relaxed outline-none resize-none"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.55)")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.09)")}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs px-3 py-2 rounded-xl"
                  style={{
                    color: "#fb7185",
                    background: "rgba(233,69,96,0.12)",
                    border: "1px solid rgba(233,69,96,0.25)",
                  }}
                >
                  ⚠ {error}
                </motion.p>
              )}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(255,255,255,0.09)",
                  }}
                >
                  Discard
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.02 }}
                  disabled={loading}
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                  style={{
                    background: loading
                      ? "rgba(233,69,96,0.35)"
                      : "linear-gradient(135deg,#e94560,#c2185b)",
                    color: "#fff",
                    boxShadow: loading ? "none" : "0 4px 24px rgba(233,69,96,0.35)",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {loading ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                        className="block w-4 h-4 rounded-full"
                        style={{ border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff" }}
                      />
                      Publishing…
                    </>
                  ) : <>✦ Publish post</>}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>

        {/* ── AI Panel ── */}
        <AnimatePresence>
          {aiOpen && (
            <div className="w-full lg:w-auto lg:sticky lg:top-20">
              <AiPanel
                title={form.title}
                content={form.content}
                onInsert={setContent}
                onClose={() => setAiOpen(false)}
              />
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CreateBlog;
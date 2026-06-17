import { useState } from "react";
import { motion } from "framer-motion";
import { loginUser } from "../services/api";
import { setAuth } from "../services/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await loginUser(form);
      setAuth(res.data);
      navigate("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #0a0a14 0%, #0d1117 100%)" }}
    >
      {/* ambient glow blobs */}
      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(233,69,96,0.18) 0%, transparent 70%)",
          top: "-80px", left: "-80px",
        }}
      />
      <div
        className="absolute w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(99,102,241,0.14) 0%, transparent 70%)",
          bottom: "-80px", right: "-60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        style={{
          width: "min(380px, 92vw)",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.09)",
          borderRadius: 24,
          padding: "2.5rem 2rem",
          backdropFilter: "blur(20px)",
          boxShadow: "0 24px 80px rgba(0,0,0,0.5)",
          position: "relative",
          zIndex: 10,
        }}
      >
        {/* logo mark */}
        <div className="flex justify-center mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black"
            style={{ background: "linear-gradient(135deg, #e94560 0%, #c2185b 100%)" }}
          >
            B
          </div>
        </div>

        <h2
          className="text-2xl font-extrabold text-center mb-1"
          style={{ color: "#f1f5f9", letterSpacing: "-0.02em" }}
        >
          Welcome back
        </h2>
        <p className="text-center text-sm mb-8" style={{ color: "rgba(255,255,255,0.38)" }}>
          Sign in to continue writing
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f1f5f9",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Password */}
          <div>
            <label
              className="block text-xs font-semibold uppercase tracking-widest mb-1.5"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f1f5f9",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(233,69,96,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
          </div>

          {/* Error */}
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs px-3 py-2 rounded-lg"
              style={{
                color: "#fb7185",
                background: "rgba(233,69,96,0.12)",
                border: "1px solid rgba(233,69,96,0.25)",
              }}
            >
              {error}
            </motion.p>
          )}

          {/* Submit */}
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ scale: 1.02 }}
            disabled={loading}
            type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-bold mt-2"
            style={{
              background: loading
                ? "rgba(233,69,96,0.4)"
                : "linear-gradient(135deg, #e94560 0%, #c2185b 100%)",
              color: "#fff",
              boxShadow: loading ? "none" : "0 4px 24px rgba(233,69,96,0.35)",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
            }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </motion.button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: "rgba(255,255,255,0.35)" }}>
          No account yet?{" "}
          <span
            onClick={() => navigate("/register")}
            className="font-semibold cursor-pointer"
            style={{ color: "#e94560" }}
          >
            Create one
          </span>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
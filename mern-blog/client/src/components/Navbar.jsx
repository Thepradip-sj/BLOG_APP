import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getUser, isLoggedIn, logout } from "../services/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();
  const loggedIn = isLoggedIn();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="sticky top-0 z-50"
      style={{
        background: "rgba(10,10,20,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 no-underline">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black"
            style={{ background: "linear-gradient(135deg, #e94560 0%, #c2185b 100%)" }}
          >
            B
          </div>
          <span
            className="text-base font-extrabold tracking-tight"
            style={{ color: "#f1f5f9" }}
          >
            MERN<span style={{ color: "#e94560" }}>Blog</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="hidden sm:flex items-center gap-1">
          <NavLink to="/" active={isActive("/")}>Home</NavLink>

          {loggedIn ? (
            <>
              {/* Write button */}
              <Link
                to="/create"
                className="ml-3 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold no-underline"
                style={{
                  background: "linear-gradient(135deg, #e94560 0%, #c2185b 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 16px rgba(233,69,96,0.3)",
                }}
              >
                <span style={{ fontSize: 14 }}>✦</span> Write
              </Link>

              {/* Avatar + logout */}
              <div className="ml-4 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                  style={{
                    background: "linear-gradient(135deg, #e94560 0%, #6366f1 100%)",
                    color: "#fff",
                    boxShadow: "0 0 0 2px rgba(233,69,96,0.3)",
                  }}
                  title={user?.name}
                >
                  {user?.name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(233,69,96,0.12)",
                    color: "#fb7185",
                    border: "1px solid rgba(233,69,96,0.25)",
                  }}
                >
                  Sign out
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-3">
              <Link
                to="/login"
                className="px-4 py-1.5 rounded-full text-xs font-semibold no-underline"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full text-xs font-bold no-underline"
                style={{
                  background: "linear-gradient(135deg, #e94560 0%, #c2185b 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 12px rgba(233,69,96,0.3)",
                }}
              >
                Get started
              </Link>
            </div>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          className="sm:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="block h-0.5 w-5 rounded"
              style={{ background: "rgba(255,255,255,0.7)" }}
              animate={{
                rotate: menuOpen && i === 0 ? 45 : menuOpen && i === 2 ? -45 : 0,
                y: menuOpen && i === 0 ? 8 : menuOpen && i === 2 ? -8 : 0,
                opacity: menuOpen && i === 1 ? 0 : 1,
              }}
              transition={{ duration: 0.2 }}
            />
          ))}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sm:hidden overflow-hidden"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="px-6 py-4 flex flex-col gap-3">
              <MobileLink to="/" onClick={() => setMenuOpen(false)}>Home</MobileLink>

              {loggedIn ? (
                <>
                  <MobileLink to="/create" onClick={() => setMenuOpen(false)}>
                    ✦ Write a blog
                  </MobileLink>
                  <div
                    className="h-px"
                    style={{ background: "rgba(255,255,255,0.07)" }}
                  />
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{
                        background: "linear-gradient(135deg, #e94560, #6366f1)",
                        color: "#fff",
                      }}
                    >
                      {user?.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span className="text-sm font-medium" style={{ color: "#f1f5f9" }}>
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold text-left"
                    style={{ color: "#fb7185" }}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  <MobileLink to="/login" onClick={() => setMenuOpen(false)}>Sign in</MobileLink>
                  <MobileLink to="/register" onClick={() => setMenuOpen(false)}>Get started</MobileLink>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

/* ── helpers ── */
const NavLink = ({ to, active, children }) => (
  <Link
    to={to}
    className="px-3 py-1.5 rounded-lg text-sm font-medium no-underline transition-colors"
    style={{
      color: active ? "#f1f5f9" : "rgba(255,255,255,0.45)",
      background: active ? "rgba(255,255,255,0.08)" : "transparent",
    }}
  >
    {children}
  </Link>
);

const MobileLink = ({ to, onClick, children }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-sm font-medium no-underline"
    style={{ color: "rgba(255,255,255,0.65)" }}
  >
    {children}
  </Link>
);

export default Navbar;
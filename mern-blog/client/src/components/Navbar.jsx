import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getUser, isLoggedIn, logout } from "../services/auth";

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();
  const loggedIn = isLoggedIn();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200"
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
        >
          MERN Blog
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-black transition"
          >
            Home
          </Link>

          {loggedIn ? (
            <>
              <Link
                to="/create"
                className="px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold hover:opacity-90 transition"
              >
                + Write
              </Link>

              {/* User badge */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>

                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:underline"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-black transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-full border border-gray-300 text-sm hover:bg-gray-100 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;

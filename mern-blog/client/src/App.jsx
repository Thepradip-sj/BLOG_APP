import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/login";
import Register from "./pages/register";
import CreateBlog from "./pages/CreateBlog";
import ProtectedRoute from "./components/protectedRoute";
import BlogDetail from "./pages/BlogDetail";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<ProtectedRoute>
          <CreateBlog />
          </ProtectedRoute>
        }
        />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

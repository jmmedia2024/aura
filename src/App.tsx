import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import { ParticleSystem } from "./components/ParticleSystem";
import Footer from "./components/Footer";
import ChatWidget from "./components/ChatWidget";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import MyPage from "./pages/MyPage";
import Apply from "./pages/Apply";
import Aurora from "./pages/Aurora";
import Community from "./pages/Community";
import { AuthProvider } from "./lib/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen font-sans scroll-smooth">
          <ParticleSystem />
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/mypage" element={<MyPage />} />
              <Route path="/apply" element={<Apply />} />
              <Route path="/community" element={<Community />} />
              <Route path="/aurora" element={<Aurora />} />
              <Route path="/mypage/aurora" element={<Aurora />} />
            </Routes>
          </main>
          <ChatWidget />
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

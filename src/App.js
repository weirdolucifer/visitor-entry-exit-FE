import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserContext, UserContextProvider } from "./context/UserContext";
import { useNavigate } from "react-router-dom";
import Topbar from "./components/topbar";
import Sidebar from "./components/sidebar";
import Footer from "./components/footer";
import Login from "./views/auth/Login";
import Dashboard from "./views/dashboard/Dashboard";
import User from "./views/user";
import Visitor from "./views/visitor";
import Pass from "./views/pass";
import VisitLog from "./views/log";
import Faq from "./views/auth/Faq";
import Dept from "./views/dept";

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Content />
      </UserContextProvider>
    </BrowserRouter>
  );
}

function Content() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const type = localStorage.getItem("user_type");
      setIsAuthenticated(!!token);
      setUserType(type);

      if (!token) {
        navigate("/login");
      }
    };

    checkAuth();
    console.log(userType);
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [navigate]);

  const renderRoutes = () => {
    switch (userType) {
      case 'Receptionist':
        return (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/visitor" element={<Visitor />} />
            <Route path="/dept" element={<Dept />} />
            <Route path="/pass" element={<Pass />} />
            <Route path="/log" element={<VisitLog />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        );
      default:
        return (
          <>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user" element={<User />} />
            <Route path="/dept" element={<Dept />} />
            <Route path="/visitor" element={<Visitor />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/pass" element={<Pass />} />
            <Route path="/log" element={<VisitLog />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        );
    }
  };

  return isAuthenticated ? (
    <div style={{ backgroundColor: "#f4f4f4" }}>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Topbar />
          <div className="overflow-auto">
            <Routes>
              {renderRoutes()}
            </Routes>
          </div>
          <Footer/>
        </div>
      </div>
    </div>
  ) : (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;


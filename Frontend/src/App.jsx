import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "react-toastify/dist/ReactToastify.css";

import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Admin from "./pages/Admin";
import Contact from "./pages/Contact";
import About from "./pages/About";
import RefereshHandle from "./RefereshHandle";
import SignUp from "./pages/SignUp";
import Services from "./pages/Services";
import UserDashboard from "./pages/User";
import WorkerLogin from "./pages/WorkerLogin";
import WorkerForgotPassword from "./pages/WorkerForgotPassword";
import Worker from "./pages/Worker";
import Payment from "./pages/Payment";
import BookService from "./pages/BookService";
import NotFound from "./pages/404NotFound";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import AdminLogin from "./components/admin/AdminLogin";
import "locomotive-scroll/dist/locomotive-scroll.css";
import LocomotiveScroll from "locomotive-scroll";
import Footer from "./components/Footer";
import { getRoleFromToken } from "./utils/getRole";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);


  const PrivateRoute = ({ element, allowedRole }) => {

    const role = getRoleFromToken();

    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("userToken") ||
      localStorage.getItem("workerToken");

    if (!token) {
      return <Navigate to={
        allowedRole === "admin" ? "/admin-login" :
          allowedRole === "worker" ? "/worker-login" :
            "/login"
      } />;
    }

    if (allowedRole && role !== allowedRole) {
      return <Navigate to="/" />;
    }

    return element;
  };

  const toastRoot = document.getElementById("toast-root");

  const Layout = () => {
    const location = useLocation();

    const hideHeader =
      location.pathname.startsWith("/admin") ||
      location.pathname.startsWith("/worker");

    const noFooterRoutes = ["/admin", "/worker", "/user-dashboard"];
    const hideFooter = noFooterRoutes.some(path =>
      location.pathname.startsWith(path)
    );


    // Pages that should NOT use locomotive scroll
    const noSmoothScroll = ["/services", "/user-dashboard", "/worker", "/admin"];
    const isExcluded = noSmoothScroll.some(path =>
      location.pathname.startsWith(path)
    );
    useEffect(() => {
      // Always reset these first on every route change
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";

      if (isExcluded) return; // ← skip locomotive, native scroll works

      const mainEl = document.querySelector("#main");
      if (!mainEl) return;

      const scroll = new LocomotiveScroll({
        el: mainEl,
        smooth: true,
        multiplier: 1
      });

      return () => {
        scroll.destroy();
        // Clean up any styles locomotive set
        document.documentElement.style.overflow = "";
        document.body.style.overflow = "";
      };
    }, [location.pathname]);

    const navigate = useNavigate();

    useEffect(() => {
      const interceptor = axios.interceptors.response.use(
        res => res,
        err => {
          if (err.response?.status === 401) {
            const path = window.location.pathname;

            if (
              path !== "/login" &&
              path !== "/admin-login" &&
              path !== "/worker-login"
            ) {
              localStorage.removeItem("userToken");
              localStorage.removeItem("workerToken");
              localStorage.removeItem("token");
              
              navigate("/login");
            }
          }

          return Promise.reject(err);
        }
      );

      return () => axios.interceptors.response.eject(interceptor);
    }, []);


    return (
      <>
        <RefereshHandle setIsAuthenticated={setIsAuthenticated} />

        {!hideHeader && <Header />}

        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/services" element={<Services />} />

          <Route path="/worker-login" element={<WorkerLogin />} />
          <Route path="/worker/*" element={<PrivateRoute element={<Worker />} allowedRole="worker" />} />

          <Route path="/home" element={<Home />} />
          <Route path="/user-dashboard" element={<PrivateRoute element={<UserDashboard />} allowedRole="user" />} />

          <Route path="/payment/:serviceId" element={<PrivateRoute element={<Payment />} />} />
          <Route path="/booking/:serviceId" element={<PrivateRoute element={<BookService />} />} />

          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/*" element={<PrivateRoute element={<Admin />} allowedRole="admin" />}
          />

          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          <Route path="/worker-forgot" element={<WorkerForgotPassword />} />

          <Route path="*" element={<NotFound />} />

        </Routes>
        {!hideFooter && <Footer />}
      </>
    );
  };

  return (
    <div>
      <BrowserRouter>
        <div id="main">
          <Layout />
        </div>
      </BrowserRouter>

      {toastRoot &&
        createPortal(
          <ToastContainer
            position="top-right"
            autoClose={3000}
            newestOnTop
            closeOnClick
            pauseOnHover
            theme="light"
          />,
          toastRoot
        )
      }
    </div>
  );
}

export default App;
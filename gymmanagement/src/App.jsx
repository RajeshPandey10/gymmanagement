// App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import LazyLoader from "./utils/LazyLoader";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import Footer from "./components/Footer";

// Lazy Load Pages
const Home = lazy(() => import("./pages/Home/Home"));
const SignIn = lazy(() => import("./pages/auth/sign-in"));
const SignUp = lazy(() => import("./pages/auth/sign-up"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Schedule = lazy(() => import("./pages/dashboard/Schedule"));
const BookGym = lazy(() => import("./pages/dashboard/BookGym"));
const BookTrainer = lazy(() => import("./pages/dashboard/BookTrainer"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const Transactions = lazy(() => import("./pages/dashboard/Transactions"));
const Nutritions = lazy(() => import("./pages/dashboard/Nutritions"));


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Main />
      </Router>
    </AuthProvider>
  );
};

const Main = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth/sign-in" || location.pathname === "/auth/sign-up";

  return (
    <>
      {!isAuthPage && <Navbar />}
      <Suspense fallback={<LazyLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="book-gym" element={<BookGym />} />
            <Route path="book-trainer" element={<BookTrainer />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="nutritions" element={<Nutritions />} />

            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="*" element={<Home />} />
        </Routes>
      </Suspense>
      {!isAuthPage && <Footer />}
    </>
  );
};

export default App;
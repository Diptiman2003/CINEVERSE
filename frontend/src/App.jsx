import React, { use, useEffect } from 'react'
import { Route, Routes, ScrollRestoration, useLocation } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import SignUp from "./pages/SignUp"
import Movie from './Pages/Movie'
import Release from './Pages/Release'
import Booking from './Pages/Booking'
import Contact from './Pages/Contact'
import MovieDetailPage from './Pages/MovieDetailPage'
import MovieDetailPageHome from './Pages/MovieDetailPageHome'
import SeatSelector from './Pages/SeatSelector'
import SeatSelectorPageHome from './components/SeatSelectorPageHome'
import { VerifyPaymentPage } from '../VerifyPaymentPage'
import AdminHome from './admin/pages/AdminHome'
import DashboardPage from './admin/pages/Dashboard'
import BookingsPage from './admin/pages/BookingsPage'
import ListMoviesPage from './admin/components/ListMoviesPage'
import UserManagement from './admin/pages/UserManagement'
import AdminLayout from './admin/AdminLayout'
import ProtectedUserRoute from './ProtectedUserRoute'


function ScrollToTOP() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && 'ScrollRestoration' in window.history) {
      try {
        window.history.ScrollRestoration = 'manual';
      } catch (e) {
      }
    }
  }, []);
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id) || document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        return;
      }
    }

    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [location.pathname, location.search, location.hash]);
  return null;
}
const App = () => {
  useEffect(() => {
    const prevHtmlOverflowX = document.documentElement.style.overflowX;
    const prevBodyOverflowX = document.body.style.overflowX;

    document.documentElement.style.overflowX = 'hidden';
    document.body.style.overflowX = 'hidden';
    return () => {
      document.documentElement.style.overflowX = prevHtmlOverflowX;
      document.body.style.overflowX = prevBodyOverflowX;
    };
  }, []);

  return (
    <>
      <ScrollToTOP />
      <div className='min-h-screen w-full overflow-x-hidden '>


        <Routes>
          {/* User only routes */}
          <Route element={<ProtectedUserRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movie />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/movies/:id/seat-selector/:showtime" element={<SeatSelector />} />
            <Route path="/movies/:id/seat-selector/:slot" element={<SeatSelector />} />
            <Route path="/movie/:id/seat-selector/:showtime" element={<SeatSelector />} />
            <Route path="/movie/:id/seat-selector/:slot" element={<SeatSelector />} />
            <Route path="/bookings" element={<Booking />} />
            {/* ...baaki user routes */}
          </Route>

          {/* Admin only routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="listmovies" element={<ListMoviesPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="users" element={<UserManagement />} />
            
          </Route>

          {/* Public routes - dono dekh sakte hain */}
          <Route path="/success" element={<VerifyPaymentPage />} />
          <Route path="/cancel" element={<VerifyPaymentPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp />} />
        </Routes>
      </div>
    </>
  )
}

export default App


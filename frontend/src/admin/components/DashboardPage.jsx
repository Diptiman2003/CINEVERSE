// import React,{useEffect,useState,useMemo} from 'react'
// import { styles3,fontStyles2 } from '../assets/dummyStyles'
// import axios from 'axios'
// const API_BASE = 'http://localhost:5000';
// // format INR
// const fmtINR = (num) =>
//   typeof num === "number"
//     ? `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
//     : "₹0";
// const DashboardPage = () => {
//   const [movies, setMovies] = useState([]);
//   const [bookings, setBookings] = useState([]);
//   const [users, setUsers] = useState([]);

  
//   useEffect(() => {
//     let cancelled = false;

//     async function fetchAll() {
//       try {
//         // request paid bookings only (defensive: backend may already default to paid)
//         const [mRes, bRes, uRes] = await Promise.allSettled([
//           axios.get(`${API_BASE}/api/movies`),
//           axios.get(`${API_BASE}/api/bookings`,{
          
//             params:{paymentStatus:"paid",limit:1000},
//           }),
//           axios.get(`${API_BASE}/api/users`), //not for user route but to get the user from  the bookings done ie one user can have multi bookings.
//         ]);
//         // helper to normalise typical API shapes
//         const normaliseArrayResponse = (r) => {
//           if (!r) return [];
//           if (r.status === "rejected") return [];
//           const data = r.value?.data;
//           if (!data) return [];
//           if (Array.isArray(data)) return data;
//           if (Array.isArray(data.items)) return data.items;
//           if (Array.isArray(data.rows)) return data.rows;
//           if (Array.isArray(data.data)) return data.data;
//           // sometimes backend returns { success: true, items: [...] }
//           if (Array.isArray(data.items)) return data.items;
//           return [];
//         };

//         const rawMovies = normaliseArrayResponse(mRes);
//         const rawBookings = normaliseArrayResponse(bRes);
//         const rawUsers = normaliseArrayResponse(uRes);

//         // normalize movies -> { id, title, basePrice }
//         const normMovies = rawMovies.map((m) => ({
//           id: m._id || m.id || m.movieId || m.idStr || "",
//           title: m.title || m.movieName || m.name || "Untitled",
//           basePrice: Number(m.basePrice || m.price || m.ticketPrice || 0) || 0,
//         }));

//         // normalize bookings -> { id, movieId, movieTitle, seats:[], totalPaid, userId, customer, raw }
//         const normBookings = rawBookings.map((b) => {
//           const movieId =
//             b.movieId || (b.movie && (b.movie.id || b.movie._id)) || "";
//           const movieTitle =
//             (b.movie && (b.movie.title || b.movie.movieName)) ||
//             b.movieName ||
//             b.movie ||
//             "";
//           const seats = Array.isArray(b.seats)
//             ? b.seats
//                 .map((s) =>
//                   typeof s === "string" ? s : (s && (s.seatId || s.id)) || ""
//                 )
//                 .filter(Boolean)
//             : Array.isArray(b.seatIds)
//             ? b.seatIds.map(String).filter(Boolean)
//             : [];
//           // prefer authoritative amount fields
//           const totalPaid =
//             Number(
//               b.amountPaise !== undefined && b.amountPaise !== null
//                 ? Number(b.amountPaise) / 100
//                 : b.amount || b.total || 0
//             ) || 0;
//           const userId =
//             b.userId ||
//             (b.user && (b.user._id || b.user.id)) ||
//             b.customerId ||
//             "";
//           const customer =
//             b.customer ||
//             b.customerName ||
//             (b.user && (b.user.name || b.user.fullName)) ||
//             "";
//           return {
//             id: b._id || b.id || b.bookingId || "",
//             movieId,
//             movieTitle,
//             seats,
//             totalPaid,
//             userId,
//             customer,
//             raw: b,
//           };
//         });

//         // Defensive client-side filter: ensure only paid bookings are used.
//         const paidBookings = normBookings.filter((bk) => {
//           const raw = bk.raw || {};
//           const ps = (
//             raw.paymentStatus ||
//             raw.payment_status ||
//             raw.paymentstate ||
//             ""
//           )
//             .toString()
//             .toLowerCase();
//           const st = (raw.status || "").toString().toLowerCase();
//           // accept booking if paymentStatus === 'paid' or status === 'paid' or we have a positive paid amount
//           return ps === "paid" || st === "paid" || Number(bk.totalPaid) > 0;
//         });

//         // normalize users -> { id, name }
//         const normUsers = rawUsers.map((u) => ({
//           id: u._id || u.id || u.userId || "",
//           name: u.name || u.fullName || u.username || "",
//         }));

//         if (!cancelled) {
//           setMovies(normMovies);
//           setBookings(paidBookings);
//           setUsers(normUsers);
//         }
//       } catch (err) {
//         console.error("dashboard fetch error:", err);
//       }
//     }
//     fetchAll();
//     return () => {
//       cancelled = true;
//     };
//   }, []);

//   const summary = useMemo(() => {
//     // totals from bookings (bookings already filtered to paid bookings)
//     const totalBookings = bookings.length;

//     let totalRevenue = 0;
//     for (let i = 0; i < bookings.length; i++)
//       totalRevenue += bookings[i].totalPaid || 0;

//     // total users: prefer users API if it returned data, otherwise derive from bookings
//     const usersFromApi = new Set(users.map((u) => u.id).filter(Boolean));

//     const usersFromBookings = new Set();
//     for (let i = 0; i < bookings.length; i++) {
//       const b = bookings[i];
//       if (b.userId) usersFromBookings.add(String(b.userId));
//       else if (b.customer) usersFromBookings.add(String(b.customer));
//       else if (b.raw && b.raw.email) usersFromBookings.add(String(b.raw.email));
//       else if (b.raw && b.raw.customerEmail)
//         usersFromBookings.add(String(b.raw.customerEmail));
//     }

//     const totalUsers =
//       usersFromApi.size > 0 ? usersFromApi.size : usersFromBookings.size;

//     // per-movie aggregation — only include movies that actually have bookings
//     const map = {};

//     // first, build a quick id->title map from movies API
//     const movieTitleMap = {};
//     for (let i = 0; i < movies.length; i++) {
//       const m = movies[i];
//       if (m.id) movieTitleMap[m.id] = m.title;
//     }

//     // aggregate from bookings so only movies with bookings appear
//     for (let i = 0; i < bookings.length; i++) {
//       const bk = bookings[i];
//       const key = bk.movieId || bk.movieTitle || `unknown-${i}`;
//       const title = movieTitleMap[bk.movieId] || bk.movieTitle || "Unknown";
//       if (!map[key]) map[key] = { id: key, title, bookings: 0, earnings: 0 };
//       map[key].bookings += 1;
//       map[key].earnings += bk.totalPaid || 0;
//     }

//     const movieStats = Object.values(map).sort(
//       (a, b) => b.bookings - a.bookings
//     );

//     return { totalBookings, totalRevenue, totalUsers, movieStats };
//   }, [movies, bookings, users]);

  
//   return (
//     <div style={fontStyles2.cinzelFont} className={styles3.dashboardPageContainer}>
//     <div className={styles3.maxWidthContainer}>
//       <header className={styles3.dashboardHeaderContainer}>
//        <div>
//         <h1 className={styles3.dashboardTitle}>Dashboard</h1>
//         <p className={styles3.dashboardSubtitle}>
//           Overview of paid bookings,revenue and users
//         </p>
//        </div>
//       </header>
//       <section className={styles3.summaryGrid}>
//         <div className={styles3.summaryCard}>
//           <div className={styles3.summaryCardInner}>
//             <div>
//              <div className={styles3.summaryLabel}>Total Bookings</div>
//              <div className={styles3.summaryValue}>{summary.totalBookings}</div>
//             </div>
//             <div className={styles3.summaryBadge}>Bookings</div>
//           </div>
//           <div className={styles3.summaryNote}>Paid orders only</div>
//         </div>

//         <div className={styles3.summaryCard}>
//           <div className={styles3.summaryCardInner}>
//             <div>
//              <div className={styles3.summaryLabel}>Total Revenue</div>
//              <div className={styles3.summaryValue}>{fmtINR(summary.totalRevenue)}</div>
//             </div>
//             <div className={styles3.summaryBadge}>Revenue</div>
//           </div>
//           <div className={styles3.summaryNote}>Paid bookings summed</div>
//         </div>

//         <div className={styles3.summaryCard}>
//           <div className={styles3.summaryCardInner}>
//             <div>
//              <div className={styles3.summaryLabel}>Total Users</div>
//              <div className={styles3.summaryValue}>{summary.totalUsers}</div>
//             </div>
//             <div className={styles3.summaryBadge}>Users</div>
//           </div>
//           <div className={styles3.summaryNote}>Registered or booking users</div>
//         </div>
//       </section>

//       <section className={styles3.moviesSection}>
//         <div className={styles3.moviesHeader}>
//           <h2 className={styles3.moviesTitle}>
//             Movies - Bookings & Earnings
//           </h2>
//           <div className={styles3.moviesCount}>
//             {summary.movieStats.length} movies
//           </div>
//         </div>
//         <div className={styles3.tableContainer}>
//         <table className={styles3.table}>
//               <thead>
//                 <tr className={styles3.tableHeader}>
//                   <th className={styles3.tableHeaderCell}>Movie</th>
//                   <th className={styles3.tableHeaderCell}>Total Bookings</th>
//                   <th className={styles3.tableHeaderCell}>Total Earnings</th>
//                   <th className={styles3.tableHeaderCell}>Avg per Booking</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {summary.movieStats.map((m) => {
//                   const avg = m.bookings ? Math.round(m.earnings / m.bookings) : 0;
//                   return(
//                     <tr key={m.id} className={styles3.tableRow}>
//                       <td className={styles3.tableCell}>
//                       <div className={styles3.tableMovieTitle}>{m.title}</div>
//                       </td>
//                       <td className={styles3.tableCell}>{m.bookings}</td>
//                       <td className={styles3.tableEarnings}>{fmtINR(m.earnings)}</td>
//                       <td className={styles3.tableAvg}>{fmtINR(avg)}</td>
//                     </tr>
//                   );
//                 })}
//                 {summary.movieStats.length === 0 && (
//                   <tr className={styles3.tableEmpty}>
//                     <td colSpan={4}>No Movies Data Yet.</td>
//                 </tr>
//                 )}
//               </tbody>
//         </table>
//         </div>

//         {/*movie/tablet view */}
//         <div className={styles3.mobileList}>
//          {summary.movieStats.map((m) => {
//               const avg = m.bookings ? Math.round(m.earnings / m.bookings) : 0;
//               return (
//                 <div key={m.id} className={styles3.mobileCard}>
//                   <div className={styles3.mobileCardInner}>
//                     <div>
//                       <div className={styles3.mobileMovieTitle}>{m.title}</div>
//                       <div className={styles3.mobileLabel}>
//                         Bookings:{" "}
//                         <span className={styles3.mobileValue}>
//                           {m.bookings}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="text-right">
//                       <div className={styles3.mobileEarnings}>
//                         {fmtINR(m.earnings)}
//                       </div>
//                       <div className={styles3.mobileAvgLabel}>
//                         Avg:{" "}
//                         <span className={styles3.mobileAvgValue}>
//                           {fmtINR(avg)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//             {summary.movieStats.length === 0 && (
//               <div className={styles3.mobileEmpty}>
//                 No Movies data yet.
//               </div>
//             )}
//         </div>
//       </section>
//     </div>
//     </div>
//   )
// }

// export default DashboardPage



// DashboardPage.jsx
// Place in: admin/src/components/DashboardPage.jsx — replace existing
// Run first: npm install recharts

import React, { useEffect, useState, useMemo } from 'react';
import { styles3, fontStyles2 } from '../assets/dummyStyles';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts';
import {
  TrendingUp, Users, Ticket, DollarSign,
  Film, Award, Calendar, ArrowUp
} from 'lucide-react';

const API_BASE = 'http://localhost:5000';

const fmtINR = (num) =>
  typeof num === "number"
    ? `₹${num.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`
    : "₹0";

// Chart colors
const COLORS = ["#e63946", "#2a9d8f", "#6c63ff", "#f4a261", "#457b9d", "#e9c46a", "#264653"];

// Custom tooltip for bar chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1e2a", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "8px", padding: "10px 14px" }}>
        <p style={{ color: "#e63946", fontSize: "12px", marginBottom: "4px" }}>{label}</p>
        <p style={{ color: "#fff", fontSize: "14px", fontWeight: "700" }}>{fmtINR(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

const BookingTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: "#1a1e2a", border: "1px solid rgba(42,157,143,0.3)", borderRadius: "8px", padding: "10px 14px" }}>
        <p style={{ color: "#2a9d8f", fontSize: "12px", marginBottom: "4px" }}>{label}</p>
        <p style={{ color: "#fff", fontSize: "14px", fontWeight: "700" }}>{payload[0].value} bookings</p>
      </div>
    );
  }
  return null;
};

const DashboardPage = () => {
  const [movies, setMovies]     = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchAll() {
      try {
        const [mRes, bRes, uRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/api/movies`),
          axios.get(`${API_BASE}/api/bookings`, { params: { paymentStatus: "paid", limit: 1000 } }),
          axios.get(`${API_BASE}/api/auth/users`),
        ]);

        const normalise = (r) => {
          if (!r || r.status === "rejected") return [];
          const data = r.value?.data;
          if (!data) return [];
          if (Array.isArray(data)) return data;
          if (Array.isArray(data.items)) return data.items;
          if (Array.isArray(data.users)) return data.users;
          if (Array.isArray(data.data)) return data.data;
          return [];
        };

        const rawMovies   = normalise(mRes);
        const rawBookings = normalise(bRes);
        const rawUsers    = normalise(uRes);

        const normMovies = rawMovies.map((m) => ({
          id:        m._id || m.id || "",
          title:     m.title || m.movieName || "Untitled",
          basePrice: Number(m.basePrice || m.price || 0) || 0,
        }));

        const normBookings = rawBookings.map((b) => {
          const movieId    = b.movieId || (b.movie && (b.movie.id || b.movie._id)) || "";
          const movieTitle = (b.movie && (b.movie.title || b.movie.movieName)) || b.movieName || "";
          const seats      = Array.isArray(b.seats)
            ? b.seats.map((s) => typeof s === "string" ? s : (s && (s.seatId || s.id)) || "").filter(Boolean)
            : [];
          const totalPaid  = Number(
            b.amountPaise !== undefined && b.amountPaise !== null
              ? Number(b.amountPaise) / 100
              : b.amount || b.total || 0
          ) || 0;
          return {
            id:         b._id || b.id || "",
            movieId,
            movieTitle,
            seats,
            totalPaid,
            userId:     b.userId || "",
            customer:   b.customer || "",
            createdAt:  b.createdAt || null,
            raw:        b,
          };
        }).filter((bk) => {
          const raw = bk.raw || {};
          const ps  = (raw.paymentStatus || "").toLowerCase();
          const st  = (raw.status || "").toLowerCase();
          return ps === "paid" || st === "paid" || Number(bk.totalPaid) > 0;
        });

        const normUsers = rawUsers.map((u) => ({
          id:        u._id || u.id || "",
          name:      u.fullName || u.name || u.userName || "",
          createdAt: u.createdAt || null,
        }));

        if (!cancelled) {
          setMovies(normMovies);
          setBookings(normBookings);
          setUsers(normUsers);
          setLoading(false);
        }
      } catch (err) {
        console.error("dashboard fetch error:", err);
        if (!cancelled) setLoading(false);
      }
    }
    fetchAll();
    return () => { cancelled = true; };
  }, []);

  const summary = useMemo(() => {
    const totalBookings = bookings.length;
    let totalRevenue    = 0;
    for (let i = 0; i < bookings.length; i++) totalRevenue += bookings[i].totalPaid || 0;

    const totalUsers = users.length || new Set(bookings.map(b => b.userId || b.customer).filter(Boolean)).size;

    // Per-movie stats
    const movieTitleMap = {};
    for (const m of movies) if (m.id) movieTitleMap[m.id] = m.title;

    const map = {};
    for (const bk of bookings) {
      const key   = bk.movieId || bk.movieTitle || "unknown";
      const title = movieTitleMap[bk.movieId] || bk.movieTitle || "Unknown";
      if (!map[key]) map[key] = { id: key, title, bookings: 0, earnings: 0 };
      map[key].bookings += 1;
      map[key].earnings += bk.totalPaid || 0;
    }
    const movieStats = Object.values(map).sort((a, b) => b.bookings - a.bookings);

    // Monthly revenue data (last 6 months)
    const now       = new Date();
    const months    = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push({
        name:     d.toLocaleString("en-IN", { month: "short" }),
        year:     d.getFullYear(),
        month:    d.getMonth(),
        revenue:  0,
        bookings: 0,
      });
    }

    for (const bk of bookings) {
      if (!bk.createdAt) continue;
      const d = new Date(bk.createdAt);
      const m = months.find(m => m.month === d.getMonth() && m.year === d.getFullYear());
      if (m) { m.revenue += bk.totalPaid || 0; m.bookings += 1; }
    }

    // Top 5 movies for pie chart
    const topMovies = movieStats.slice(0, 5).map((m, i) => ({
      name:  m.title.length > 15 ? m.title.slice(0, 15) + "..." : m.title,
      value: m.bookings,
      color: COLORS[i % COLORS.length],
    }));

    // Average ticket price
    const avgTicket = totalBookings > 0 ? Math.round(totalRevenue / totalBookings) : 0;

    return { totalBookings, totalRevenue, totalUsers, movieStats, months, topMovies, avgTicket };
  }, [movies, bookings, users]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(220,38,38,0.3)", borderTop: "3px solid #dc2626", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#8890a4" }}>Loading analytics...</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={fontStyles2.cinzelFont} className={styles3.dashboardPageContainer}>
      <div className={styles3.maxWidthContainer}>

        {/* Header */}
        <header className={styles3.dashboardHeaderContainer}>
          <div>
            <h1 className={styles3.dashboardTitle}>Analytics Dashboard</h1>
            <p className={styles3.dashboardSubtitle}>Overview of bookings, revenue and performance</p>
          </div>
        </header>

        {/* ── KPI Cards ── */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Revenue",    value: fmtINR(summary.totalRevenue), icon: DollarSign, color: "#e63946", note: "From paid bookings" },
            { label: "Total Bookings",   value: summary.totalBookings,         icon: Ticket,     color: "#2a9d8f", note: "Confirmed & paid" },
            { label: "Total Users",      value: summary.totalUsers,            icon: Users,      color: "#6c63ff", note: "Registered users" },
            { label: "Avg Ticket Price", value: fmtINR(summary.avgTicket),    icon: TrendingUp, color: "#f4a261", note: "Per booking" },
            { label: "Total Movies",     value: movies.length,                 icon: Film,       color: "#457b9d", note: "In catalog" },
          ].map((kpi) => (
            <div
              key={kpi.label}
              style={{ background: "linear-gradient(135deg,#1a1e2a,#13161e)", border: `1px solid ${kpi.color}30`, borderRadius: "16px", padding: "20px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                <div style={{ background: `${kpi.color}15`, borderRadius: "10px", padding: "8px" }}>
                  <kpi.icon size={20} color={kpi.color} />
                </div>
                <ArrowUp size={14} color="#4ade80" />
              </div>
              <div style={{ color: "#fff", fontSize: "26px", fontWeight: "800", marginBottom: "4px" }}>{kpi.value}</div>
              <div style={{ color: kpi.color, fontSize: "12px", fontWeight: "600", marginBottom: "2px" }}>{kpi.label}</div>
              <div style={{ color: "#6b7280", fontSize: "11px" }}>{kpi.note}</div>
            </div>
          ))}
        </section>

        {/* ── Charts Row ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>

          {/* Monthly Revenue Bar Chart */}
          <div style={{ background: "linear-gradient(135deg,#1a1e2a,#13161e)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <TrendingUp size={18} color="#e63946" />
              <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: "700", margin: 0 }}>Monthly Revenue</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={summary.months} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#8890a4", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8890a4", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? (v/1000).toFixed(0)+"k" : v}`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#e63946" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Bookings Line Chart */}
          <div style={{ background: "linear-gradient(135deg,#1a1e2a,#13161e)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <Ticket size={18} color="#2a9d8f" />
              <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: "700", margin: 0 }}>Monthly Bookings</h3>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={summary.months} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" tick={{ fill: "#8890a4", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#8890a4", fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<BookingTooltip />} />
                <Line type="monotone" dataKey="bookings" stroke="#2a9d8f" strokeWidth={3} dot={{ fill: "#2a9d8f", r: 5 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </section>

        {/* ── Pie Chart + Top Movies ── */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>

          {/* Pie Chart — Top Movies by bookings */}
          <div style={{ background: "linear-gradient(135deg,#1a1e2a,#13161e)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <Award size={18} color="#6c63ff" />
              <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: "700", margin: 0 }}>Top Movies by Bookings</h3>
            </div>
            {summary.topMovies.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={summary.topMovies}
                    cx="50%" cy="50%"
                    innerRadius={55} outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {summary.topMovies.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} bookings`, "Bookings"]} contentStyle={{ background: "#1a1e2a", border: "1px solid #252a38", borderRadius: "8px", color: "#fff" }} />
                  <Legend
                    formatter={(value) => <span style={{ color: "#d1d5db", fontSize: "11px" }}>{value}</span>}
                    iconSize={10}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "220px", color: "#6b7280" }}>No booking data yet</div>
            )}
          </div>

          {/* Top Movies Table */}
          <div style={{ background: "linear-gradient(135deg,#1a1e2a,#13161e)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
              <Film size={18} color="#f4a261" />
              <h3 style={{ color: "#fff", fontSize: "15px", fontWeight: "700", margin: 0 }}>Movies Performance</h3>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {summary.movieStats.slice(0, 5).map((m, i) => (
                <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: COLORS[i % COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: "700", flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: "#fff", fontSize: "12px", fontWeight: "600", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{m.title}</div>
                    <div style={{ display: "flex", gap: "12px", marginTop: "2px" }}>
                      <span style={{ color: "#8890a4", fontSize: "11px" }}>{m.bookings} bookings</span>
                      <span style={{ color: "#4ade80", fontSize: "11px", fontWeight: "600" }}>{fmtINR(m.earnings)}</span>
                    </div>
                    {/* Progress bar */}
                    <div style={{ marginTop: "4px", height: "3px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${Math.min(100, (m.bookings / (summary.movieStats[0]?.bookings || 1)) * 100)}%`, background: COLORS[i % COLORS.length], borderRadius: "2px" }} />
                    </div>
                  </div>
                </div>
              ))}
              {summary.movieStats.length === 0 && (
                <div style={{ color: "#6b7280", textAlign: "center", padding: "40px 0" }}>No data yet</div>
              )}
            </div>
          </div>

        </section>

        {/* ── Full Movies Table ── */}
        <section className={styles3.moviesSection}>
          <div className={styles3.moviesHeader}>
            <h2 className={styles3.moviesTitle}>All Movies — Bookings & Earnings</h2>
            <div className={styles3.moviesCount}>{summary.movieStats.length} movies</div>
          </div>
          <div className={styles3.tableContainer}>
            <table className={styles3.table}>
              <thead>
                <tr className={styles3.tableHeader}>
                  <th className={styles3.tableHeaderCell}>#</th>
                  <th className={styles3.tableHeaderCell}>Movie</th>
                  <th className={styles3.tableHeaderCell}>Total Bookings</th>
                  <th className={styles3.tableHeaderCell}>Total Earnings</th>
                  <th className={styles3.tableHeaderCell}>Avg per Booking</th>
                </tr>
              </thead>
              <tbody>
                {summary.movieStats.map((m, i) => {
                  const avg = m.bookings ? Math.round(m.earnings / m.bookings) : 0;
                  return (
                    <tr key={m.id} className={styles3.tableRow}>
                      <td className={styles3.tableCell}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: COLORS[i % COLORS.length], display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", fontWeight: "700" }}>
                          {i + 1}
                        </div>
                      </td>
                      <td className={styles3.tableCell}>
                        <div className={styles3.tableMovieTitle}>{m.title}</div>
                      </td>
                      <td className={styles3.tableCell}>{m.bookings}</td>
                      <td className={styles3.tableEarnings}>{fmtINR(m.earnings)}</td>
                      <td className={styles3.tableAvg}>{fmtINR(avg)}</td>
                    </tr>
                  );
                })}
                {summary.movieStats.length === 0 && (
                  <tr className={styles3.tableEmpty}>
                    <td colSpan={5}>No Movies Data Yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DashboardPage;

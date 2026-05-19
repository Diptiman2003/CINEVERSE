// import React,{useEffect, useState} from 'react'
// import {bookingsPageStyles, formatTime, formatDuration} from '../assets/dummyStyles'
// import QRCode from 'qrcode';
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom';
// import{ Clock, MapPin, Film, QrCode, ChevronDown } from 'lucide-react';
// const API_BASE = "http://localhost:5000";

// function getStoredToken(){
//   return(
//     localStorage.getItem("token")||
//     localStorage.getItem("authToken")||
//     localStorage.getItem("accessToken")||
//     null
//   )
// }
// const BookingsPage = () => {
//   const [bookings, setBookings] = useState([]);
//   const [qrs, setQrs] = useState({});
//   const [expanded, setExpanded] = useState({});
//   const [scannedDetails, setScannedDetails] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

  
//   // prefer authoritative totals returned by server
//   function computeTotals(booking) {
//     // Priority 1: amountPaise on top-level or raw
//     if (booking.amountPaise !== undefined && booking.amountPaise !== null) {
//       const amt = Number(booking.amountPaise) / 100;
//       return {
//         subtotal: amt,
//         total: amt,
//         seatCount: (booking.seats || []).length || 0,
//       };
//     }
//     if (
//       booking.raw &&
//       booking.raw.amountPaise !== undefined &&
//       booking.raw.amountPaise !== null
//     ) {
//       const amt = Number(booking.raw.amountPaise) / 100;
//       return {
//         subtotal: amt,
//         total: amt,
//         seatCount: (booking.seats || []).length || 0,
//       };
//     }

//     // Priority 2: numeric amount (rupees) if provided
//     if (typeof booking.amount === "number" && booking.amount > 0) {
//       return {
//         subtotal: booking.amount,
//         total: booking.amount,
//         seatCount: (booking.seats || []).length || 0,
//       };
//     }
//     if (
//       booking.raw &&
//       typeof booking.raw.amount === "number" &&
//       booking.raw.amount > 0
//     ) {
//       return {
//         subtotal: booking.raw.amount,
//         total: booking.raw.amount,
//         seatCount: (booking.seats || []).length || 0,
//       };
//     }

//     // Fallback: sum per-seat prices (if seat objects have .price)
//     const seats = Array.isArray(booking.seats) ? booking.seats : [];
//     const subtotal = seats.reduce((s, seat) => {
//       if (!seat) return s;
//       if (typeof seat === "object" && typeof seat.price === "number")
//         return s + seat.price;
//       // fallback: assume seat is string -> cannot compute -> 0
//       return s;
//     }, 0);
//     return { subtotal, total: subtotal, seatCount: seats.length };
//   }

//   //fetch function
//   useEffect(()=>{
//     let mounted = true;
//     async function fetchMyBookings(){
//       setLoading(true);
//       setError("");
//       try {
//         const token = getStoredToken();
//         if(!token){
//           navigate('/login');
//           return;
//         }
//         let res;
//         try {
//           res = await axios.get(`${API_BASE}/api/bookings/my`,{
//             headers:{ Authorization:`Bearer ${token}`},
//             timeout:15000,
//           });
//         }
//         catch(err){
//         res = await axios.get(`${API_BASE}/api/bookings`,{
//             headers:{ Authorization:`Bearer ${token}`},
//             timeout:15000,
//           });
//         }
//          const data = res?.data || {};
//         let items = [];
//         if (Array.isArray(data)) items = data;
//         else if (Array.isArray(data.items)) items = data.items;
//         else if (Array.isArray(data.bookings)) items = data.bookings;
//         else if (Array.isArray(data.data)) items = data.data;
//         else if (data.item && Array.isArray(data.item)) items = data.item;
//         else if (data.items && Array.isArray(data.items)) items = data.items;
//         else if (data && data._id) items = [data];

//         const normalized = items.map((b) => {
//           const id = b._id || b.id || b.bookingId || String(b.id || "");
//           const movie = b.movie || {};
//           const title =
//             movie.title || movie.name || b.movieName || b.title || "Untitled";
//           const poster = movie.poster || b.poster || movie.image || "";
//           const category = movie.category || b.category || "";
//           const durationMins =
//             movie.durationMins ?? movie.duration ?? b.durationMins ?? 0;
//           const slotTime = b.showtime || b.slotTime || b.slot || null;
//           const auditorium = b.auditorium || b.audi || "Audi 1";

//           // seats: normalize string/object
//           const seats =
//             Array.isArray(b.seats) && b.seats.length
//               ? b.seats.map((s) =>
//                   typeof s === "string"
//                     ? { id: s }
//                     : {
//                         id: s.seatId || s.id || s.name || "",
//                         type: s.type,
//                         price:
//                           typeof s.price === "number" ? s.price : undefined,
//                       }
//                 )
//               : [];

//           // top-level amount in rupees if present
//           let amount = 0;
//           if (b.amountPaise !== undefined && b.amountPaise !== null) {
//             amount = Number(b.amountPaise) / 100;
//           } else if (typeof b.amount === "number") {
//             amount = b.amount;
//           } else if (typeof b.total === "number") {
//             amount = b.total;
//           }

//           return {
//             id,
//             title,
//             poster,
//             category,
//             durationMins,
//             slotTime,
//             auditorium,
//             seats,
//             amount,
//             amountPaise: b.amountPaise,
//             raw: b,
//           };
//         });

//         if (mounted) setBookings(normalized);

//       }catch (err) {
//         console.error("Failed to load bookings:", err);
//         const status = err?.response?.status;
//         if (status === 401 || status === 403) {
//           localStorage.removeItem("token");
//           navigate("/login");
//           return;
//         }
//         if (mounted) {
//           setError(
//             err?.response?.data?.message ||
//               err.message ||
//               "Failed to load bookings"
//           );
//         }
//       } finally {
//         if (mounted) setLoading(false);
//       }
//     }
//      fetchMyBookings();
//     return () => {
//       mounted = false;
//     };
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

// // generate QRs for current bookings
//   useEffect(() => {
//     let mounted = true;
//     const makeQrs = async () => {
//       const map = {};
//       for (const b of bookings) {
//         const seatsList = (b.seats || [])
//           .map((s) => (typeof s === "string" ? s : s.id || ""))
//           .filter(Boolean);
//         const payload = JSON.stringify({
//           bookingId: b.id,
//           title: b.title,
//           time: formatTime(b.slotTime),
//           auditorium: b.auditorium,
//           seats: seatsList,
//         });
//         try {
//           const url = await QRCode.toDataURL(payload, {
//             errorCorrectionLevel: "M",
//             margin: 1,
//             scale: 6,
//           });
//           map[b.id] = { url, payload };
//         } catch (e) {
//           console.error("QR error for", b.id, e);
//           map[b.id] = { url: "", payload };
//         }
//       }
//       if (mounted) setQrs(map);
//     };
//     if (bookings.length) makeQrs();
//     return () => {
//       mounted = false;
//     };
//   }, [bookings]);
  
//   //to toggle
//   const toggle = (id)=>setExpanded((prev)=>({
//    ...prev,
//    [id]: !prev[id],
//   }))


// //to scan the QR and get details
//   const handleQrScan = (bookingId) => {
//     const entry = qrs[bookingId];
//     if (!entry || !entry.payload) return;
//     try {
//       const parsed = JSON.parse(entry.payload);
//       setExpanded((prev) => ({ ...prev, [bookingId]: true }));
//       const el = document.getElementById(`booking-card-${bookingId}`);
//       if (el && el.scrollIntoView)
//         el.scrollIntoView({ behavior: "smooth", block: "center" });
//       setScannedDetails({ bookingId, ...parsed });
//     } catch (e) {
//       console.error("Failed to parse QR payload", e);
//     }
//   };

//   const  closeModal=()=> setScannedDetails(null);


//   return (
//     <div className={bookingsPageStyles.pageContainer}>
//       <div className={bookingsPageStyles.mainContainer}>
//         <header className={bookingsPageStyles.header}>
//         <h1 className={bookingsPageStyles.title}>Your Tickets</h1>
//         <div className={bookingsPageStyles.subtitle}>Present QR at entry</div>
//         </header>
//         {loading && (
//           <div className={bookingsPageStyles.loading}>Loading Bookings...</div>
//         )}
//          {!loading && error && (
//           <div className={bookingsPageStyles.error}>{error}</div>
//         )}
//         <div className={bookingsPageStyles.grid}>
//           {bookings.length === 0 && !loading ? (
//             <div className={bookingsPageStyles.noBookings}>
//               No Bookings found.
//             </div>
//           ):(
//             bookings.map((b)=>{
//             const totals = computeTotals(b);
//             const isOpen = !!expanded[b.id];

          
//               return (
//                 <article
//                   id={`booking-card-${b.id}`}
//                   key={b.id}
//                   className={bookingsPageStyles.bookingCard}
//                   aria-labelledby={`booking-${b.id}-title`}
//                 >
//                   <div className={bookingsPageStyles.cardContent}>
//                     <div className={bookingsPageStyles.posterContainer}>
//                       <img
//                         src={b.poster || ""}
//                         alt={b.title}
//                         className={bookingsPageStyles.poster}
//                       />
//                     </div>

//                     <div className={bookingsPageStyles.cardInfo}>
//                       <div className={bookingsPageStyles.cardHeader}>
//                         <div>
//                           <h2
//                             id={`booking-${b.id}-title`}
//                             className={bookingsPageStyles.movieTitle}
//                           >
//                             <Film className={bookingsPageStyles.movieIcon} />
//                             <span>{b.title}</span>
//                           </h2>

//                           <div className={bookingsPageStyles.bookingId}>
//                             Booking ID:{" "}
//                             <span className={bookingsPageStyles.bookingIdText}>
//                               {b.id}
//                             </span>
//                           </div>
//                         </div>

//                         <div className={bookingsPageStyles.category}>
//                           <div className="hidden lg:block">{b.category}</div>
//                         </div>
//                       </div>

//                       <div className={bookingsPageStyles.details}>
//                         <div className={bookingsPageStyles.timeContainer}>
//                           <Clock className={bookingsPageStyles.timeIcon} />
//                           <div>{formatTime(b.slotTime)}</div>
//                         </div>

//                         <div className={bookingsPageStyles.locationContainer}>
//                           <MapPin className={bookingsPageStyles.locationIcon} />
//                           <div className={bookingsPageStyles.locationText}>{b.auditorium}</div>
//                         </div>
//                       </div>

//                       <div className={bookingsPageStyles.durationLabel}>Duration</div>
//                       <div className={bookingsPageStyles.duration}>
//                         {formatDuration(b.durationMins)}
//                       </div>
//                     </div>
//                   </div>

//                   <div className={bookingsPageStyles.summary}>
//                     <div className={bookingsPageStyles.seatsLabel}>
//                       Seats ({totals.seatCount})
//                     </div>
//                     <div className={bookingsPageStyles.total}>
//                       ₹{totals.total.toLocaleString("en-IN")}
//                     </div>
//                   </div>

//                   <div
//                     className={`${bookingsPageStyles.expandedDetails} ${
//                       isOpen ? bookingsPageStyles.expandedOpen : bookingsPageStyles.expandedClosed
//                     }`}
//                     aria-hidden={!isOpen}
//                   >
//                     <div className={bookingsPageStyles.seatsSection}>
//                       <div className={bookingsPageStyles.seatsLabelExpanded}>
//                         Seats ({totals.seatCount})
//                       </div>
//                       <div className={bookingsPageStyles.seatsContainer}>
//                         {(b.seats || []).map((s) => (
//                           <div
//                             key={s.id || s}
//                             className={bookingsPageStyles.seatItem}
//                           >
//                             <div className={bookingsPageStyles.seatId}>{s.id || s}</div>
//                             <div
//                               className={`${bookingsPageStyles.seatType} ${
//                                 s.type === "recliner"
//                                   ? bookingsPageStyles.seatTypeRecliner
//                                   : bookingsPageStyles.seatTypeStandard
//                               }`}
//                             >
//                               {s.type === "recliner" ? "Recliner" : "Standard"}
//                             </div>
//                           </div>
//                         ))}
//                       </div>
//                     </div>

//                     <div className={bookingsPageStyles.pricing}>
//                       <div className={bookingsPageStyles.subtotal}>
//                         <div>Seats subtotal</div>
//                         <div>₹{totals.subtotal.toLocaleString("en-IN")}</div>
//                       </div>

//                       <div className={bookingsPageStyles.finalTotal}>
//                         <div>Total</div>
//                         <div>₹{totals.total.toLocaleString("en-IN")}</div>
//                       </div>
//                     </div>

//                     <div className={bookingsPageStyles.qrSection}>
//                       <div className={bookingsPageStyles.qrLabel}>
//                         <QrCode className={bookingsPageStyles.qrIcon} />
//                         <div>Ticket QR</div>
//                       </div>
//                       <div className="ml-auto">
//                         {qrs[b.id] && qrs[b.id].url ? (
//                           <img
//                             src={qrs[b.id].url}
//                             alt={`${b.title} qr`}
//                             className={bookingsPageStyles.qrImage}
//                             role="button"
//                             tabIndex={0}
//                             onClick={() => handleQrScan(b.id)}
//                             onKeyDown={(e) => {
//                               if (e.key === "Enter") handleQrScan(b.id);
//                             }}
//                           />
//                         ) : (
//                           <div className={bookingsPageStyles.qrUnavailable}>
//                             QR unavailable
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   <div className={bookingsPageStyles.toggleButton}>
//                     <button
//                       onClick={() => toggle(b.id)}
//                       aria-expanded={isOpen}
//                       className={bookingsPageStyles.detailsButton}
//                     >
//                       <span>{isOpen ? "Hide details" : "View details"}</span>
//                       <ChevronDown
//                         className={`${bookingsPageStyles.chevron} ${
//                           isOpen ? bookingsPageStyles.chevronOpen : bookingsPageStyles.chevronClosed
//                         }`}
//                       />
//                     </button>
//                   </div>
//                 </article>
//               );
//             })
//           )}
//         </div>
//       </div>
//       {/*scanner details*/}
      
// {scannedDetails && (
//         <div
//           className={bookingsPageStyles.modalOverlay}
//           aria-modal="true"
//           role="dialog"
//         >
//           <div
//             className={bookingsPageStyles.modalBackdrop}
//             onClick={closeModal}
//             aria-hidden="true"
//           />
//           <div className={bookingsPageStyles.modalContent}>
//             <div className={bookingsPageStyles.modalHeader}>
//               <div>
//                 <h3 className={bookingsPageStyles.modalTitle}>
//                   {scannedDetails.title}
//                 </h3>
//                 <div className={bookingsPageStyles.modalBookingId}>
//                   Booking ID:{" "}
//                   <span className={bookingsPageStyles.modalIdText}>
//                     {scannedDetails.bookingId}
//                   </span>
//                 </div>
//                 <div className={bookingsPageStyles.modalDetails}>
//                   <div>
//                     <strong>Time:</strong> {scannedDetails.time}
//                   </div>
//                   <div>
//                     <strong>Auditorium:</strong> {scannedDetails.auditorium}
//                   </div>
//                   <div className="mt-2">
//                     <strong>Seats:</strong>{" "}
//                     {Array.isArray(scannedDetails.seats)
//                       ? scannedDetails.seats.join(", ")
//                       : scannedDetails.seats}
//                   </div>
//                 </div>
//               </div>

//               <button
//                 onClick={closeModal}
//                 className={bookingsPageStyles.modalCloseButton}
//                 aria-label="Close scanned details"
//               >
//                 <X className={bookingsPageStyles.modalCloseIcon} />
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default BookingsPage
import React, { useEffect, useState } from 'react'
import { bookingsPageStyles, formatTime, formatDuration } from '../assets/dummyStyles'
import QRCode from 'qrcode';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, Film, QrCode, ChevronDown, Download } from 'lucide-react';

const API_BASE = "http://localhost:5000";

function getStoredToken() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    null
  )
}

// ── PDF Download Function ──────────────────────────────────────────────────
async function downloadTicketPDF(booking, qrUrl, totals) {
  // Dynamically import jsPDF
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const W = 210; // A4 width mm
  const pageH = 297;

  // ── Background ──
  doc.setFillColor(13, 15, 20); // dark bg
  doc.rect(0, 0, W, pageH, "F");

  // ── Top Red Banner ──
  doc.setFillColor(220, 38, 38);
  doc.rect(0, 0, W, 22, "F");

  // ── Logo Text ──
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  doc.text("🎬 CINEVERSE", 14, 14);

  // ── E-TICKET label ──
  doc.setFontSize(10);
  doc.setTextColor(255, 200, 200);
  doc.text("E-TICKET / DIGITAL PASS", W - 14, 9, { align: "right" });
  doc.setFontSize(8);
  doc.text("Present this ticket at the cinema entrance", W - 14, 15, { align: "right" });

  // ── Movie Title ──
  doc.setFillColor(26, 30, 42);
  doc.rect(0, 22, W, 28, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(booking.title || "Movie", 14, 36);
  if (booking.category) {
    doc.setFontSize(10);
    doc.setTextColor(220, 38, 38);
    doc.text(booking.category.toUpperCase(), 14, 44);
  }

  // ── Dashed separator ──
  doc.setDrawColor(255, 255, 255, 0.2);
  doc.setLineDashPattern([3, 2], 0);
  doc.line(14, 55, W - 14, 55);
  doc.setLineDashPattern([], 0);

  // ── Booking Details Grid ──
  const details = [
    { label: "Booking ID",  value: booking.id || "N/A" },
    { label: "Show Time",   value: formatTime(booking.slotTime) || "N/A" },
    { label: "Auditorium",  value: booking.auditorium || "N/A" },
    { label: "Duration",    value: formatDuration(booking.durationMins) || "N/A" },
    { label: "Seats",       value: (booking.seats || []).map(s => typeof s === "string" ? s : s.id || "").filter(Boolean).join(", ") || "N/A" },
    { label: "Total Amount",value: `Rs. ${totals.total.toLocaleString("en-IN")}` },
  ];

  let y = 65;
  details.forEach((d, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = col === 0 ? 14 : W / 2 + 5;
    const yPos = y + row * 22;

    // Card bg
    doc.setFillColor(30, 35, 50);
    doc.roundedRect(x, yPos - 5, W / 2 - 20, 18, 2, 2, "F");

    // Label
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 160, 180);
    doc.text(d.label.toUpperCase(), x + 4, yPos + 1);

    // Value
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    // Truncate long text
    const val = d.value.length > 28 ? d.value.substring(0, 25) + "..." : d.value;
    doc.text(val, x + 4, yPos + 9);
  });

  // ── Seat Details Table ──
  const tableY = y + Math.ceil(details.length / 2) * 22 + 8;

  doc.setFillColor(220, 38, 38, 0.2);
  doc.setFillColor(40, 20, 20);
  doc.rect(14, tableY, W - 28, 8, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(220, 38, 38);
  doc.text("SEAT", 18, tableY + 5.5);
  doc.text("TYPE", 60, tableY + 5.5);
  doc.text("PRICE", 110, tableY + 5.5);

  const seats = Array.isArray(booking.seats) ? booking.seats : [];
  seats.forEach((s, i) => {
    const sY = tableY + 10 + i * 9;
    if (sY > pageH - 50) return; // avoid overflow
    doc.setFillColor(i % 2 === 0 ? 26 : 30, i % 2 === 0 ? 30 : 35, i % 2 === 0 ? 42 : 50);
    doc.rect(14, sY - 1, W - 28, 8, "F");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(220, 220, 220);
    doc.text(String(typeof s === "string" ? s : s.id || ""), 18, sY + 5);
    doc.text(String(typeof s === "object" ? (s.type || "Standard") : "Standard"), 60, sY + 5);
    doc.text(
      typeof s === "object" && s.price ? `Rs. ${s.price}` : "-",
      110, sY + 5
    );
  });

  // ── QR Code ──
  const qrY = tableY + 10 + seats.length * 9 + 10;
  if (qrUrl && qrY < pageH - 60) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(W / 2 - 25, qrY, 50, 50, 3, 3, "F");
    doc.addImage(qrUrl, "PNG", W / 2 - 23, qrY + 2, 46, 46);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 160, 180);
    doc.text("Scan QR at cinema entrance", W / 2, qrY + 56, { align: "center" });
  }

  // ── Bottom strip ──
  doc.setFillColor(220, 38, 38);
  doc.rect(0, pageH - 16, W, 16, "F");
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Thank you for booking with CINEVERSE! Enjoy your movie 🎬", W / 2, pageH - 7, { align: "center" });

  // ── Save PDF ──
  const fileName = `CineVerse_Ticket_${(booking.title || "Movie").replace(/\s+/g, "_")}_${booking.id?.slice(-6) || "ticket"}.pdf`;
  doc.save(fileName);
}

// ─────────────────────────────────────────────────────────────────────────────

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [qrs, setQrs] = useState({});
  const [expanded, setExpanded] = useState({});
  const [scannedDetails, setScannedDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState({});
  const navigate = useNavigate();

  function computeTotals(booking) {
    if (booking.amountPaise !== undefined && booking.amountPaise !== null) {
      const amt = Number(booking.amountPaise) / 100;
      return { subtotal: amt, total: amt, seatCount: (booking.seats || []).length || 0 };
    }
    if (booking.raw && booking.raw.amountPaise !== undefined && booking.raw.amountPaise !== null) {
      const amt = Number(booking.raw.amountPaise) / 100;
      return { subtotal: amt, total: amt, seatCount: (booking.seats || []).length || 0 };
    }
    if (typeof booking.amount === "number" && booking.amount > 0) {
      return { subtotal: booking.amount, total: booking.amount, seatCount: (booking.seats || []).length || 0 };
    }
    if (booking.raw && typeof booking.raw.amount === "number" && booking.raw.amount > 0) {
      return { subtotal: booking.raw.amount, total: booking.raw.amount, seatCount: (booking.seats || []).length || 0 };
    }
    const seats = Array.isArray(booking.seats) ? booking.seats : [];
    const subtotal = seats.reduce((s, seat) => {
      if (!seat) return s;
      if (typeof seat === "object" && typeof seat.price === "number") return s + seat.price;
      return s;
    }, 0);
    return { subtotal, total: subtotal, seatCount: seats.length };
  }

  useEffect(() => {
    let mounted = true;
    async function fetchMyBookings() {
      setLoading(true);
      setError("");
      try {
        const token = getStoredToken();
        if (!token) { navigate('/login'); return; }
        let res;
        try {
          res = await axios.get(`${API_BASE}/api/bookings/my`, { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 });
        } catch (err) {
          res = await axios.get(`${API_BASE}/api/bookings`, { headers: { Authorization: `Bearer ${token}` }, timeout: 15000 });
        }
        const data = res?.data || {};
        let items = [];
        if (Array.isArray(data)) items = data;
        else if (Array.isArray(data.items)) items = data.items;
        else if (Array.isArray(data.bookings)) items = data.bookings;
        else if (Array.isArray(data.data)) items = data.data;
        else if (data.item && Array.isArray(data.item)) items = data.item;
        else if (data.items && Array.isArray(data.items)) items = data.items;
        else if (data && data._id) items = [data];

        const normalized = items.map((b) => {
          const id = b._id || b.id || b.bookingId || String(b.id || "");
          const movie = b.movie || {};
          const title = movie.title || movie.name || b.movieName || b.title || "Untitled";
          const poster = movie.poster || b.poster || movie.image || "";
          const category = movie.category || b.category || "";
          const durationMins = movie.durationMins ?? movie.duration ?? b.durationMins ?? 0;
          const slotTime = b.showtime || b.slotTime || b.slot || null;
          const auditorium = b.auditorium || b.audi || "Audi 1";
          const seats = Array.isArray(b.seats) && b.seats.length
            ? b.seats.map((s) => typeof s === "string" ? { id: s } : { id: s.seatId || s.id || s.name || "", type: s.type, price: typeof s.price === "number" ? s.price : undefined })
            : [];
          let amount = 0;
          if (b.amountPaise !== undefined && b.amountPaise !== null) amount = Number(b.amountPaise) / 100;
          else if (typeof b.amount === "number") amount = b.amount;
          else if (typeof b.total === "number") amount = b.total;
          return { id, title, poster, category, durationMins, slotTime, auditorium, seats, amount, amountPaise: b.amountPaise, raw: b };
        });

        if (mounted) setBookings(normalized);
      } catch (err) {
        console.error("Failed to load bookings:", err);
        const status = err?.response?.status;
        if (status === 401 || status === 403) { localStorage.removeItem("token"); navigate("/login"); return; }
        if (mounted) setError(err?.response?.data?.message || err.message || "Failed to load bookings");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchMyBookings();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    const makeQrs = async () => {
      const map = {};
      for (const b of bookings) {
        const seatsList = (b.seats || []).map((s) => (typeof s === "string" ? s : s.id || "")).filter(Boolean);
        const payload = JSON.stringify({ bookingId: b.id, title: b.title, time: formatTime(b.slotTime), auditorium: b.auditorium, seats: seatsList });
        try {
          const url = await QRCode.toDataURL(payload, { errorCorrectionLevel: "M", margin: 1, scale: 6 });
          map[b.id] = { url, payload };
        } catch (e) {
          map[b.id] = { url: "", payload };
        }
      }
      if (mounted) setQrs(map);
    };
    if (bookings.length) makeQrs();
    return () => { mounted = false; };
  }, [bookings]);

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const handleQrScan = (bookingId) => {
    const entry = qrs[bookingId];
    if (!entry || !entry.payload) return;
    try {
      const parsed = JSON.parse(entry.payload);
      setExpanded((prev) => ({ ...prev, [bookingId]: true }));
      const el = document.getElementById(`booking-card-${bookingId}`);
      if (el && el.scrollIntoView) el.scrollIntoView({ behavior: "smooth", block: "center" });
      setScannedDetails({ bookingId, ...parsed });
    } catch (e) { console.error("Failed to parse QR payload", e); }
  };

  const closeModal = () => setScannedDetails(null);

  // ── Handle PDF Download ──
  const handleDownload = async (booking) => {
    setDownloading((prev) => ({ ...prev, [booking.id]: true }));
    try {
      const qrUrl = qrs[booking.id]?.url || "";
      const totals = computeTotals(booking);
      await downloadTicketPDF(booking, qrUrl, totals);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setDownloading((prev) => ({ ...prev, [booking.id]: false }));
    }
  };

  return (
    <div className={bookingsPageStyles.pageContainer}>
      <div className={bookingsPageStyles.mainContainer}>
        <header className={bookingsPageStyles.header}>
          <h1 className={bookingsPageStyles.title}>Your Tickets</h1>
          <div className={bookingsPageStyles.subtitle}>Present QR at entry</div>
        </header>

        {loading && <div className={bookingsPageStyles.loading}>Loading Bookings...</div>}
        {!loading && error && <div className={bookingsPageStyles.error}>{error}</div>}

        <div className={bookingsPageStyles.grid}>
          {bookings.length === 0 && !loading ? (
            <div className={bookingsPageStyles.noBookings}>No Bookings found.</div>
          ) : (
            bookings.map((b) => {
              const totals = computeTotals(b);
              const isOpen = !!expanded[b.id];
              const isDownloading = !!downloading[b.id];

              return (
                <article
                  id={`booking-card-${b.id}`}
                  key={b.id}
                  className={bookingsPageStyles.bookingCard}
                  aria-labelledby={`booking-${b.id}-title`}
                >
                  <div className={bookingsPageStyles.cardContent}>
                    <div className={bookingsPageStyles.posterContainer}>
                      <img src={b.poster || ""} alt={b.title} className={bookingsPageStyles.poster} />
                    </div>

                    <div className={bookingsPageStyles.cardInfo}>
                      <div className={bookingsPageStyles.cardHeader}>
                        <div>
                          <h2 id={`booking-${b.id}-title`} className={bookingsPageStyles.movieTitle}>
                            <Film className={bookingsPageStyles.movieIcon} />
                            <span>{b.title}</span>
                          </h2>
                          <div className={bookingsPageStyles.bookingId}>
                            Booking ID: <span className={bookingsPageStyles.bookingIdText}>{b.id}</span>
                          </div>
                        </div>
                        <div className={bookingsPageStyles.category}>
                          <div className="hidden lg:block">{b.category}</div>
                        </div>
                      </div>

                      <div className={bookingsPageStyles.details}>
                        <div className={bookingsPageStyles.timeContainer}>
                          <Clock className={bookingsPageStyles.timeIcon} />
                          <div>{formatTime(b.slotTime)}</div>
                        </div>
                        <div className={bookingsPageStyles.locationContainer}>
                          <MapPin className={bookingsPageStyles.locationIcon} />
                          <div className={bookingsPageStyles.locationText}>{b.auditorium}</div>
                        </div>
                      </div>

                      <div className={bookingsPageStyles.durationLabel}>Duration</div>
                      <div className={bookingsPageStyles.duration}>{formatDuration(b.durationMins)}</div>
                    </div>
                  </div>

                  <div className={bookingsPageStyles.summary}>
                    <div className={bookingsPageStyles.seatsLabel}>Seats ({totals.seatCount})</div>
                    <div className={bookingsPageStyles.total}>₹{totals.total.toLocaleString("en-IN")}</div>
                  </div>

                  <div
                    className={`${bookingsPageStyles.expandedDetails} ${isOpen ? bookingsPageStyles.expandedOpen : bookingsPageStyles.expandedClosed}`}
                    aria-hidden={!isOpen}
                  >
                    <div className={bookingsPageStyles.seatsSection}>
                      <div className={bookingsPageStyles.seatsLabelExpanded}>Seats ({totals.seatCount})</div>
                      <div className={bookingsPageStyles.seatsContainer}>
                        {(b.seats || []).map((s) => (
                          <div key={s.id || s} className={bookingsPageStyles.seatItem}>
                            <div className={bookingsPageStyles.seatId}>{s.id || s}</div>
                            <div className={`${bookingsPageStyles.seatType} ${s.type === "recliner" ? bookingsPageStyles.seatTypeRecliner : bookingsPageStyles.seatTypeStandard}`}>
                              {s.type === "recliner" ? "Recliner" : "Standard"}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className={bookingsPageStyles.pricing}>
                      <div className={bookingsPageStyles.subtotal}>
                        <div>Seats subtotal</div>
                        <div>₹{totals.subtotal.toLocaleString("en-IN")}</div>
                      </div>
                      <div className={bookingsPageStyles.finalTotal}>
                        <div>Total</div>
                        <div>₹{totals.total.toLocaleString("en-IN")}</div>
                      </div>
                    </div>

                    <div className={bookingsPageStyles.qrSection}>
                      <div className={bookingsPageStyles.qrLabel}>
                        <QrCode className={bookingsPageStyles.qrIcon} />
                        <div>Ticket QR</div>
                      </div>
                      <div className="ml-auto">
                        {qrs[b.id] && qrs[b.id].url ? (
                          <img
                            src={qrs[b.id].url}
                            alt={`${b.title} qr`}
                            className={bookingsPageStyles.qrImage}
                            role="button"
                            tabIndex={0}
                            onClick={() => handleQrScan(b.id)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleQrScan(b.id); }}
                          />
                        ) : (
                          <div className={bookingsPageStyles.qrUnavailable}>QR unavailable</div>
                        )}
                      </div>
                    </div>

                    {/* ── DOWNLOAD PDF BUTTON ── */}
                    <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                      <button
                        onClick={() => handleDownload(b)}
                        disabled={isDownloading}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                          padding: "12px",
                          borderRadius: "12px",
                          border: "none",
                          background: isDownloading
                            ? "rgba(220,38,38,0.4)"
                            : "linear-gradient(135deg, #dc2626, #b91c1c)",
                          color: "white",
                          fontWeight: "700",
                          fontSize: "14px",
                          cursor: isDownloading ? "not-allowed" : "pointer",
                          boxShadow: isDownloading ? "none" : "0 4px 15px rgba(220,38,38,0.35)",
                          transition: "all 0.2s",
                          letterSpacing: "0.03em",
                        }}
                      >
                        <Download size={16} />
                        {isDownloading ? "Generating PDF..." : "⬇️ Download E-Ticket PDF"}
                      </button>
                    </div>

                  </div>

                  <div className={bookingsPageStyles.toggleButton}>
                    <button
                      onClick={() => toggle(b.id)}
                      aria-expanded={isOpen}
                      className={bookingsPageStyles.detailsButton}
                    >
                      <span>{isOpen ? "Hide details" : "View details"}</span>
                      <ChevronDown className={`${bookingsPageStyles.chevron} ${isOpen ? bookingsPageStyles.chevronOpen : bookingsPageStyles.chevronClosed}`} />
                    </button>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </div>

      {scannedDetails && (
        <div className={bookingsPageStyles.modalOverlay} aria-modal="true" role="dialog">
          <div className={bookingsPageStyles.modalBackdrop} onClick={closeModal} aria-hidden="true" />
          <div className={bookingsPageStyles.modalContent}>
            <div className={bookingsPageStyles.modalHeader}>
              <div>
                <h3 className={bookingsPageStyles.modalTitle}>{scannedDetails.title}</h3>
                <div className={bookingsPageStyles.modalBookingId}>
                  Booking ID: <span className={bookingsPageStyles.modalIdText}>{scannedDetails.bookingId}</span>
                </div>
                <div className={bookingsPageStyles.modalDetails}>
                  <div><strong>Time:</strong> {scannedDetails.time}</div>
                  <div><strong>Auditorium:</strong> {scannedDetails.auditorium}</div>
                  <div className="mt-2">
                    <strong>Seats:</strong>{" "}
                    {Array.isArray(scannedDetails.seats) ? scannedDetails.seats.join(", ") : scannedDetails.seats}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingsPage;

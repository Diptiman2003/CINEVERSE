// // //created by ai
// // // NearestTheatres.jsx


// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import { MapPin, Phone, Star, Navigation, Loader, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

// // const API_BASE = "http://localhost:5000";

// // export default function NearestTheatres() {
// //   const [theatres, setTheatres]         = useState([]);
// //   const [loading, setLoading]           = useState(false);
// //   const [error, setError]               = useState("");
// //   const [locationStatus, setLocationStatus] = useState("idle"); // idle | loading | success | denied
// //   const [userLocation, setUserLocation] = useState(null);
// //   const [expandedId, setExpandedId]     = useState(null);
// //   const [radius, setRadius]             = useState(20); // km

// //   // Auto-detect location on mount
// //   useEffect(() => {
// //     detectLocation();
// //   }, []);

// //   // ── Detect user location ────────────────────────────────────────────────
// //   const detectLocation = () => {
// //     if (!navigator.geolocation) {
// //       setError("Geolocation is not supported by your browser.");
// //       setLocationStatus("denied");
// //       return;
// //     }

// //     setLocationStatus("loading");
// //     setError("");

// //     navigator.geolocation.getCurrentPosition(
// //       (position) => {
// //         const { latitude, longitude } = position.coords;
// //         setUserLocation({ lat: latitude, lng: longitude });
// //         setLocationStatus("success");
// //         fetchNearestTheatres(latitude, longitude, radius);
// //       },
// //       (err) => {
// //         console.error("Geolocation error:", err);
// //         setLocationStatus("denied");
// //         setError(
// //           err.code === 1
// //             ? "Location access denied. Please allow location access in your browser."
// //             : "Could not detect your location. Please try again."
// //         );
// //       },
// //       { timeout: 10000, maximumAge: 60000 }
// //     );
// //   };

// //   // ── Fetch nearest theatres from backend ─────────────────────────────────
// //   const fetchNearestTheatres = async (lat, lng, radiusKm) => {
// //     setLoading(true);
// //     setError("");
// //     try {
// //       const res = await axios.get(`${API_BASE}/api/theatres/nearest`, {
// //         params: { lat, lng, radius: radiusKm },
// //       });

// //       if (res.data.success) {
// //         setTheatres(res.data.theatres);
// //         if (res.data.theatres.length === 0) {
// //           setError(`No theatres found within ${radiusKm} km. Try increasing the radius.`);
// //         }
// //       }
// //     } catch (err) {
// //       console.error("Failed to fetch theatres:", err);
// //       setError("Failed to load theatres. Please try again.");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // ── Open Google Maps directions ─────────────────────────────────────────
// //   const openDirections = (theatre) => {
// //     const url = `https://www.google.com/maps/dir/?api=1&destination=${theatre.location.lat},${theatre.location.lng}&travelmode=driving`;
// //     window.open(url, "_blank");
// //   };

// //   // ── Open theatre on Google Maps ─────────────────────────────────────────
// //   const openOnMap = (theatre) => {
// //     const url = `https://www.google.com/maps/search/?api=1&query=${theatre.location.lat},${theatre.location.lng}`;
// //     window.open(url, "_blank");
// //   };

// //   // ── Get distance badge color ────────────────────────────────────────────
// //   const getDistanceColor = (km) => {
// //     if (km <= 3)  return { bg: "#0f4c1e", text: "#4ade80", label: "Very Close" };
// //     if (km <= 8)  return { bg: "#14532d", text: "#86efac", label: "Nearby" };
// //     if (km <= 15) return { bg: "#1c3d5a", text: "#60a5fa", label: "Moderate" };
// //     return { bg: "#3b1f1f", text: "#fca5a5", label: "Far" };
// //   };

// //   // ── Render ──────────────────────────────────────────────────────────────
// //   return (
// //     <section
// //       className="py-12 px-4"
// //       style={{ background: "linear-gradient(180deg, #0d0f14 0%, #13161e 100%)" }}
// //     >
// //       <div className="max-w-6xl mx-auto">

// //         {/* ── Section Header ── */}
// //         <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
// //           <div>
// //             <h2
// //               className="text-white text-3xl font-bold flex items-center gap-3"
// //               style={{
// //                 fontFamily: "'Cinzel', 'Times New Roman', serif",
// //                 textShadow: "0 2px 10px rgba(220, 38, 38, 0.4)",
// //               }}
// //             >
// //               <MapPin className="text-red-500" size={28} />
// //               Cinemas Near You
// //             </h2>
// //             <p className="text-gray-400 text-sm mt-1">
// //               {locationStatus === "success" && userLocation
// //                 ? `Showing theatres within ${radius} km of your location`
// //                 : "Allow location access to find nearest cinemas"}
// //             </p>
// //           </div>

// //           {/* Radius selector + Refresh */}
// //           {locationStatus === "success" && (
// //             <div className="flex items-center gap-3">
// //               <div className="flex items-center gap-2">
// //                 <label className="text-gray-400 text-sm">Radius:</label>
// //                 <select
// //                   value={radius}
// //                   onChange={(e) => {
// //                     const r = Number(e.target.value);
// //                     setRadius(r);
// //                     if (userLocation) fetchNearestTheatres(userLocation.lat, userLocation.lng, r);
// //                   }}
// //                   className="text-white text-sm px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
// //                   style={{ background: "#1a1e2a", border: "1px solid #252a38" }}
// //                 >
// //                   <option value={5}>5 km</option>
// //                   <option value={10}>10 km</option>
// //                   <option value={20}>20 km</option>
// //                   <option value={30}>30 km</option>
// //                   <option value={50}>50 km</option>
// //                 </select>
// //               </div>
// //               <button
// //                 onClick={detectLocation}
// //                 className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white transition-all"
// //                 style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)" }}
// //               >
// //                 <Navigation size={14} />
// //                 Refresh
// //               </button>
// //             </div>
// //           )}
// //         </div>

// //         {/* ── Location Denied / Idle State ── */}
// //         {(locationStatus === "idle" || locationStatus === "denied") && (
// //           <div
// //             className="text-center py-12 rounded-2xl"
// //             style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
// //           >
// //             {locationStatus === "denied" && error ? (
// //               <>
// //                 <AlertCircle className="text-red-400 mx-auto mb-3" size={40} />
// //                 <p className="text-red-400 text-sm mb-4">{error}</p>
// //               </>
// //             ) : (
// //               <MapPin className="text-gray-600 mx-auto mb-3" size={40} />
// //             )}
// //             <p className="text-gray-400 mb-5">
// //               We need your location to find the nearest cinemas
// //             </p>
// //             <button
// //               onClick={detectLocation}
// //               className="px-8 py-3 rounded-xl font-semibold text-white transition-all"
// //               style={{
// //                 background: "linear-gradient(135deg, #dc2626, #b91c1c)",
// //                 boxShadow: "0 4px 15px rgba(220,38,38,0.3)",
// //               }}
// //             >
// //               📍 Allow Location Access
// //             </button>
// //           </div>
// //         )}

// //         {/* ── Loading Location ── */}
// //         {locationStatus === "loading" && (
// //           <div className="text-center py-12">
// //             <Loader className="text-red-400 mx-auto mb-3 animate-spin" size={36} />
// //             <p className="text-gray-400">Detecting your location...</p>
// //           </div>
// //         )}

// //         {/* ── Loading Theatres ── */}
// //         {locationStatus === "success" && loading && (
// //           <div className="text-center py-12">
// //             <Loader className="text-red-400 mx-auto mb-3 animate-spin" size={36} />
// //             <p className="text-gray-400">Finding nearest cinemas...</p>
// //           </div>
// //         )}

// //         {/* ── Error ── */}
// //         {locationStatus === "success" && !loading && error && (
// //           <div
// //             className="text-center py-8 rounded-2xl"
// //             style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}
// //           >
// //             <p className="text-red-400">{error}</p>
// //           </div>
// //         )}

// //         {/* ── Theatre Cards ── */}
// //         {locationStatus === "success" && !loading && theatres.length > 0 && (
// //           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
// //             {theatres.map((theatre) => {
// //               const distColor = getDistanceColor(theatre.distanceKm);
// //               const isExpanded = expandedId === theatre._id;

// //               return (
// //                 <div
// //                   key={theatre._id}
// //                   className="rounded-2xl overflow-hidden transition-all duration-300"
// //                   style={{
// //                     background: "linear-gradient(135deg, #1a1e2a 0%, #13161e 100%)",
// //                     border: "1px solid rgba(255,255,255,0.07)",
// //                     boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
// //                   }}
// //                 >
// //                   {/* Card Header */}
// //                   <div
// //                     className="p-5"
// //                     style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
// //                   >
// //                     {/* Name + Distance */}
// //                     <div className="flex items-start justify-between gap-2 mb-3">
// //                       <h3 className="text-white font-bold text-base leading-tight">
// //                         {theatre.name}
// //                       </h3>
// //                       <span
// //                         className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
// //                         style={{ background: distColor.bg, color: distColor.text }}
// //                       >
// //                         {theatre.distanceKm} km
// //                       </span>
// //                     </div>

// //                     {/* Address */}
// //                     <div className="flex items-start gap-2 mb-2">
// //                       <MapPin className="text-red-400 flex-shrink-0 mt-0.5" size={13} />
// //                       <p className="text-gray-400 text-xs leading-relaxed">
// //                         {theatre.address}, {theatre.city}
// //                         {theatre.pincode && ` - ${theatre.pincode}`}
// //                       </p>
// //                     </div>

// //                     {/* Phone */}
// //                     {theatre.phone && (
// //                       <div className="flex items-center gap-2 mb-3">
// //                         <Phone className="text-gray-500 flex-shrink-0" size={13} />
// //                         <p className="text-gray-400 text-xs">{theatre.phone}</p>
// //                       </div>
// //                     )}

// //                     {/* Screens */}
// //                     <div className="flex flex-wrap gap-1.5 mb-3">
// //                       {theatre.screens.map((sc) => (
// //                         <span
// //                           key={sc}
// //                           className="text-xs px-2 py-0.5 rounded-full"
// //                           style={{
// //                             background: "rgba(220,38,38,0.12)",
// //                             border: "1px solid rgba(220,38,38,0.25)",
// //                             color: "#fca5a5",
// //                           }}
// //                         >
// //                           {sc}
// //                         </span>
// //                       ))}
// //                       <span
// //                         className="text-xs px-2 py-0.5 rounded-full"
// //                         style={{
// //                           background: "rgba(255,255,255,0.06)",
// //                           color: "#9ca3af",
// //                         }}
// //                       >
// //                         {theatre.totalScreens} screens
// //                       </span>
// //                     </div>

// //                     {/* Action Buttons */}
// //                     <div className="flex gap-2">
// //                       <button
// //                         onClick={() => openDirections(theatre)}
// //                         className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white transition-all"
// //                         style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
// //                       >
// //                         <Navigation size={12} />
// //                         Directions
// //                       </button>
// //                       <button
// //                         onClick={() => openOnMap(theatre)}
// //                         className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all"
// //                         style={{
// //                           background: "rgba(255,255,255,0.06)",
// //                           border: "1px solid rgba(255,255,255,0.1)",
// //                           color: "#d1d5db",
// //                         }}
// //                       >
// //                         <MapPin size={12} />
// //                         View Map
// //                       </button>
// //                     </div>
// //                   </div>

// //                   {/* Expandable Facilities */}
// //                   <button
// //                     onClick={() => setExpandedId(isExpanded ? null : theatre._id)}
// //                     className="w-full flex items-center justify-between px-5 py-3 text-xs text-gray-400 hover:text-gray-300 transition-colors"
// //                   >
// //                     <span>Facilities ({theatre.facilities.length})</span>
// //                     {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
// //                   </button>

// //                   {isExpanded && (
// //                     <div className="px-5 pb-4">
// //                       <div className="flex flex-wrap gap-1.5">
// //                         {theatre.facilities.map((f) => (
// //                           <span
// //                             key={f}
// //                             className="text-xs px-2.5 py-1 rounded-full"
// //                             style={{
// //                               background: "rgba(42,157,143,0.12)",
// //                               border: "1px solid rgba(42,157,143,0.25)",
// //                               color: "#5eead4",
// //                             }}
// //                           >
// //                             ✓ {f}
// //                           </span>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}

// //         {/* ── Results Count ── */}
// //         {locationStatus === "success" && !loading && theatres.length > 0 && (
// //           <p className="text-center text-gray-500 text-sm mt-6">
// //             Found <span className="text-white font-semibold">{theatres.length}</span> cinema
// //             {theatres.length !== 1 ? "s" : ""} within {radius} km of your location
// //           </p>
// //         )}

// //       </div>
// //     </section>
// //   );
// // }
// // NearestTheatres.jsx
// // Place in: frontend/src/components/NearestTheatres.jsx

// import React, { useState } from "react";
// import { MapPin, Phone, Navigation, Search, ChevronDown, ChevronUp } from "lucide-react";
// import axios from "axios";

// const API_BASE = "http://localhost:5000";

// // Indian cities list
// const CITIES = [
//   "Chennai", "Bangalore", "Mumbai", "Delhi", "Hyderabad",
//   "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat",
//   "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal",
//   "Visakhapatnam", "Coimbatore", "Madurai", "Kochi", "Bhubaneswar"
// ];

// export default function NearestTheatres() {
//   const [theatres, setTheatres]       = useState([]);
//   const [loading, setLoading]         = useState(false);
//   const [error, setError]             = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [searched, setSearched]       = useState(false);
//   const [expandedId, setExpandedId]   = useState(null);
//   const [searchInput, setSearchInput] = useState("");
//   const [showDropdown, setShowDropdown] = useState(false);

//   // Filter cities based on search input
//   const filteredCities = CITIES.filter(c =>
//     c.toLowerCase().includes(searchInput.toLowerCase())
//   );

//   // Fetch theatres by city name
//   const fetchTheatresByCity = async (city) => {
//     setLoading(true);
//     setError("");
//     setTheatres([]);
//     setSearched(true);
//     try {
//       const res = await axios.get(`${API_BASE}/api/theatres/city/${city}`);
//       if (res.data.success) {
//         setTheatres(res.data.theatres);
//         if (res.data.theatres.length === 0) {
//           setError(`No theatres found in ${city}. Try another city.`);
//         }
//       }
//     } catch (err) {
//       setError("Could not load theatres. Make sure backend is running.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCitySelect = (city) => {
//     setSelectedCity(city);
//     setSearchInput(city);
//     setShowDropdown(false);
//     fetchTheatresByCity(city);
//   };

//   const handleSearch = () => {
//     if (!searchInput.trim()) {
//       setError("Please enter or select a city");
//       return;
//     }
//     handleCitySelect(searchInput.trim());
//   };

//   const openDirections = (theatre) => {
//     const query = encodeURIComponent(`${theatre.name}, ${theatre.address}`);
//     window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
//   };

//   return (
//     <section
//       className="py-12 px-4"
//       style={{ background: "linear-gradient(180deg, #0d0f14 0%, #13161e 100%)" }}
//     >
//       <div className="max-w-6xl mx-auto">

//         {/* Header */}
//         <div className="mb-8">
//           <h2
//             className="text-white text-3xl font-bold flex items-center gap-3 mb-2"
//             style={{
//               fontFamily: "'Cinzel', 'Times New Roman', serif",
//               textShadow: "0 2px 10px rgba(220,38,38,0.4)",
//             }}
//           >
//             <MapPin className="text-red-500" size={28} />
//             Cinemas Near You
//           </h2>
//           <p className="text-gray-400 text-sm">
//             Search by city to find nearby cinemas
//           </p>
//         </div>

//         {/* Search Box */}
//         <div className="relative max-w-lg mb-8">
//           <div className="flex gap-3">
//             <div className="flex-1 relative">
//               <input
//                 type="text"
//                 value={searchInput}
//                 onChange={(e) => {
//                   setSearchInput(e.target.value);
//                   setShowDropdown(true);
//                 }}
//                 onFocus={() => setShowDropdown(true)}
//                 placeholder="Enter your city (e.g. Chennai, Mumbai...)"
//                 className="w-full px-4 py-3 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
//                 style={{
//                   background: "rgba(255,255,255,0.07)",
//                   border: "1px solid rgba(255,255,255,0.12)",
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === "Enter") handleSearch();
//                   if (e.key === "Escape") setShowDropdown(false);
//                 }}
//               />

//               {/* Dropdown */}
//               {showDropdown && searchInput && filteredCities.length > 0 && (
//                 <div
//                   className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden z-50"
//                   style={{
//                     background: "#1a1e2a",
//                     border: "1px solid rgba(255,255,255,0.1)",
//                     maxHeight: "200px",
//                     overflowY: "auto",
//                   }}
//                 >
//                   {filteredCities.map((city) => (
//                     <button
//                       key={city}
//                       onClick={() => handleCitySelect(city)}
//                       className="w-full text-left px-4 py-2.5 text-sm text-gray-300 hover:text-white transition-colors flex items-center gap-2"
//                       style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
//                       onMouseEnter={(e) => e.currentTarget.style.background = "rgba(220,38,38,0.15)"}
//                       onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
//                     >
//                       <MapPin size={13} className="text-red-400" />
//                       {city}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Search Button */}
//             <button
//               onClick={handleSearch}
//               disabled={loading}
//               className="px-6 py-3 rounded-xl font-semibold text-white flex items-center gap-2 transition-all"
//               style={{
//                 background: "linear-gradient(135deg, #dc2626, #b91c1c)",
//                 boxShadow: "0 4px 15px rgba(220,38,38,0.3)",
//                 opacity: loading ? 0.7 : 1,
//               }}
//             >
//               <Search size={16} />
//               {loading ? "Searching..." : "Search"}
//             </button>
//           </div>

//           {/* Quick city pills */}
//           <div className="flex flex-wrap gap-2 mt-3">
//             {["Chennai", "Bangalore", "Mumbai", "Delhi", "Bhubaneswar"].map((city) => (
//               <button
//                 key={city}
//                 onClick={() => handleCitySelect(city)}
//                 className="px-3 py-1 rounded-full text-xs font-medium transition-all"
//                 style={{
//                   background: selectedCity === city
//                     ? "rgba(220,38,38,0.3)"
//                     : "rgba(255,255,255,0.06)",
//                   border: selectedCity === city
//                     ? "1px solid rgba(220,38,38,0.5)"
//                     : "1px solid rgba(255,255,255,0.1)",
//                   color: selectedCity === city ? "#fca5a5" : "#9ca3af",
//                 }}
//               >
//                 📍 {city}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Loading */}
//         {loading && (
//           <div className="text-center py-10">
//             <div
//               className="inline-block w-10 h-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin mb-3"
//             />
//             <p className="text-gray-400">Finding cinemas in {searchInput}...</p>
//           </div>
//         )}

//         {/* Error */}
//         {!loading && error && (
//           <div
//             className="text-center py-8 rounded-2xl"
//             style={{ background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.2)" }}
//           >
//             <MapPin className="text-red-400 mx-auto mb-2" size={32} />
//             <p className="text-red-400">{error}</p>
//           </div>
//         )}

//         {/* Theatre Cards */}
//         {!loading && theatres.length > 0 && (
//           <>
//             <p className="text-gray-400 text-sm mb-4">
//               Found <span className="text-white font-semibold">{theatres.length}</span> cinema
//               {theatres.length !== 1 ? "s" : ""} in{" "}
//               <span className="text-red-400 font-semibold">{selectedCity}</span>
//             </p>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//               {theatres.map((theatre) => (
//                 <div
//                   key={theatre._id}
//                   className="rounded-2xl overflow-hidden"
//                   style={{
//                     background: "linear-gradient(135deg, #1a1e2a 0%, #13161e 100%)",
//                     border: "1px solid rgba(255,255,255,0.07)",
//                     boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
//                   }}
//                 >
//                   {/* Card top */}
//                   <div
//                     className="p-5"
//                     style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
//                   >
//                     {/* Name */}
//                     <h3 className="text-white font-bold text-base mb-3 leading-tight">
//                       🎬 {theatre.name}
//                     </h3>

//                     {/* Address */}
//                     <div className="flex items-start gap-2 mb-2">
//                       <MapPin className="text-red-400 flex-shrink-0 mt-0.5" size={13} />
//                       <p className="text-gray-400 text-xs leading-relaxed">
//                         {theatre.address}, {theatre.city}
//                         {theatre.pincode && ` - ${theatre.pincode}`}
//                       </p>
//                     </div>

//                     {/* Phone */}
//                     {theatre.phone && (
//                       <div className="flex items-center gap-2 mb-3">
//                         <Phone className="text-gray-500 flex-shrink-0" size={13} />
//                         <p className="text-gray-400 text-xs">{theatre.phone}</p>
//                       </div>
//                     )}

//                     {/* Screen types */}
//                     <div className="flex flex-wrap gap-1.5 mb-4">
//                       {(theatre.screens || []).map((sc) => (
//                         <span
//                           key={sc}
//                           className="text-xs px-2 py-0.5 rounded-full"
//                           style={{
//                             background: "rgba(220,38,38,0.12)",
//                             border: "1px solid rgba(220,38,38,0.25)",
//                             color: "#fca5a5",
//                           }}
//                         >
//                           {sc}
//                         </span>
//                       ))}
//                       {theatre.totalScreens && (
//                         <span
//                           className="text-xs px-2 py-0.5 rounded-full"
//                           style={{
//                             background: "rgba(255,255,255,0.06)",
//                             color: "#9ca3af",
//                           }}
//                         >
//                           {theatre.totalScreens} screens
//                         </span>
//                       )}
//                     </div>

//                     {/* Buttons */}
//                     <div className="flex gap-2">
//                       <button
//                         onClick={() => openDirections(theatre)}
//                         className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all"
//                         style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
//                       >
//                         <Navigation size={12} />
//                         Get Directions
//                       </button>
//                     </div>
//                   </div>

//                   {/* Expandable Facilities */}
//                   {theatre.facilities && theatre.facilities.length > 0 && (
//                     <>
//                       <button
//                         onClick={() => setExpandedId(expandedId === theatre._id ? null : theatre._id)}
//                         className="w-full flex items-center justify-between px-5 py-3 text-xs text-gray-400 hover:text-gray-300 transition-colors"
//                       >
//                         <span>Facilities ({theatre.facilities.length})</span>
//                         {expandedId === theatre._id
//                           ? <ChevronUp size={14} />
//                           : <ChevronDown size={14} />
//                         }
//                       </button>

//                       {expandedId === theatre._id && (
//                         <div className="px-5 pb-4">
//                           <div className="flex flex-wrap gap-1.5">
//                             {theatre.facilities.map((f) => (
//                               <span
//                                 key={f}
//                                 className="text-xs px-2.5 py-1 rounded-full"
//                                 style={{
//                                   background: "rgba(42,157,143,0.12)",
//                                   border: "1px solid rgba(42,157,143,0.25)",
//                                   color: "#5eead4",
//                                 }}
//                               >
//                                 ✓ {f}
//                               </span>
//                             ))}
//                           </div>
//                         </div>
//                       )}
//                     </>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </>
//         )}

//         {/* Empty state — not searched yet */}
//         {!loading && !error && !searched && (
//           <div
//             className="text-center py-12 rounded-2xl"
//             style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
//           >
//             <MapPin className="text-gray-600 mx-auto mb-3" size={40} />
//             <p className="text-gray-500 text-sm">
//               Enter your city above to find nearby cinemas 🎬
//             </p>
//           </div>
//         )}

//       </div>
//     </section>
//   );
// }

// NearestTheatres.jsx
// Place in: frontend/src/components/NearestTheatres.jsx
// NO backend needed - uses OpenStreetMap + Leaflet (100% FREE)

// 

// NearestTheatres.jsx
// Place in: frontend/src/components/NearestTheatres.jsx
// Uses browser location + Google Maps iframe — NO API KEY NEEDED!

import React, { useState } from "react";
import { MapPin, Navigation, Loader, AlertCircle } from "lucide-react";

export default function NearestTheatres() {
  const [status, setStatus]   = useState("idle"); // idle | loading | success | denied
  const [userPos, setUserPos] = useState(null);
  const [error, setError]     = useState("");

  const findCinemas = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      setStatus("denied");
      return;
    }

    setStatus("loading");
    setError("");

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setUserPos({ lat, lng });
        setStatus("success");
      },
      (err) => {
        setStatus("denied");
        if (err.code === 1) {
          setError("Location blocked! Please allow location access in your browser.");
        } else {
          setError("Could not get your location. Please try again.");
        }
      },
      { timeout: 10000, maximumAge: 0 }
    );
  };

  // Google Maps embed URL — searches cinemas near user location
  const getMapUrl = () => {
    if (!userPos) return "";
    const { lat, lng } = userPos;
    return `https://www.google.com/maps/embed/v1/search?key=AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY&q=cinema+near+me&center=${lat},${lng}&zoom=13`;
  };

  // Open Google Maps in new tab to get directions
  const openGoogleMaps = () => {
    if (!userPos) return;
    const { lat, lng } = userPos;
    window.open(
      `https://www.google.com/maps/search/cinema+near+me/@${lat},${lng},13z`,
      "_blank"
    );
  };

  return (
    <section
      className="py-12 px-4"
      style={{ background: "linear-gradient(180deg, #0d0f14 0%, #13161e 100%)" }}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h2
              className="text-white text-3xl font-bold flex items-center gap-3"
              style={{
                fontFamily: "'Cinzel', 'Times New Roman', serif",
                textShadow: "0 2px 10px rgba(220,38,38,0.4)",
              }}
            >
              <MapPin className="text-red-500" size={28} />
              Cinemas Near You
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              {status === "success"
                ? "Showing real cinemas near your location on Google Maps"
                : "Click the button to find cinemas near you"}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            {status === "success" && (
              <button
                onClick={openGoogleMaps}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all"
                style={{
                  background: "rgba(220,38,38,0.15)",
                  border: "1px solid rgba(220,38,38,0.3)",
                }}
              >
                <Navigation size={14} />
                Open in Google Maps
              </button>
            )}

            <button
              onClick={findCinemas}
              disabled={status === "loading"}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all"
              style={{
                background:
                  status === "loading"
                    ? "rgba(220,38,38,0.5)"
                    : "linear-gradient(135deg, #dc2626, #b91c1c)",
                boxShadow: "0 4px 15px rgba(220,38,38,0.3)",
                cursor: status === "loading" ? "not-allowed" : "pointer",
              }}
            >
              {status === "loading" ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Detecting...
                </>
              ) : (
                <>
                  <MapPin size={16} />
                  {status === "success" ? "Refresh Location" : "📍 Find Cinemas Near Me"}
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error message */}
        {status === "denied" && (
          <div
            className="p-5 rounded-2xl mb-6"
            style={{
              background: "rgba(220,38,38,0.08)",
              border: "1px solid rgba(220,38,38,0.25)",
            }}
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-red-400 font-medium mb-1">{error}</p>
                <p className="text-gray-400 text-sm mb-3">
                  To fix: Click the 🔒 lock icon in your browser address bar → Location → Allow → Refresh page
                </p>
                <button
                  onClick={findCinemas}
                  className="px-5 py-2 rounded-xl text-white text-sm font-semibold"
                  style={{ background: "linear-gradient(135deg, #dc2626, #b91c1c)" }}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div className="text-center py-12">
            <Loader className="text-red-400 mx-auto mb-3 animate-spin" size={40} />
            <p className="text-gray-400">Getting your location...</p>
            <p className="text-gray-600 text-sm mt-1">Please allow location access in browser popup</p>
          </div>
        )}

        {/* Google Maps Embed */}
        {status === "success" && userPos && (
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}
          >
            {/* Map info bar */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: "#4ade80" }}
                />
                <span className="text-gray-300 text-sm">
                  Location detected — showing cinemas near you
                </span>
              </div>
              <span className="text-gray-500 text-xs">
                {userPos.lat.toFixed(4)}, {userPos.lng.toFixed(4)}
              </span>
            </div>

            {/* Google Maps iframe */}
            <iframe
              title="Cinemas Near You"
              width="100%"
              height="500"
              frameBorder="0"
              style={{ display: "block" }}
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://maps.google.com/maps?q=cinema+near+me&ll=${userPos.lat},${userPos.lng}&z=13&output=embed&hl=en`}
              allowFullScreen
            />

            {/* Bottom bar */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{
                background: "rgba(255,255,255,0.03)",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <p className="text-gray-500 text-xs">
                📍 Showing cinemas near your current location
              </p>
              <button
                onClick={openGoogleMaps}
                className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-xs font-medium transition-colors"
              >
                <Navigation size={12} />
                Open Full Google Maps
              </button>
            </div>
          </div>
        )}

        {/* Idle state */}
        {status === "idle" && (
          <div
            className="text-center py-14 rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.2)" }}
            >
              <MapPin className="text-red-500" size={32} />
            </div>
            <p className="text-white font-semibold text-lg mb-2">
              Find Real Cinemas Near You
            </p>
            <p className="text-gray-500 text-sm mb-6">
              We'll show all nearby cinemas on Google Maps using your location
            </p>
            <button
              onClick={findCinemas}
              className="px-8 py-3 rounded-xl font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #dc2626, #b91c1c)",
                boxShadow: "0 4px 15px rgba(220,38,38,0.3)",
              }}
            >
              📍 Find Cinemas Near Me
            </button>
          </div>
        )}

      </div>
    </section>
  );
}





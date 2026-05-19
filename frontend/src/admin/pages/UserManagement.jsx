// UserManagement.jsx
// Place in: admin/src/pages/UserManagement.jsx

import React, { useState, useEffect } from 'react';
import Navbar from '../components/AdminNavbar';
import axios from 'axios';
import { Users, Search, Mail, Phone, Calendar, Trash2, Shield, User } from 'lucide-react';

const API_BASE = "http://localhost:5000";

const UserManagement = () => {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_BASE}/api/auth/users`);
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      setError("Failed to load users. Make sure backend is running.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user "${userName}"?`)) return;
    setDeleting(userId);
    try {
      const res = await axios.delete(`${API_BASE}/api/auth/users/${userId}`);
      if (res.data.success) {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
      }
    } catch (err) {
      alert("Failed to delete user");
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric", month: "short", year: "numeric"
      });
    } catch { return "N/A"; }
  };

  // Filter users by search
  const filtered = users.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    u.userName?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.phone?.includes(search)
  );

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f14" }}>
      <Navbar />

      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 16px" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "800", display: "flex", alignItems: "center", gap: "12px", margin: 0 }}>
              <Users color="#e63946" size={28} />
              User Management
            </h1>
            <p style={{ color: "#8890a4", fontSize: "13px", marginTop: "4px" }}>
              Total Users: <span style={{ color: "#fff", fontWeight: "600" }}>{users.length}</span>
            </p>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search size={15} color="#6b7280" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                paddingLeft: "36px", paddingRight: "16px",
                paddingTop: "10px", paddingBottom: "10px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "10px", color: "#fff",
                fontSize: "13px", outline: "none", width: "280px",
              }}
            />
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "28px" }}>
          {[
            { label: "Total Users",    value: users.length,                                          color: "#2a9d8f", icon: Users },
            { label: "This Month",     value: users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30*24*60*60*1000)).length, color: "#6c63ff", icon: Calendar },
            { label: "Search Results", value: filtered.length,                                       color: "#e63946", icon: Search },
          ].map((stat) => (
            <div key={stat.label} style={{ background: "linear-gradient(135deg,#1a1e2a,#13161e)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "14px", padding: "20px" }}>
              <stat.icon size={20} color={stat.color} style={{ marginBottom: "8px" }} />
              <div style={{ color: "#fff", fontSize: "28px", fontWeight: "800" }}>{stat.value}</div>
              <div style={{ color: "#8890a4", fontSize: "12px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "60px", color: "#8890a4" }}>
            Loading users...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div style={{ background: "rgba(220,38,38,0.1)", border: "1px solid rgba(220,38,38,0.3)", borderRadius: "12px", padding: "20px", color: "#fca5a5", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <div style={{ background: "linear-gradient(135deg,#1a1e2a,#13161e)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: "16px", overflow: "hidden" }}>

            {/* Table Header */}
            <div style={{ display: "grid", gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr 0.5fr", gap: "16px", padding: "14px 20px", background: "rgba(220,38,38,0.1)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              {["Full Name", "Email", "Phone", "Joined", "Birthday", "Action"].map((h) => (
                <div key={h} style={{ color: "#e63946", fontSize: "11px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</div>
              ))}
            </div>

            {/* Table Rows */}
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#8890a4" }}>
                <User size={40} color="#374151" style={{ margin: "0 auto 12px", display: "block" }} />
                <p>No users found</p>
              </div>
            ) : (
              filtered.map((user, index) => (
                <div
                  key={user._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 2fr 1.5fr 1fr 1fr 0.5fr",
                    gap: "16px",
                    padding: "16px 20px",
                    borderBottom: index < filtered.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
                    alignItems: "center",
                    background: index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(220,38,38,0.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)"}
                >
                  {/* Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                      width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg,#dc2626,#7c3aed)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontWeight: "700", fontSize: "14px",
                    }}>
                      {(user.fullName || user.userName || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ color: "#fff", fontSize: "13px", fontWeight: "600" }}>{user.fullName || "N/A"}</div>
                      <div style={{ color: "#6b7280", fontSize: "11px" }}>@{user.userName || "N/A"}</div>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Mail size={12} color="#6b7280" />
                    <span style={{ color: "#d1d5db", fontSize: "12px" }}>{user.email || "N/A"}</span>
                  </div>

                  {/* Phone */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Phone size={12} color="#6b7280" />
                    <span style={{ color: "#d1d5db", fontSize: "12px" }}>{user.phone || "N/A"}</span>
                  </div>

                  {/* Joined */}
                  <div style={{ color: "#9ca3af", fontSize: "12px" }}>
                    {formatDate(user.createdAt)}
                  </div>

                  {/* Birthday */}
                  <div style={{ color: "#9ca3af", fontSize: "12px" }}>
                    {user.birthday ? formatDate(user.birthday) : "N/A"}
                  </div>

                  {/* Delete */}
                  <div>
                    <button
                      onClick={() => handleDelete(user._id, user.fullName || user.userName)}
                      disabled={deleting === user._id}
                      style={{
                        background: "rgba(220,38,38,0.1)",
                        border: "1px solid rgba(220,38,38,0.3)",
                        borderRadius: "8px", padding: "6px",
                        cursor: deleting === user._id ? "not-allowed" : "pointer",
                        color: "#e63946", display: "flex",
                        alignItems: "center", justifyContent: "center",
                        opacity: deleting === user._id ? 0.5 : 1,
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;

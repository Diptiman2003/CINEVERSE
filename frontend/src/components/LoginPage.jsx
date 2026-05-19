// import React, { useState } from 'react';
// import { loginStyles } from '../assets/dummyStyles';
// import { ToastContainer, toast } from 'react-toastify';
// import { ArrowLeft, Clapperboard, Popcorn, Eye, EyeOff, Lock, Film } from 'lucide-react';
// import axios from 'axios';
// const API_BASE = "http://localhost:5000/api/auth";

// const LoginPage = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });
//     const [showPassword, setShowPassword] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);

//     const handelChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prevState) => ({ ...prevState, [name]: value }));
//     };
//     //handel submit
//     const handelSubmit = async(e) => {
//         e.preventDefault();
//         setIsLoading(true);
//         if (!formData.password || formData.password.length < 6) {
//             setIsLoading(false);
//              toast.error("Password must be at least 6 characters long");
//              console.warn("Login Blocked");
//             return;
//         }
//         try{
//         const payload={
//             email:formData.email.trim(),
//             password:formData.password,
//         };
//         const res = await axios.post(`${API_BASE}/login`, payload,{
//             headers:{'Content-Type':'application/json'}
//         });
//         const data = res.data;
//         if(data && data.success){
//             toast.success(data.message || "Login successful! Redirecting...");
//             if(data.token){
//                 localStorage.setItem('token', data.token);
//             }
//             try{
//                 const userToStore = data.user || {email:fromData.email};

//             localStorage.setItem(
//             "cine_auth",
//             JSON.stringify({
//               isLoggedIn: true,
//               email: userToStore.email || formData.email,
//             })
//           );
//           localStorage.setItem("isLoggedIn", "true");
//           localStorage.setItem(
//             "userEmail",
//             userToStore.email || formData.email || ""
//           );
//           localStorage.setItem(
//             "cine_user_email",
//             userToStore.email || formData.email || ""
//           );
//           localStorage.setItem("user", JSON.stringify(userToStore));

//             } catch(err){
//                console.warn("Failed to persist full user obj") ;
//             } 
//             setTimeout(() => {
//                 window.location.href = "/";
//             },1200);
//         }else{
//             toast.error(data?.message || "Login Failed");
//         }
//      } catch (err) {
//       console.error("Login error:", err);
//       const serverMsg =
//         err?.response?.data?.message || err?.message || "Server error";

//       // Map common backend messages to specific UI responses
//       const msgLower = String(serverMsg).toLowerCase();
//       if (msgLower.includes("password") || msgLower.includes("invalid")) {
//         toast.error(serverMsg);
//       } else if (msgLower.includes("email")) {
//         toast.error(serverMsg);
//       } else {
//         toast.error(serverMsg);
//       }
//     }finally{
//         setIsLoading(false);
//     }
//     };

//     const goBack = () => {
//         window.location.href ="/";
//     };
//     return (
//         <div className={loginStyles.pageContainer}>
//             <ToastContainer
//                 position="top-right"
//                 autoClose={2000}
//                 hideProgressBar={false}
//                 newestOnTop
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="dark"
//             />
//             <div className="relative w-full max-w-md z-10">
//                 <div className={loginStyles.backButtonContainer}>
//                     <button onClick={goBack} className={loginStyles.backButton}>
//                         <ArrowLeft size={20} className={loginStyles.backButtonIcon} />
//                         <span className={loginStyles.backButtonText}>Back</span>
//                     </button>
//                 </div>
//                 <div className={loginStyles.cardContainer}>
//                     <div className={loginStyles.cardHeader}></div>
//                     <div className={loginStyles.cardContent}>
//                         <div className={loginStyles.headerContainer}>
//                             <div className={loginStyles.headerIconContainer}>
//                                 <Film className={loginStyles.headerIcon} size={28} />
//                                 <h2 className={loginStyles.headerTitle}>Cinema Access</h2>
//                             </div>
//                             <p className={loginStyles.headerSubtitle}>Welcome back! Please login to your account.</p>
//                         </div>
//                         <form onSubmit={handelSubmit}>
//                             <div className={loginStyles.inputGroup}>
//                                 <label htmlFor="email" className={loginStyles.label}>Email</label>
//                                 <div className={loginStyles.inputContainer}>
//                                     <input
//                                         type="email"
//                                         name="email"
//                                         id="email"
//                                         className={loginStyles.input}
//                                         placeholder="Enter your email"
//                                         value={formData.email}
//                                         onChange={handelChange}
//                                     />
//                                     <div className={loginStyles.inputIcon}>
//                                         <Clapperboard size={20} className='text-red-500' />
//                                     </div>
//                                 </div>
//                             </div>
//                             <div className={loginStyles.inputGroup}>
//                                 <label htmlFor="password" className={loginStyles.label}>Password</label>
//                                 <div className={loginStyles.inputContainer}>
//                                     <input
//                                         type={showPassword ? "text" : "password"}
//                                         name="password"
//                                         id="password"
//                                         className={loginStyles.inputWithIcon}
//                                         placeholder="Enter your password"
//                                         value={formData.password}
//                                         onChange={handelChange}
//                                     />
//                                     <button type="button" className={loginStyles.passwordToggle} onClick={() => setShowPassword(!showPassword)}>
//                                         {showPassword ? <Eye size={20} className={loginStyles.passwordToggleIcon} /> : <EyeOff size={20} className={loginStyles.passwordToggleIcon} />}
//                                     </button>
//                                     {/* <div className={loginStyles.inputIcon}>
//                                         <Lock size={20} className={loginStyles.inputIcon} />
//                                     </div> */}
//                                 </div>
//                             </div>
//                             <button type="submit" disabled={isLoading} className={`${loginStyles.submitButton} ${isLoading ? loginStyles.submitButtonDisabled : ''}`}>
//                                 {isLoading ? (
//                                     <div className={loginStyles.buttonContent}>
//                                         <div className={loginStyles.spinner}>
//                                             <span className={loginStyles.buttonText}>Logging in...</span>
//                                         </div>
//                                     </div>
//                                 ) :
//                                     (
//                                         <div className={loginStyles.buttonContent}>
//                                             <Popcorn size={18} className={
//                                                 loginStyles.buttonIcon
//                                             } />
//                                             <span className={loginStyles.buttonText}>Access your account</span>
//                                         </div>
//                                     )}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//                 <div className={loginStyles.footerContainer
//                 }>
//                     <p className={loginStyles.footerText}>Don't have an account? <a href="/signup" className={loginStyles.footerLink}>Sign up</a></p>
//                 </div>
//             </div>
//             <style>{loginStyles.customCSS}</style>
//         </div>
//     );
// };

// export default LoginPage;


//by claudeai
// LoginPage.jsx
// Place in: frontend/src/components/LoginPage.jsx

import React, { useState } from 'react';
import { loginStyles } from '../assets/dummyStyles';
import { ToastContainer, toast } from 'react-toastify';
import { ArrowLeft, Clapperboard, Popcorn, Eye, EyeOff, Lock, Film, Mail } from 'lucide-react';
import axios from 'axios';
import OtpModal from './OtpModal';   // ← NEW

const API_BASE = "http://localhost:5000/api/auth";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ── OTP states ────────────────────────────────────────────────────────────
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);

  const handelChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ── Save user to localStorage ─────────────────────────────────────────────
  const saveUserToStorage = (data) => {
    const userToStore = data.user || { email: formData.email };
    if (data.token) localStorage.setItem("token", data.token);
    try {
      localStorage.setItem("cine_auth", JSON.stringify({ isLoggedIn: true, email: userToStore.email || formData.email, isAdmin: userToStore.isAdmin || false }));
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", userToStore.email || formData.email || "");
      localStorage.setItem("cine_user_email", userToStore.email || formData.email || "");
      localStorage.setItem("user", JSON.stringify(userToStore));
    } catch (err) {
      console.warn("Failed to persist user obj");
    }
  };

  // ── Normal Login ──────────────────────────────────────────────────────────
  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!formData.password || formData.password.length < 6) {
      setIsLoading(false);
      toast.error("Password must be at least 6 characters long");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/login`, {
        email: formData.email.trim(),
        password: formData.password,
      }, { headers: { 'Content-Type': 'application/json' } });

      const data = res.data;
      if (data && data.success) {
        toast.success(data.message || "Login successful! Redirecting...");
        saveUserToStorage(data);
        const redirectTo = data.user?.isAdmin ? "/admin" : "/";   // ← NEW
        setTimeout(() => { window.location.href = redirectTo; }, 1200);  // ← CHANGED
      } else {
        toast.error(data?.message || "Login Failed");
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.message || err?.message || "Server error";
      toast.error(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Send OTP ──────────────────────────────────────────────────────────────
  const handleSendOTP = async () => {
    if (!formData.email || !formData.email.includes("@")) {
      toast.error("Please enter your email address first!");
      return;
    }
    setOtpLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/send-otp`, {
        email: formData.email.trim(),
      });
      if (res.data.success) {
        toast.success("OTP sent to your email! Check your inbox 📧");
        setShowOtpModal(true);
      } else {
        toast.error(res.data.message || "Failed to send OTP");
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to send OTP";
      toast.error(msg);
    } finally {
      setOtpLoading(false);
    }
  };

  // ── OTP Verified Successfully ─────────────────────────────────────────────
  const handleOtpSuccess = (data) => {
  saveUserToStorage(data);
  setShowOtpModal(false);
  const redirectTo = data.user?.isAdmin ? "/admin" : "/";   // ← NEW
  setTimeout(() => { window.location.href = redirectTo; }, 1000);  // ← CHANGED
};
  const goBack = () => { window.location.href = "/"; };

  return (
    <div className={loginStyles.pageContainer}>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {/* OTP Modal */}
      {showOtpModal && (
        <OtpModal
          email={formData.email.trim()}
          onSuccess={handleOtpSuccess}
          onClose={() => setShowOtpModal(false)}
        />
      )}

      <div className="relative w-full max-w-md z-10">
        <div className={loginStyles.backButtonContainer}>
          <button onClick={goBack} className={loginStyles.backButton}>
            <ArrowLeft size={20} className={loginStyles.backButtonIcon} />
            <span className={loginStyles.backButtonText}>Back</span>
          </button>
        </div>

        <div className={loginStyles.cardContainer}>
          <div className={loginStyles.cardHeader}></div>
          <div className={loginStyles.cardContent}>
            <div className={loginStyles.headerContainer}>
              <div className={loginStyles.headerIconContainer}>
                <Film className={loginStyles.headerIcon} size={28} />
                <h2 className={loginStyles.headerTitle}>Cinema Access</h2>
              </div>
              <p className={loginStyles.headerSubtitle}>Welcome back! Please login to your account.</p>
            </div>

            <form onSubmit={handelSubmit}>
              {/* Email */}
              <div className={loginStyles.inputGroup}>
                <label htmlFor="email" className={loginStyles.label}>Email</label>
                <div className={loginStyles.inputContainer}>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    className={loginStyles.input}
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handelChange}
                  />
                  <div className={loginStyles.inputIcon}>
                    <Clapperboard size={20} className='text-red-500' />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className={loginStyles.inputGroup}>
                <label htmlFor="password" className={loginStyles.label}>Password</label>
                <div className={loginStyles.inputContainer}>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    className={loginStyles.inputWithIcon}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handelChange}
                  />
                  <button
                    type="button"
                    className={loginStyles.passwordToggle}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword
                      ? <Eye size={20} className={loginStyles.passwordToggleIcon} />
                      : <EyeOff size={20} className={loginStyles.passwordToggleIcon} />
                    }
                  </button>
                </div>
              </div>

              {/* Normal Login Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`${loginStyles.submitButton} ${isLoading ? loginStyles.submitButtonDisabled : ''}`}
              >
                {isLoading ? (
                  <div className={loginStyles.buttonContent}>
                    <div className={loginStyles.spinner}>
                      <span className={loginStyles.buttonText}>Logging in...</span>
                    </div>
                  </div>
                ) : (
                  <div className={loginStyles.buttonContent}>
                    <Popcorn size={18} className={loginStyles.buttonIcon} />
                    <span className={loginStyles.buttonText}>Access your account</span>
                  </div>
                )}
              </button>
            </form>

            {/* Divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "20px 0" }}>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
              <span style={{ color: "#6b7280", fontSize: "12px", fontWeight: "500" }}>OR LOGIN WITH OTP</span>
              <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.1)" }} />
            </div>

            {/* OTP Login Button */}
            <button
              type="button"
              onClick={handleSendOTP}
              disabled={otpLoading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                padding: "12px",
                borderRadius: "12px",
                border: "1.5px solid rgba(220,38,38,0.4)",
                background: otpLoading ? "rgba(220,38,38,0.1)" : "transparent",
                color: "#e63946",
                fontSize: "14px",
                fontWeight: "600",
                cursor: otpLoading ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { if (!otpLoading) e.currentTarget.style.background = "rgba(220,38,38,0.1)"; }}
              onMouseLeave={(e) => { if (!otpLoading) e.currentTarget.style.background = "transparent"; }}
            >
              <Mail size={16} />
              {otpLoading ? "Sending OTP..." : "📧 Login with OTP"}
            </button>

          </div>
        </div>

        <div className={loginStyles.footerContainer}>
          <p className={loginStyles.footerText}>
            Don't have an account?{" "}
            <a href="/signup" className={loginStyles.footerLink}>Sign up</a>
          </p>
        </div>
      </div>

      <style>{loginStyles.customCSS}</style>
    </div>
  );
};

export default LoginPage;

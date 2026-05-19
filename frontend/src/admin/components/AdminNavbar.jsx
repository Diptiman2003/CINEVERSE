// import React, { useEffect, useState, useCallback } from 'react'
// import { styles4 } from '../assets/dummyStyles'
// import { Calendar, Film , List,  Ticket, X as XIcon ,Menu} from 'lucide-react'
// import { NavLink } from 'react-router-dom'
// const Navbar = () => {

//     const [open, setOpen] = useState(false);
//     const toggleOpen = useCallback(() => setOpen((v) => !v), []);
//     const close = useCallback(() => setOpen(false), []);

//       useEffect(() => {
//     document.body.style.overflow = open ? "hidden" : "";
//     const onKey = (e) => {
//       if (e.key === "Escape") close();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => {
//       window.removeEventListener("keydown", onKey);
//       document.body.style.overflow = "";
//     };
//   }, [open, close]);
//     const NavItem = ({ to, Icon, label, end = false, onClick }) => (
//     <NavLink
//       to={to}
//       end={end}
//       onClick={onClick}
//       className={({ isActive }) =>
//         `${styles4.navLinkBase} ${
//           isActive
//             ? styles4.navLinkActive
//             : styles4.navLinkInactive
//         }`
//       }
//     >
//       {({ isActive }) => (
//         <>
//           <Icon
//             className={`${styles4.navLinkIconBase} ${
//               isActive ? styles4.navLinkIconActive : styles4.navLinkIconInactive
//             }`}
//           />
//           <span
//             className={`${styles4.navLinkTextBase} ${
//               isActive ? styles4.navLinkTextActive : styles4.navLinkTextInactive
//             }`}
//           >
//             {label}
//           </span>
//         </>
//       )}
//     </NavLink>
//   );
//   return (
//     <nav className={styles4.navbar}>
//         <div className={styles4.navbarContainer}>
//             <div className={styles4.navbarFlex}>
//                  {/*logo*/}
//                   {/* //self made  <NavLink to="/"> */}
//                  <div className={styles4.logoContainer}>
//                   <div className={styles4.logoIcon}>
//                         <Film className={styles4.logoIconInner}/>
//                     </div>
//                      {/* //self made  <NavLink to="/"> */}
//                     <span className={styles4.logoText}>CINEVERSE</span>
//                     {/* </NavLink> */}
//                     //selfmade 
//                  </div>
//                  {/* </NavLink> */}
//             <div className={styles4.desktopNav}>
//             <NavItem to="/" Icon={Film} label="ADD MOVIES" end />
//             <NavItem to="/listmovies" Icon={List} label="LIST MOVIES" />
//             {/* Dashboard */}
//             <NavItem to="/dashboard" Icon={Calendar} label="DASHBOARD" />
//             {/* Bookings (new) */}
//             <NavItem to="/bookings" Icon={Ticket} label="BOOKINGS" />
//           </div> 
//           {/* toggle */}
//           <div className="flex items-center lg:hidden">
//             <button onClick={toggleOpen} className={styles4.mobileMenuButton}>
//               <span className='sr-only'>Open main menu</span>
//                 {open ? (<XIcon className={styles4.mobileMenuIcon} />
//                 ) : (
//                      <Menu className={styles4.mobileMenuIcon} />
//                 )}
//             </button>
//           </div>
//          </div>
//   </div>
//   <div className={`${styles4.mobileMenuContainer} ${open ? 'pointer-events-auto:' : 'pointer-events-none'}`}>
//     <div className={`${styles4.mobileMenuBackdrop} ${
//         open ? 'opacity-100' : 'opacity-0'
//     }`} onClick={close}/>
//     <aside id="mobile-menu" className={`${styles4.mobileMenuPanel} ${
//         open ? 'translate-x-0' : 'translate-x-full'
//         }`} role="dialog">
//             <div className={styles4.mobileMenuPanelHeader}>
//                 <div className={styles4.logoContainer}>
//                     <div className='flex items-center justify-center w-10 h-10 bg-red-600 rounded-full transform rotate-12'>
//                         <Film className='w-6 h-6 text-white transform -rotate-12'/>
//                     </div>
//                     <span className="font-['Impact'] text-xl text-white tracking-wider">
//                         CINEVERSE
//                     </span>
//                 </div>
//                 <button onClick={close} className='p-2 rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-red-600'>
//                 <XIcon className='w-5 h-5 text-red-200'/>
//                 </button>
//             </div>
//             {/* nav */}
//             <nav className={styles4.mobileMenuPanelNav}>
//                <NavLink to='/' end onClick={close} className={({ isActive }) => `${styles4.mobileNavLinkBase} ${
//                   isActive ? styles4.mobileNavLinkActive : styles4.mobileNavLinkInactive
//                }`}>
//                 {({isActive})=>(
//                   <>
//                   <Film className={`${styles4.mobileNavLinkIconBase} ${isActive ? styles4.mobileNavLinkIconActive : styles4.mobileNavLinkIconInactive}`}/>
//                   <span className={styles4.mobileNavLinkText}>ADD MOVIES</span>
//                   </>
//                 )}
//              </NavLink>
//               <NavLink to='/listmovies' onClick={close} className={({ isActive }) => `${styles4.mobileNavLinkBase} ${
//                   isActive ? styles4.mobileNavLinkActive : styles4.mobileNavLinkInactive
//                }`}>
//                 {({isActive})=>(
//                   <>
//                   <List className={`${styles4.mobileNavLinkIconBase} ${isActive ? styles4.mobileNavLinkIconActive : styles4.mobileNavLinkIconInactive}`}/>
//                   <span className={styles4.mobileNavLinkText}>LIST MOVIES</span>
//                   </>
//                 )}
//              </NavLink>
//               <NavLink to='/dashboard' onClick={close} className={({ isActive }) => `${styles4.mobileNavLinkBase} ${
//                   isActive ? styles4.mobileNavLinkActive : styles4.mobileNavLinkInactive
//                }`}>
//                 {({isActive})=>(
//                   <>
//                   <Calendar className={`${styles4.mobileNavLinkIconBase} ${isActive ? styles4.mobileNavLinkIconActive : styles4.mobileNavLinkIconInactive}`}/>
//                   <span className={styles4.mobileNavLinkText}>DASHBOARD</span>
//                   </>
//                 )}
//              </NavLink>
//               <NavLink to='/bookings'  onClick={close} className={({ isActive }) => `${styles4.mobileNavLinkBase} ${
//                   isActive ? styles4.mobileNavLinkActive : styles4.mobileNavLinkInactive
//                }`}>
//                 {({isActive})=>(
//                   <>
//                   <Ticket className={`${styles4.mobileNavLinkIconBase} ${isActive ? styles4.mobileNavLinkIconActive : styles4.mobileNavLinkIconInactive}`}/>
//                   <span className={styles4.mobileNavLinkText}>BOOKINGS</span>
//                   </>
//                 )}
//              </NavLink>
//             </nav>

//             {/* FOOTER */}
//             <div className={styles4.mobileMenuPanelFooter}>
//               <p className={styles4.mobileMenuFooterText}>
//                 &copy; {new Date().getFullYear()} CINEVERSE
//               </p>

//             </div>
//     </aside>
//   </div>
//     </nav>
//   )
// }

// export default Navbar





//claude ai 




// Navbar.jsx
// Place in: admin/src/components/Navbar.jsx — replace existing

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { styles4 } from '../assets/dummyStyles.js'
import { Calendar, Film, List, Ticket, X as XIcon, Menu, Users, LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e) => { if (e.key === "Escape") close(); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);
  const handleLogout = () => {
    localStorage.removeItem('cine_auth');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('cine_user_email');
    // setIsLoggedIn(false)
    // setUserEmail("");
    window.location.href = '/'
  }

  const NavItem = ({ to, Icon, label, end = false, onClick }) => (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `${styles4.navLinkBase} ${isActive ? styles4.navLinkActive : styles4.navLinkInactive}`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`${styles4.navLinkIconBase} ${isActive ? styles4.navLinkIconActive : styles4.navLinkIconInactive}`} />
          <span className={`${styles4.navLinkTextBase} ${isActive ? styles4.navLinkTextActive : styles4.navLinkTextInactive}`}>
            {label}
          </span>
        </>
      )}
    </NavLink>
  );

  return (
    <nav className={styles4.navbar}>
      <div className={styles4.navbarContainer}>
        <div className={styles4.navbarFlex}>

          {/* Logo */}
          <div className={styles4.logoContainer}>
            <div className={styles4.logoIcon}>
              <Film className={styles4.logoIconInner} />
            </div>
            <span className={styles4.logoText}>CINEVERSE</span>
          </div>

          {/* Desktop Nav */}
          <div className={styles4.desktopNav}>
            <NavItem to="/admin/" Icon={Film} label="ADD MOVIES" end />
            <NavItem to="/admin/listmovies" Icon={List} label="LIST MOVIES" />
            <NavItem to="/admin/dashboard" Icon={Calendar} label="DASHBOARD" />
            <NavItem to="/admin/bookings" Icon={Ticket} label="BOOKINGS" />
            <NavItem to="/admin/users" Icon={Users} label="USERS" />   {/* ← NEW */}
            <NavItem to="/" Icon={LogOut} label="LOGOUT" onClick={handleLogout} />     {/* ← NEW (go back to main site) */}

          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center lg:hidden">
            <button onClick={toggleOpen} className={styles4.mobileMenuButton}>
              <span className='sr-only'>Open main menu</span>
              {open
                ? <XIcon className={styles4.mobileMenuIcon} />
                : <Menu className={styles4.mobileMenuIcon} />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles4.mobileMenuContainer} ${open ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <div className={`${styles4.mobileMenuBackdrop} ${open ? 'opacity-100' : 'opacity-0'}`} onClick={close} />
        <aside id="mobile-menu" className={`${styles4.mobileMenuPanel} ${open ? 'translate-x-0' : 'translate-x-full'}`} role="dialog">

          <div className={styles4.mobileMenuPanelHeader}>
            <div className={styles4.logoContainer}>
              <div className='flex items-center justify-center w-10 h-10 bg-red-600 rounded-full transform rotate-12'>
                <Film className='w-6 h-6 text-white transform -rotate-12' />
              </div>
              <span className="font-['Impact'] text-xl text-white tracking-wider">CINEVERSE</span>
            </div>
            <button onClick={close} className='p-2 rounded-full hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-red-600'>
              <XIcon className='w-5 h-5 text-red-200' />
            </button>
          </div>

          <nav className={styles4.mobileMenuPanelNav}>
            {[
              { to: "/admin/", Icon: Film, label: "ADD MOVIES", end: true },
              { to: "/admin/listmovies", Icon: List, label: "LIST MOVIES" },
              { to: "/admin/dashboard", Icon: Calendar, label: "DASHBOARD" },
              { to: "/admin/bookings", Icon: Ticket, label: "BOOKINGS" },
              { to: "/admin/users", Icon: Users, label: "USERS" },    // ← NEW
              // { to: "/admin/logout", Icon: LogOut, label: "LOGOUT" },     // ← NEW (go back to main site)
            ].map(({ to, Icon, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={close}
                className={({ isActive }) =>
                  `${styles4.mobileNavLinkBase} ${isActive ? styles4.mobileNavLinkActive : styles4.mobileNavLinkInactive}`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`${styles4.mobileNavLinkIconBase} ${isActive ? styles4.mobileNavLinkIconActive : styles4.mobileNavLinkIconInactive}`} />
                    <span className={styles4.mobileNavLinkText}>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
            <div className="mt-4 border-t border-red-700 pt-4 flex items-center">
            <button onClick={() => {
              // setIsMenuOpen(false);
              handleLogout();
            }}
              className="px-4 py-2 gap-2 flex items-center text-red-400 hover:text-red-600 transition-colors duration-200"
            >


              <LogOut className={`${styles4.mobileNavLinkIconBase}  ${styles4.mobileNavLinkIconInactive}`} />
                <span className={styles4.mobileNavLinkText}>LOGOUT</span>
            </button>
            </div>
          </nav>

          <div className={styles4.mobileMenuPanelFooter}>
            <p className={styles4.mobileMenuFooterText}>
              &copy; {new Date().getFullYear()} CINEVERSE
            </p>
          </div>
        </aside>
      </div>
    </nav>
  );
};

export default Navbar;

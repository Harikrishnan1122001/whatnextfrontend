// import { useState, useRef, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const NAV_LINKS = [
//   { to: '/', label: 'Home' },
//   { to: '/courses', label: 'Courses' },
//   { to: '/live', label: 'Live Classes' },
//   { to: '/notes', label: 'Notes' },
// ];

// export default function Navbar({ onAuth }) {
//   const { user, logout, isAdmin } = useAuth();
//   const location = useLocation();
//   const [menu, setMenu] = useState(false);
//   const menuRef = useRef(null);

//   // Close menu on outside click
//   useEffect(() => {
//     const handler = (e) => {
//       if (menuRef.current && !menuRef.current.contains(e.target)) setMenu(false);
//     };
//     document.addEventListener('mousedown', handler);
//     return () => document.removeEventListener('mousedown', handler);
//   }, []);

//   const isActive = (to) =>
//     to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

//   return (
//     <nav
//       style={{
//         position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
//         background: 'rgba(10,11,20,0.92)', backdropFilter: 'blur(20px)',
//         borderBottom: '1px solid var(--border)',
//         height: 72, display: 'flex', alignItems: 'center',
//       }}
//     >
//       <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 32, width: '100%' }}>
//         {/* Logo */}
//         <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'var(--font2)', fontSize: '1.4rem', fontWeight: 700, textDecoration: 'none' }}>
//           <div style={{ width: 36, height: 36, background: 'var(--primary)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>💻</div>
//           <span style={{ background: 'linear-gradient(135deg,#fff 0%,var(--primary-light) 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>EduPlatform</span>
//         </Link>

//         {/* Nav links */}
//         <div style={{ display: 'flex', gap: 4, flex: 1 }}>
//           {NAV_LINKS.map(({ to, label }) => (
//             <Link
//               key={to}
//               to={to}
//               style={{
//                 padding: '8px 16px', borderRadius: 'var(--radius-sm)',
//                 color: isActive(to) ? 'var(--text)' : 'var(--text2)',
//                 background: isActive(to) ? 'var(--surface)' : 'transparent',
//                 fontSize: '0.9rem', fontWeight: 500,
//                 transition: 'all 0.2s', textDecoration: 'none',
//               }}
//             >
//               {label}
//             </Link>
//           ))}
//         </div>

//         {/* Actions */}
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
//           {user ? (
//             <div className="user-menu-wrap" ref={menuRef}>
//               <button
//                 className="avatar-btn"
//                 onClick={() => setMenu(v => !v)}
//                 style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', color: '#fff' }}
//               >
//                 {user.name?.[0]?.toUpperCase() || 'U'}
//               </button>
//               {menu && (
//                 <div className="user-menu">
//                   <div className="user-menu-name">{user.name}</div>
//                   <div className="user-menu-email">{user.email}</div>
//                   <Link className="user-menu-item" to="/dashboard" onClick={() => setMenu(false)}>📚 My Dashboard</Link>
//                   {isAdmin && <Link className="user-menu-item" to="/admin" onClick={() => setMenu(false)}>⚙️ Admin Panel</Link>}
//                   <hr className="user-menu-divider" />
//                   <div className="user-menu-item" style={{ color: 'var(--accent)' }} onClick={() => { logout(); setMenu(false); }}>🚪 Logout</div>
//                 </div>
//               )}
//             </div>
//           ) : (
//             <>
//               <button className="btn btn-outline btn-sm" onClick={onAuth}>Login</button>
//               <button className="btn btn-primary btn-sm" onClick={onAuth}>Sign Up Free</button>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/live", label: "Live Classes" },
  { to: "/notes", label: "Notes" },
];

export default function Navbar({ onAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  const [menu, setMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isActive = (to) =>
    to === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(to);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: scrolled ? 64 : 72,
        transition: "all 0.3s ease",
        background: "rgba(10,11,20,0.75)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
        boxShadow: scrolled
          ? "0 10px 30px rgba(0,0,0,0.25)"
          : "none",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          gap: 30,
        }}
      >
        {/* Logo */}
        <motion.div
          whileHover={{
            scale: 1.05,
          }}
        >
          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
            }}
          >
            <motion.div
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background:
                  "linear-gradient(135deg,#6366f1,#8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "1.2rem",
                boxShadow:
                  "0 0 20px rgba(99,102,241,.4)",
              }}
            >
              💻
            </motion.div>

            <span
              style={{
                fontSize: "1.4rem",
                fontWeight: 800,
                fontFamily: "var(--font2)",
                background:
                  "linear-gradient(135deg,#ffffff,#a5b4fc)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              EduPlatform
            </span>
          </Link>
        </motion.div>

        {/* Navigation */}
        <div
          style={{
            display: "flex",
            gap: 10,
            flex: 1,
          }}
        >
          {NAV_LINKS.map(({ to, label }) => (
            <motion.div
              key={to}
              whileHover={{
                y: -3,
              }}
              whileTap={{
                scale: 0.95,
              }}
            >
              <Link
                to={to}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  textDecoration: "none",
                  fontWeight: 600,
                  color: isActive(to)
                    ? "#fff"
                    : "var(--text2)",
                  background: isActive(to)
                    ? "rgba(99,102,241,.15)"
                    : "transparent",
                  border: isActive(to)
                    ? "1px solid rgba(99,102,241,.4)"
                    : "1px solid transparent",
                  transition: "all .3s ease",
                }}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right Side */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          {user ? (
            <div
              ref={menuRef}
              style={{
                position: "relative",
              }}
            >
              <motion.button
                whileHover={{
                  scale: 1.1,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                onClick={() => setMenu(!menu)}
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: "50%",
                  border: "none",
                  cursor: "pointer",
                  background:
                    "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "#fff",
                  fontWeight: 700,
                  boxShadow:
                    "0 0 25px rgba(99,102,241,.5)",
                }}
              >
                {user?.name?.[0]?.toUpperCase() || "U"}
              </motion.button>

              <AnimatePresence>
                {menu && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: -10,
                      scale: 0.95,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      y: -10,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    style={{
                      position: "absolute",
                      top: 55,
                      right: 0,
                      width: 250,
                      background:
                        "rgba(20,20,30,0.95)",
                      backdropFilter: "blur(20px)",
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 14,
                      overflow: "hidden",
                      boxShadow:
                        "0 20px 50px rgba(0,0,0,.3)",
                    }}
                  >
                    <div
                      style={{
                        padding: 16,
                        borderBottom:
                          "1px solid rgba(255,255,255,.08)",
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          color: "#fff",
                        }}
                      >
                        {user.name}
                      </div>

                      <div
                        style={{
                          fontSize: 13,
                          color: "#94a3b8",
                        }}
                      >
                        {user.email}
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setMenu(false)}
                      style={menuItem}
                    >
                      📚 My Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setMenu(false)}
                        style={menuItem}
                      >
                        ⚙️ Admin Panel
                      </Link>
                    )}

                    <div
                      style={{
                        height: 1,
                        background:
                          "rgba(255,255,255,.08)",
                      }}
                    />

                    <div
                      onClick={() => {
                        logout();
                        setMenu(false);
                      }}
                      style={{
                        ...menuItem,
                        cursor: "pointer",
                        color: "#ef4444",
                      }}
                    >
                      🚪 Logout
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                className="btn btn-outline btn-sm"
                onClick={onAuth}
              >
                Login
              </motion.button>

              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="btn btn-primary btn-sm"
                onClick={onAuth}
              >
                Sign Up Free
              </motion.button>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

const menuItem = {
  display: "block",
  padding: "14px 18px",
  textDecoration: "none",
  color: "#fff",
  transition: "0.3s",
};
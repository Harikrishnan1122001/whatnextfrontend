// import { createContext, useContext, useState, useCallback } from 'react';

// const ToastContext = createContext(null);
// export const useToast = () => useContext(ToastContext);

// export function ToastProvider({ children }) {
//   const [toasts, setToasts] = useState([]);

//   const toast = useCallback((msg, type = 'success') => {
//     const id = Date.now();
//     setToasts(prev => [...prev, { id, msg, type }]);
//     setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
//   }, []);

//   return (
//     <ToastContext.Provider value={toast}>
//       {children}
//       <div className="toast-container">
//         {toasts.map(t => (
//           <div key={t.id} className={`toast ${t.type}`}>
//             <span>{t.type === 'success' ? '✅' : t.type === 'error' ? '❌' : 'ℹ️'}</span>
//             <span>{t.msg}</span>
//           </div>
//         ))}
//       </div>
//     </ToastContext.Provider>
//   );
// }
import { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((msg, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3800);
  }, []);

  const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--surface2)',
            border: `1px solid ${t.type === 'success' ? 'var(--green)' : t.type === 'error' ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 10, padding: '12px 18px', fontSize: '0.88rem',
            display: 'flex', alignItems: 'center', gap: 10, minWidth: 280,
            animation: 'slideInRight 0.3s ease', boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}>
            <span>{icons[t.type] || '💬'}</span>
            <span style={{ color: 'var(--text)' }}>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
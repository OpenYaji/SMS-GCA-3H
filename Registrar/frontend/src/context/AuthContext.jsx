// import { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const publicRoutes = ['/', '/login'];
    
//     if (!publicRoutes.includes(location.pathname)) {
//       fetchCurrentUser();
//     } else {
//       setLoading(false);
//     }
//   }, [location.pathname]);

//   const login = async (username, password) => {
//     try {
//       const response = await axios.post(
//         '/backend/api/auth/login.php', // need pa to ng enhancement
//         { username, password },
//         {
//           withCredentials: true,
//           headers: { 'Content-Type': 'application/json' }
//         }
//       );

//       if (response.data.success) {
//         return { success: true, user: response.data.user };
//       }
//     } catch (error) {
//       throw error;
//     }
//   };

//   const logout = async () => {
//     try {
//       await axios.post(
//         '/backend/api/auth/logout.php', // need pa to ng enhancement
//         {},
//         { withCredentials: true }
//       );
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       setUser(null);
//       navigate('/');
//     }
//   };

//   const value = {
//     user,
//     loading,
//     login,
//     logout,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
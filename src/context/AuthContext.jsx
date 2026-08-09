import { createContext, useContext, useState, useEffect } from 'react';
import { signupUser, loginUser } from '../services/auth.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, check if a logged-in user was saved from a previous session
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signup = async (username, email, password) => {
    const data = await signupUser(username, email, password);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — lets any component do `const { user, login } = useAuth()`
// instead of importing AuthContext + useContext everywhere
export const useAuth = () => useContext(AuthContext);
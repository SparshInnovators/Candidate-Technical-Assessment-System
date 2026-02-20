import { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../lib/appwrite';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkSession = async () => {
    try {
      const timeout = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 5000)
      );
      const currentUser = await Promise.race([auth.getAccount(), timeout]);
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { checkSession(); }, []);

  const login = async (email, password) => {
    await auth.createSession(email, password);
    await checkSession();
  };

  const register = async (email, password, name) => {
    await auth.createAccount(email, password, name);
    await auth.createSession(email, password);
    await checkSession();
  };

  const logout = async () => {
    await auth.deleteSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}

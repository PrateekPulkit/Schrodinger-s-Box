import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'COMMANDER' | 'FIELD_OPERATIVE' | 'ANALYST';

interface User {
  username: string;
  role: Role;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string, username: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role') as Role;
    
    if (storedToken && storedUsername && storedRole) {
      setUser({ token: storedToken, username: storedUsername, role: storedRole });
    }
  }, []);

  const login = (token: string, username: string, role: Role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
    setUser({ token, username, role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

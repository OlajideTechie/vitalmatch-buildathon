import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('vitalmatch_token') || null);
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('vitalmatch_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  // Update the login function to accept the role
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    
    localStorage.setItem('vitalmatch_token', authToken);
    localStorage.setItem('vitalmatch_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('vitalmatch_token');
    localStorage.removeItem('vitalmatch_user');
  };

  const value = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
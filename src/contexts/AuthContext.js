
import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (username, password) => {
    // Replace this with your actual authentication logic (e.g., API call)
    // For demonstration, we're using hardcoded credentials
    if (username === 'admin' && password === 'admin') {
      const userData = { username };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData)); // Save user to localStorage
      return true; // Login successful
    }
    return false; // Login failed
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Remove user from localStorage
  };

  // Optional: useEffect to manage user session on page refresh
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Provide user state and methods to the context consumers
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

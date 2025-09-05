import React, { createContext, useState, useContext, useEffect } from 'react';

export const UserContext = createContext(); 

export const UserProvider = ({ children }) => {
  const [username, setUsername] = useState('Admin'); 

  const fetchUsername = async () => {
    try {
      const response = await fetch('https://mw.elementsenergies.com/api/auth', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.username) {
          setUsername(data.username);
          console.log('Username fetched:', data.username);
        } else {
          setUsername('Admin');
        }
      } else {
        setUsername('Admin');
      }
    } catch (error) {
      console.error('Error fetching username:', error);
      setUsername('Admin');
    }
  };

  useEffect(() => {
    fetchUsername();
  }, []);

  return (
    <UserContext.Provider value={{ username, setUsername, fetchUsername }}> 
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
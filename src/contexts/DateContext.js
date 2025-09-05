import React, { createContext, useState, useEffect, useMemo } from 'react';
import moment from 'moment-timezone';

export const DateContext = createContext();

export const DateProvider = ({ children }) => {
  const [dateRange, setDateRange] = useState({
    startDateTime: moment().tz('Asia/Kolkata').startOf('day').format('YYYY-MM-DD HH:mm'),
    endDateTime: moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm'),
  });

  const handleDateChange = ({ startDateTime, endDateTime }) => {
    setDateRange({
      startDateTime: startDateTime || dateRange.startDateTime,
      endDateTime: endDateTime || dateRange.endDateTime,
    });
  };

  useEffect(() => {
    console.log("Start DateTime:", dateRange.startDateTime);
    console.log("End DateTime:", dateRange.endDateTime);
  }, [dateRange]);

  return (
    <DateContext.Provider value={{ ...dateRange, handleDateChange }}>
      {children}
    </DateContext.Provider>
  );
};
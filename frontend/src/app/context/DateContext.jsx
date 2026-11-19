import { createContext, useContext, useState } from "react";

const DateContext = createContext(undefined);

export function DateProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());

  function setDate(date) {
    setSelectedDate(new Date(date));
  }

  function jumpToToday() {
    setSelectedDate(new Date());
  }

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate: setDate, jumpToToday }}>
      {children}
    </DateContext.Provider>
  );
}

export function useSelectedDate() {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useSelectedDate must be used within DateProvider");
  }
  return context;
}

export default DateContext;

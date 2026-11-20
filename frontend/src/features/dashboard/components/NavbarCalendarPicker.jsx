import { useState, useRef, useEffect } from "react";
import { useSelectedDate } from "../../../app/context/DateContext";
import "./NavbarCalendarPicker.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SHORT_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Available years for selection
const YEARS = [2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

export function NavbarCalendarPicker() {
  const { selectedDate, setSelectedDate, jumpToToday } = useSelectedDate();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Local view month & year state
  const [viewYear, setViewYear] = useState(() => selectedDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => selectedDate.getMonth());

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync view when selectedDate changes from outside
  useEffect(() => {
    setViewYear(selectedDate.getFullYear());
    setViewMonth(selectedDate.getMonth());
  }, [selectedDate]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarDays = [];

  // Previous month fill
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      month: viewMonth - 1,
      year: viewYear,
      isCurrentMonth: false
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      month: viewMonth,
      year: viewYear,
      isCurrentMonth: true
    });
  }

  // Next month fill to make 35 or 42 cells
  const remaining = (calendarDays.length > 35 ? 42 : 35) - calendarDays.length;
  for (let d = 1; d <= remaining; d++) {
    calendarDays.push({
      day: d,
      month: viewMonth + 1,
      year: viewYear,
      isCurrentMonth: false
    });
  }

  function handleSelectDay(cell) {
    const newDate = new Date(cell.year, cell.month, cell.day);
    setSelectedDate(newDate);
    setIsOpen(false);
  }

  function handleJumpToday() {
    jumpToToday();
    const today = new Date();
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setIsOpen(false);
  }

  const isToday = (d, m, y) => {
    const today = new Date();
    return (
      d === today.getDate() &&
      m === today.getMonth() &&
      y === today.getFullYear()
    );
  };

  const isSelected = (d, m, y) => {
    return (
      d === selectedDate.getDate() &&
      m === selectedDate.getMonth() &&
      y === selectedDate.getFullYear()
    );
  };

  const formattedNavDate = selectedDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });

  return (
    <div className="navbar-calendar-container" ref={containerRef}>
      <button
        type="button"
        className={`nav-calendar-btn ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Choose date for Dashboard & Logs"
      >
        <span className="cal-btn-text">Calendar</span>
        <span className="cal-btn-date-pill">{formattedNavDate}</span>
        <span className="cal-arrow-indicator">{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className="navbar-calendar-popover">
          {/* Popover Header with Month & Year Selectors */}
          <div className="cal-popover-header">
            <div className="cal-selectors-row">
              {/* Month Dropdown */}
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="cal-select-dropdown month-select"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={idx} value={idx}>{m}</option>
                ))}
              </select>

              {/* Year Dropdown */}
              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="cal-select-dropdown year-select"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="cal-today-quick-btn"
              onClick={handleJumpToday}
            >
              Today
            </button>
          </div>

          {/* Month Stepper Buttons */}
          <div className="cal-month-stepper">
            <button
              type="button"
              className="stepper-arrow"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear(viewYear - 1);
                } else {
                  setViewMonth(viewMonth - 1);
                }
              }}
            >
              ‹
            </button>
            <span className="current-view-label">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              className="stepper-arrow"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear(viewYear + 1);
                } else {
                  setViewMonth(viewMonth + 1);
                }
              }}
            >
              ›
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="cal-weekdays-strip">
            {DAYS_OF_WEEK.map((d, i) => (
              <span key={i} className="weekday-col">{d}</span>
            ))}
          </div>

          {/* Grid of Dates */}
          <div className="cal-popover-grid">
            {calendarDays.map((cell, idx) => {
              const selected = isSelected(cell.day, cell.month, cell.year);
              const today = isToday(cell.day, cell.month, cell.year);

              return (
                <button
                  key={idx}
                  type="button"
                  className={`cal-popover-cell ${!cell.isCurrentMonth ? "other-month" : ""} ${today ? "today" : ""} ${selected ? "selected" : ""}`}
                  onClick={() => handleSelectDay(cell)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>

          {/* Footer with selected date info */}
          <div className="cal-popover-footer">
            <span>
              Active: <strong>{selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavbarCalendarPicker;

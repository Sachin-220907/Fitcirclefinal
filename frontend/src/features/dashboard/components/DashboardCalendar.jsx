import { useState } from "react";
import "./DashboardCalendar.css";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function DashboardCalendar({ selectedDate, onSelectDate, loggedDays = {} }) {
  const [currentViewDate, setCurrentViewDate] = useState(() => new Date(selectedDate || new Date()));

  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  function prevMonth() {
    setCurrentViewDate(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentViewDate(new Date(year, month + 1, 1));
  }

  function jumpToToday() {
    const today = new Date();
    setCurrentViewDate(today);
    onSelectDate(today);
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
    if (!selectedDate) return false;
    const sel = new Date(selectedDate);
    return (
      d === sel.getDate() &&
      m === sel.getMonth() &&
      y === sel.getFullYear()
    );
  };

  // Generate calendar grid cells
  const calendarCells = [];

  // Previous month padding days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const cellDate = new Date(year, month - 1, dayNum);
    calendarCells.push({
      day: dayNum,
      month: month - 1,
      year: year,
      date: cellDate,
      isCurrentMonth: false
    });
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    calendarCells.push({
      day: d,
      month: month,
      year: year,
      date: cellDate,
      isCurrentMonth: true
    });
  }

  // Next month padding days to fill 35 or 42 cells
  const remainingCells = (calendarCells.length > 35 ? 42 : 35) - calendarCells.length;
  for (let d = 1; d <= remainingCells; d++) {
    const cellDate = new Date(year, month + 1, d);
    calendarCells.push({
      day: d,
      month: month + 1,
      year: year,
      date: cellDate,
      isCurrentMonth: false
    });
  }

  const formattedSelected = selectedDate ? new Date(selectedDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }) : "None";

  return (
    <div className="dashboard-calendar-card">
      <div className="cal-header">
        <div className="cal-title-area">
          <div className="cal-icon">📅</div>
          <div>
            <h3>Activity Calendar</h3>
            <p className="cal-selected-label">Selected: <strong>{formattedSelected}</strong></p>
          </div>
        </div>

        <div className="cal-nav-controls">
          <button className="cal-btn-today" onClick={jumpToToday}>
            Today
          </button>
          <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
            ‹
          </button>
          <span className="cal-month-display">
            {MONTH_NAMES[month]} {year}
          </span>
          <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">
            ›
          </button>
        </div>
      </div>

      <div className="cal-grid">
        <div className="cal-weekdays">
          {DAYS_OF_WEEK.map((day) => (
            <div key={day} className="cal-weekday">
              {day}
            </div>
          ))}
        </div>

        <div className="cal-days-grid">
          {calendarCells.map((cell, idx) => {
            const dateKey = `${cell.date.getFullYear()}-${String(cell.date.getMonth() + 1).padStart(2, "0")}-${String(cell.date.getDate()).padStart(2, "0")}`;
            const hasActivity = loggedDays[dateKey];
            const selected = isSelected(cell.day, cell.month, cell.year);
            const today = isToday(cell.day, cell.month, cell.year);

            return (
              <button
                key={idx}
                type="button"
                className={`cal-day-cell ${!cell.isCurrentMonth ? "other-month" : ""} ${selected ? "selected" : ""} ${today ? "today" : ""}`}
                onClick={() => onSelectDate(cell.date)}
              >
                <span className="cal-day-number">{cell.day}</span>
                {hasActivity && (
                  <span
                    className="cal-activity-dot"
                    title={`Logged: ${hasActivity.workouts || 0} workouts, ${hasActivity.calories || 0} kcal`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="cal-footer">
        <div className="cal-legend">
          <span className="legend-item">
            <span className="cal-legend-dot today-dot"></span> Today
          </span>
          <span className="legend-item">
            <span className="cal-legend-dot active-dot"></span> Logged Data
          </span>
          <span className="legend-item">
            <span className="cal-legend-dot selected-dot"></span> Selected
          </span>
        </div>

        <div className="cal-quick-chips">
          <button
            type="button"
            className="chip-btn"
            onClick={() => onSelectDate(new Date())}
          >
            Today
          </button>
          <button
            type="button"
            className="chip-btn"
            onClick={() => {
              const yesterday = new Date();
              yesterday.setDate(yesterday.getDate() - 1);
              onSelectDate(yesterday);
            }}
          >
            Yesterday
          </button>
        </div>
      </div>
    </div>
  );
}

export default DashboardCalendar;

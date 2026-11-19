import { useState } from "react";
import "./NotificationsPage.css";

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: "reminder", icon: "💧", title: "Time to hydrate!", message: "You're 750ml away from reaching your 3.0L goal for today.", time: "15 min ago", read: false },
  { id: 2, type: "social", icon: "❤️", title: "Sarah Jenkins liked your post", message: "Sarah liked: 'Just crushed 180kg deadlift PR!'", time: "1 hour ago", read: false },
  { id: 3, type: "workout", icon: "🏆", title: "Streak Achievement Unlocked!", message: "Congratulations! You've maintained a 14-day consecutive active streak.", time: "3 hours ago", read: false },
  { id: 4, type: "social", icon: "💬", title: "Coach Alex replied to your message", message: "'Awesome set! Aim for 140kg on Thursday's session.'", time: "5 hours ago", read: true },
  { id: 5, type: "workout", icon: "👟", title: "Daily Step Goal Passed!", message: "You reached 10,240 steps today. High five!", time: "Yesterday", read: true },
  { id: 6, type: "reminder", icon: "🥗", title: "Dinner Macro Reminder", message: "You still have 35g of protein remaining to hit your target.", time: "2 days ago", read: true }
];

export function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState("all");

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function dismissNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  const filtered = notifications.filter((n) => {
    if (filter === "unread") return !n.read;
    if (filter !== "all") return n.type === filter;
    return true;
  });

  return (
    <div className="notifications-page">
      <header className="notif-header">
        <div>
          <h1>Notifications & Alerts 🔔</h1>
          <p>Stay on top of your daily workout milestones, community mentions, and hydration reminders.</p>
        </div>

        <button className="btn-mark-read" onClick={markAllRead}>
          Mark All as Read
        </button>
      </header>

      <div className="notif-filters-row">
        {[
          { key: "all", label: "All Alerts" },
          { key: "unread", label: "Unread" },
          { key: "reminder", label: "Reminders" },
          { key: "workout", label: "Workouts" },
          { key: "social", label: "Social" }
        ].map((tab) => (
          <button
            key={tab.key}
            className={`notif-tab ${filter === tab.key ? "active" : ""}`}
            onClick={() => setFilter(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="notif-list-card">
        {filtered.length > 0 ? (
          filtered.map((n) => (
            <div key={n.id} className={`notif-row ${!n.read ? "unread" : ""}`}>
              <div className="notif-icon-badge">{n.icon}</div>
              <div className="notif-content">
                <h4>{n.title}</h4>
                <p>{n.message}</p>
                <small className="notif-time">{n.time}</small>
              </div>

              <button
                className="btn-dismiss-notif"
                onClick={() => dismissNotification(n.id)}
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          ))
        ) : (
          <div className="empty-notif-box">
            <p>No notifications matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotificationsPage;

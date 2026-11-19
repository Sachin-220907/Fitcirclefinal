import "./AdminDashboardPage.css";

export function AdminDashboardPage() {
  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <h1>FitCircle Admin Control 🛡️</h1>
          <p>System metrics, platform health, user engagement, and moderation.</p>
        </div>
      </header>

      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <span>Active Users</span>
          <strong>14,820</strong>
          <small className="trend-pos">+12% this month</small>
        </div>
        <div className="admin-stat-card">
          <span>Daily Workouts Logged</span>
          <strong>3,410</strong>
          <small className="trend-pos">+8% vs yesterday</small>
        </div>
        <div className="admin-stat-card">
          <span>Nutritional Logs</span>
          <strong>8,940</strong>
          <small className="trend-pos">+15% week-over-week</small>
        </div>
        <div className="admin-stat-card">
          <span>System Latency</span>
          <strong>38 ms</strong>
          <small className="trend-stable">All systems healthy</small>
        </div>
      </div>

      <div className="admin-card">
        <h3>Platform Members Overview</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Status</th>
              <th>Workouts</th>
              <th>Role</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Alex Mercer</td>
              <td><span className="badge-active">Active</span></td>
              <td>48</td>
              <td>Athlete</td>
              <td>Nov 2026</td>
            </tr>
            <tr>
              <td>Sarah Jenkins</td>
              <td><span className="badge-active">Active</span></td>
              <td>64</td>
              <td>Athlete</td>
              <td>Oct 2026</td>
            </tr>
            <tr>
              <td>Coach Alex</td>
              <td><span className="badge-coach">Coach</span></td>
              <td>120</td>
              <td>Staff Trainer</td>
              <td>Aug 2026</td>
            </tr>
            <tr>
              <td>David Chen</td>
              <td><span className="badge-active">Active</span></td>
              <td>52</td>
              <td>Athlete</td>
              <td>Nov 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboardPage;

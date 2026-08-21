import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header.jsx';
import api from '../services/api.js';

const DashboardPage = ({ auth, onLogout }) => {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({ projects: 0, tasks: 0, users: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [projectsRes, tasksRes, usersRes] = await Promise.all([
          api.get('/projects'),
          api.get('/tasks'),
          api.get('/users'),
        ]);
        setCounts({
          projects: Array.isArray(projectsRes.data) ? projectsRes.data.length : 0,
          tasks: Array.isArray(tasksRes.data) ? tasksRes.data.length : 0,
          users: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
        });
        setRecentProjects(Array.isArray(projectsRes.data) ? projectsRes.data.slice(0, 5) : []);
      } catch (err) {
        setError(err.response?.data?.error || 'Unable to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <>
      <Header auth={auth} onLogout={onLogout} />
      <main className="page container">
        <div className="welcome-banner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>Dashboard</h1>
            <p className="subtitle">Welcome back, {auth.user?.name}. Monitor progress at a glance.</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="secondary-button" onClick={() => navigate('/projects')}>View Projects</button>
            <button className="secondary-button" onClick={() => navigate('/tasks')}>View Tasks</button>
          </div>
        </div>

        {error && <div className="alert">{error}</div>}

        <div className="metrics-grid" aria-hidden={loading}>
          <div className="metric-card">
            <div className="metric-icon" aria-hidden>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 12h18" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="metric-value">{loading ? '—' : counts.projects}</div>
              <div className="metric-label">Projects</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" aria-hidden>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M3 7h18M7 21V7" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="metric-value">{loading ? '—' : counts.tasks}</div>
              <div className="metric-label">Open tasks</div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon" aria-hidden>
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM21 21v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <div>
              <div className="metric-value">{loading ? '—' : counts.users}</div>
              <div className="metric-label">Users</div>
            </div>
          </div>
        </div>

        <div className="panel-grid" style={{ marginTop: '1rem' }}>
          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Quick Actions</h3>
            <div className="quick-links">
              <button className="quick-link" onClick={() => navigate('/projects')}>Projects</button>
              <button className="quick-link" onClick={() => navigate('/tasks')}>Tasks</button>
              <button className="quick-link" onClick={() => navigate('/teams')}>Teams</button>
              <button className="quick-link" onClick={() => navigate('/users')}>Users</button>
            </div>
          </div>

          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Recent Projects</h3>
            <ul className="recent-list">
              {recentProjects.length === 0 && <li className="muted">No recent projects</li>}
              {recentProjects.map((p) => (
                <li key={p.id} onClick={() => navigate(`/projects`)}>
                  <strong>{p.name}</strong>
                  <div className="muted" style={{ fontSize: '0.9rem' }}>{p.status} • {p.owner_name || 'Unassigned'}</div>
                </li>
              ))}
            </ul>
          </div>

          <div className="panel">
            <h3 style={{ marginTop: 0 }}>Overview</h3>
            <p className="muted">A calm, minimalist overview to help you find what matters quickly. Use the quick actions to navigate.</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default DashboardPage;

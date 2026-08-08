import { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import UsersPage from './pages/UsersPage.jsx';
import TasksPage from './pages/TasksPage.jsx';
import ProjectsPage from './pages/ProjectsPage.jsx';
import CommentsPage from './pages/CommentsPage.jsx';
import TagsPage from './pages/TagsPage.jsx';
import TeamsPage from './pages/TeamsPage.jsx';
import SettingsPage from './pages/SettingsPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import { attachToken } from './services/api.js';

function App() {
  const navigate = useNavigate();
  const [auth, setAuth] = useState({ token: null, user: null });

  useEffect(() => {
    const stored = localStorage.getItem('taskManagerAuth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setAuth(parsed);
      attachToken(parsed.token);
    }
  }, []);

  const handleLogin = (session) => {
    localStorage.setItem('taskManagerAuth', JSON.stringify(session));
    attachToken(session.token);
    setAuth(session);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('taskManagerAuth');
    attachToken(null);
    setAuth({ token: null, user: null });
    navigate('/login');
  };

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
      <Route
        path="/dashboard"
        element={<PrivateRoute auth={auth}><DashboardPage auth={auth} onLogout={handleLogout} /></PrivateRoute>}
      />
      <Route
        path="/users"
        element={<PrivateRoute auth={auth} roles={[ 'admin', 'manager' ]}><UsersPage auth={auth} onLogout={handleLogout} /></PrivateRoute>}
      />
      <Route
        path="/projects"
        element={<PrivateRoute auth={auth}><ProjectsPage auth={auth} onLogout={handleLogout} /></PrivateRoute>}
      />
      <Route
        path="/tasks"
        element={<PrivateRoute auth={auth}><TasksPage auth={auth} onLogout={handleLogout} /></PrivateRoute>}
      />
      <Route
        path="/comments"
        element={<PrivateRoute auth={auth}><CommentsPage auth={auth} onLogout={handleLogout} /></PrivateRoute>}
      />
      <Route
        path="/tags"
        element={<PrivateRoute auth={auth}><TagsPage auth={auth} onLogout={handleLogout} /></PrivateRoute>}
      />
      <Route
        path="/teams"
        element={<PrivateRoute auth={auth} roles={[ 'admin', 'manager' ]}><TeamsPage auth={auth} onLogout={handleLogout} /></PrivateRoute>}
      />
      <Route
        path="/settings"
        element={<PrivateRoute auth={auth} roles={[ 'admin', 'manager' ]}><SettingsPage auth={auth} onLogout={handleLogout} /></PrivateRoute>}
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;

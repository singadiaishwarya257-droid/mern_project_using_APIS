import { Link } from 'react-router-dom';

const Header = ({ auth, onLogout }) => (
  <header className="app-header">
    <div className="brand">Task Manager</div>
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/tasks">Tasks</Link>
      <Link to="/comments">Comments</Link>
      <Link to="/tags">Tags</Link>
      {['admin','manager'].includes(auth.user?.role) && <Link to="/teams">Teams</Link>}
      {['admin','manager'].includes(auth.user?.role) && <Link to="/settings">Settings</Link>}
      {auth.user?.role !== 'user' && <Link to="/users">Users</Link>}
      <button className="link-button" type="button" onClick={onLogout}>Logout</button>
    </nav>
  </header>
);

export default Header;

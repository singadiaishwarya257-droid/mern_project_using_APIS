import Header from '../components/Header.jsx';

const DashboardPage = ({ auth, onLogout }) => (
  <>
    <Header auth={auth} onLogout={onLogout} />
    <main className="page container">
      <div className="welcome-banner">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back, {auth.user?.name}. Monitor progress at a glance.</p>
        </div>
      </div>
      <div className="panel-grid">
        <div className="panel">Active users</div>
        <div className="panel">Open tasks</div>
        <div className="panel">Projects in progress</div>
      </div>
    </main>
  </>
);

export default DashboardPage;

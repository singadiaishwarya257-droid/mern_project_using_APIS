import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Header from '../components/Header.jsx';

const TeamsPage = ({ auth, onLogout }) => {
  const [teams, setTeams] = useState([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [message, setMessage] = useState(null);

  const loadTeams = async () => {
    try {
      const url = search ? `/teams/search?q=${encodeURIComponent(search)}` : '/teams';
      const response = await api.get(url);
      setTeams(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to load teams');
    }
  };

  useEffect(() => { loadTeams(); }, []);

  const resetForm = () => {
    setForm({ name: '', description: '' });
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/teams', form);
      setMessage('Team created successfully');
      resetForm();
      loadTeams();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to create team');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team?')) return;
    try {
      await api.delete(`/teams/${id}`);
      setMessage('Team deleted successfully');
      loadTeams();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to delete team');
    }
  };

  return (
    <>
      <Header auth={auth} onLogout={onLogout} />
      <main className="page container">
        <div className="page-title-row">
          <div>
            <h1>Teams</h1>
            <p className="subtitle">Organize teams for projects and assignments.</p>
          </div>
          <button type="button" className="primary-button" onClick={() => setFormOpen(true)}>New team</button>
        </div>

        <div className="filter-row">
          <input
            type="search"
            value={search}
            placeholder="Search teams"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadTeams()}
          />
          <button type="button" className="secondary-button" onClick={loadTeams}>Search</button>
        </div>

        {message && <div className="alert">{message}</div>}

        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr key={team.id}>
                    <td>{team.name}</td>
                    <td>{team.description || '—'}</td>
                    <td className="table-actions">
                      <button type="button" className="danger-button" onClick={() => handleDelete(team.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!teams.length && (
                  <tr>
                    <td colSpan="3">No teams found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {formOpen && (
          <div className="form-card">
            <h2>New Team</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <div className="form-actions">
                <button type="submit" className="primary-button">Save team</button>
                <button type="button" className="secondary-button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default TeamsPage;

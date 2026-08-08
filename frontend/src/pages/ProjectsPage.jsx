import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Header from '../components/Header.jsx';

const statusOptions = ['planning', 'active', 'completed', 'on hold'];

const ProjectsPage = ({ auth, onLogout }) => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', status: 'planning', start_date: '', end_date: '', owner_id: '' });
  const [message, setMessage] = useState(null);

  const loadProjects = async () => {
    try {
      const query = [];
      if (search) query.push(`q=${encodeURIComponent(search)}`);
      if (status) query.push(`status=${encodeURIComponent(status)}`);
      const url = query.length ? `/projects/search?${query.join('&')}` : '/projects';
      const response = await api.get(url);
      setProjects(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to load projects');
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ name: '', description: '', status: 'planning', start_date: '', end_date: '', owner_id: '' });
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editing) {
        await api.put(`/projects/${editing}`, form);
        setMessage('Project updated successfully');
      } else {
        await api.post('/projects', form);
        setMessage('Project created successfully');
      }
      resetForm();
      loadProjects();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to save project');
    }
  };

  const handleEdit = (project) => {
    setEditing(project.id);
    setForm({
      name: project.name,
      description: project.description || '',
      status: project.status || 'planning',
      start_date: project.start_date || '',
      end_date: project.end_date || '',
      owner_id: project.owner_id || '',
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      setMessage('Project deleted successfully');
      loadProjects();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to delete project');
    }
  };

  return (
    <>
      <Header auth={auth} onLogout={onLogout} />
      <main className="page container">
        <div className="page-title-row">
          <div>
            <h1>Projects</h1>
            <p className="subtitle">Create, update, search and manage your project portfolio.</p>
          </div>
          <button type="button" className="primary-button" onClick={() => setFormOpen(true)}>New project</button>
        </div>

        <div className="filter-row">
          <input
            type="search"
            value={search}
            placeholder="Search by name or description"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadProjects()}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button type="button" className="secondary-button" onClick={loadProjects}>Search</button>
        </div>

        {message && <div className="alert">{message}</div>}

        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Owner</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td>{project.name}</td>
                    <td>{project.status}</td>
                    <td>{project.owner_name || 'Unassigned'}</td>
                    <td>{project.start_date || '—'}</td>
                    <td>{project.end_date || '—'}</td>
                    <td className="table-actions">
                      <button type="button" onClick={() => handleEdit(project)}>Edit</button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(project.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!projects.length && (
                  <tr>
                    <td colSpan="6">No projects found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {formOpen && (
          <div className="form-card">
            <h2>{editing ? 'Edit Project' : 'New Project'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <label>
                Status
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <div className="grid-2">
                <label>
                  Start date
                  <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                </label>
                <label>
                  End date
                  <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                </label>
              </div>
              <label>
                Owner ID
                <input value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })} />
              </label>
              <div className="form-actions">
                <button type="submit" className="primary-button">Save project</button>
                <button type="button" className="secondary-button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default ProjectsPage;

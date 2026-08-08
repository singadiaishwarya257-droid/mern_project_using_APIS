import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Header from '../components/Header.jsx';

const TagsPage = ({ auth, onLogout }) => {
  const [tags, setTags] = useState([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [message, setMessage] = useState(null);

  const loadTags = async () => {
    try {
      const url = search ? `/tags/search?q=${encodeURIComponent(search)}` : '/tags';
      const response = await api.get(url);
      setTags(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to load tags');
    }
  };

  useEffect(() => { loadTags(); }, []);

  const resetForm = () => {
    setForm({ name: '' });
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/tags', form);
      setMessage('Tag created successfully');
      resetForm();
      loadTags();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to create tag');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this tag?')) return;
    try {
      await api.delete(`/tags/${id}`);
      setMessage('Tag deleted successfully');
      loadTags();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to delete tag');
    }
  };

  return (
    <>
      <Header auth={auth} onLogout={onLogout} />
      <main className="page container">
        <div className="page-title-row">
          <div>
            <h1>Tags</h1>
            <p className="subtitle">Manage reusable labels for tasks and projects.</p>
          </div>
          <button type="button" className="primary-button" onClick={() => setFormOpen(true)}>New tag</button>
        </div>

        <div className="filter-row">
          <input
            type="search"
            value={search}
            placeholder="Search tags"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadTags()}
          />
          <button type="button" className="secondary-button" onClick={loadTags}>Search</button>
        </div>

        {message && <div className="alert">{message}</div>}

        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tags.map((tag) => (
                  <tr key={tag.id}>
                    <td>{tag.name}</td>
                    <td>{tag.created_at}</td>
                    <td className="table-actions">
                      <button type="button" className="danger-button" onClick={() => handleDelete(tag.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!tags.length && (
                  <tr>
                    <td colSpan="3">No tags found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {formOpen && (
          <div className="form-card">
            <h2>New Tag</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input value={form.name} required onChange={(e) => setForm({ name: e.target.value })} />
              </label>
              <div className="form-actions">
                <button type="submit" className="primary-button">Save tag</button>
                <button type="button" className="secondary-button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default TagsPage;

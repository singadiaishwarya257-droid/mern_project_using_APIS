import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Header from '../components/Header.jsx';

const SettingsPage = ({ auth, onLogout }) => {
  const [settings, setSettings] = useState([]);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ value: '', description: '' });

  const loadSettings = async () => {
    try {
      const url = search ? `/settings/search?q=${encodeURIComponent(search)}` : '/settings';
      const response = await api.get(url);
      setSettings(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to load settings');
    }
  };

  useEffect(() => { loadSettings(); }, []);

  const handleEdit = (setting) => {
    setEditing(setting.id);
    setForm({ value: setting.value || '', description: setting.description || '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.put(`/settings/${editing}`, form);
      setMessage('Setting updated successfully');
      setEditing(null);
      setForm({ value: '', description: '' });
      loadSettings();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to update setting');
    }
  };

  return (
    <>
      <Header auth={auth} onLogout={onLogout} />
      <main className="page container">
        <div className="page-title-row">
          <div>
            <h1>Settings</h1>
            <p className="subtitle">Configure application behavior and preferences.</p>
          </div>
        </div>

        <div className="filter-row">
          <input
            type="search"
            value={search}
            placeholder="Search settings"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadSettings()}
          />
          <button type="button" className="secondary-button" onClick={loadSettings}>Search</button>
        </div>

        {message && <div className="alert">{message}</div>}

        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {settings.map((setting) => (
                  <tr key={setting.id}>
                    <td>{setting.key_name}</td>
                    <td>{setting.value}</td>
                    <td>{setting.description}</td>
                    <td className="table-actions">
                      <button type="button" onClick={() => handleEdit(setting)}>Edit</button>
                    </td>
                  </tr>
                ))}
                {!settings.length && (
                  <tr>
                    <td colSpan="4">No settings found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {editing && (
          <div className="form-card">
            <h2>Edit Setting</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Value
                <input value={form.value} required onChange={(e) => setForm({ ...form, value: e.target.value })} />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <div className="form-actions">
                <button type="submit" className="primary-button">Update setting</button>
                <button type="button" className="secondary-button" onClick={() => { setEditing(null); setForm({ value: '', description: '' }); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default SettingsPage;

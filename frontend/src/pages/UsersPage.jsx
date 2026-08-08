import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Header from '../components/Header.jsx';

const UsersPage = ({ auth, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role_id: 3, status: 'active' });
  const [message, setMessage] = useState(null);

  const loadUsers = async () => {
    try {
      const url = query ? `/users/search?q=${encodeURIComponent(query)}` : '/users';
      const response = await api.get(url);
      setUsers(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to load users');
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const resetForm = () => {
    setForm({ name: '', email: '', password: '', role_id: 3, status: 'active' });
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/auth/register', form);
      setMessage('User created successfully');
      resetForm();
      loadUsers();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to create user');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      setMessage('User deleted successfully');
      loadUsers();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to delete user');
    }
  };

  return (
    <>
      <Header auth={auth} onLogout={onLogout} />
      <main className="page container">
        <div className="page-title-row">
          <div>
            <h1>Users</h1>
            <p className="subtitle">Create and manage users with role-based access.</p>
          </div>
          <button type="button" className="primary-button" onClick={() => setFormOpen(true)}>Add user</button>
        </div>

        <div className="filter-row">
          <input
            type="search"
            value={query}
            placeholder="Search by name or email"
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadUsers()}
          />
          <button type="button" className="secondary-button" onClick={loadUsers}>Search</button>
        </div>

        {message && <div className="alert">{message}</div>}

        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role_id || 'user'}</td>
                    <td>{user.status}</td>
                    <td className="table-actions">
                      <button type="button" className="danger-button" onClick={() => handleDelete(user.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!users.length && (
                  <tr>
                    <td colSpan="5">No users found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {formOpen && (
          <div className="form-card">
            <h2>New user</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Name
                <input value={form.name} required onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </label>
              <label>
                Email
                <input type="email" value={form.email} required onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </label>
              <label>
                Password
                <input type="password" value={form.password} required onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </label>
              <div className="grid-2">
                <label>
                  Role ID
                  <input type="number" value={form.role_id} min="1" onChange={(e) => setForm({ ...form, role_id: Number(e.target.value) })} />
                </label>
                <label>
                  Status
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="active">active</option>
                    <option value="inactive">inactive</option>
                  </select>
                </label>
              </div>
              <div className="form-actions">
                <button type="submit" className="primary-button">Create user</button>
                <button type="button" className="secondary-button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default UsersPage;

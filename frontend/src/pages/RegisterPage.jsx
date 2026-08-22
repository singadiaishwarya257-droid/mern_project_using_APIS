import { useState } from 'react';
import { Link } from 'react-router-dom';
import api, { attachToken } from '../services/api.js';

const RegisterPage = ({ onRegister }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError(null);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/auth/register', {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      const session = { token: response.data.token, user: response.data.user };
      attachToken(session.token);
      onRegister(session);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page page-center">
      <div className="card auth-card">
        <h1>Create account</h1>
        <form onSubmit={submit}>
          <label>
            Name
            <input name="name" value={form.name} onChange={updateField} required autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={updateField} required autoComplete="email" />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={updateField} required minLength="8" autoComplete="new-password" />
          </label>
          <label>
            Confirm password
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={updateField} required minLength="8" autoComplete="new-password" />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={submitting}>{submitting ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;
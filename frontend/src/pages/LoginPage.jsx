import { useState } from 'react';
import api, { attachToken } from '../services/api.js';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      const session = { token: response.data.token, user: response.data.user };
      attachToken(session.token);
      onLogin(session);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <main className="page page-center">
      <div className="card auth-card">
        <h1>Login</h1>
        <form onSubmit={submit}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          {error && <div className="error-message">{error}</div>}
          <button type="submit">Sign in</button>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;

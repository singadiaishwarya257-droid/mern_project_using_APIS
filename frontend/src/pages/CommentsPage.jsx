import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Header from '../components/Header.jsx';

const CommentsPage = ({ auth, onLogout }) => {
  const [comments, setComments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState({ content: '', task_id: '' });
  const [message, setMessage] = useState(null);

  const loadComments = async () => {
    try {
      const url = search ? `/comments/search?q=${encodeURIComponent(search)}` : '/comments';
      const response = await api.get(url);
      setComments(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to load comments');
    }
  };

  const loadTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to load tasks');
    }
  };

  useEffect(() => {
    loadComments();
    loadTasks();
  }, []);

  const resetForm = () => {
    setForm({ content: '', task_id: '' });
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        task_id: form.task_id ? Number(form.task_id) : null,
      };

      if (!payload.task_id) {
        setMessage('Please select a valid task.');
        return;
      }

      await api.post('/comments', payload);
      setMessage('Comment created successfully');
      resetForm();
      loadComments();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to create comment');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await api.delete(`/comments/${id}`);
      setMessage('Comment deleted successfully');
      loadComments();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to delete comment');
    }
  };

  return (
    <>
      <Header auth={auth} onLogout={onLogout} />
      <main className="page container">
        <div className="page-title-row">
          <div>
            <h1>Comments</h1>
            <p className="subtitle">Add, search, and manage task comments.</p>
          </div>
          <button type="button" className="primary-button" onClick={() => setFormOpen(true)}>New comment</button>
        </div>

        <div className="filter-row">
          <input
            type="search"
            value={search}
            placeholder="Search comments"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadComments()}
          />
          <button type="button" className="secondary-button" onClick={loadComments}>Search</button>
        </div>

        {message && <div className="alert">{message}</div>}

        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Content</th>
                  <th>Task</th>
                  <th>Author</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {comments.map((comment) => (
                  <tr key={comment.id}>
                    <td>{comment.content}</td>
                    <td>{comment.task_title}</td>
                    <td>{comment.author}</td>
                    <td>{comment.created_at}</td>
                    <td className="table-actions">
                      <button type="button" className="danger-button" onClick={() => handleDelete(comment.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!comments.length && (
                  <tr>
                    <td colSpan="5">No comments found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {formOpen && (
          <div className="form-card">
            <h2>New Comment</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Content
                <textarea value={form.content} required onChange={(e) => setForm({ ...form, content: e.target.value })} />
              </label>
              <label>
                Task
                <select value={form.task_id} required onChange={(e) => setForm({ ...form, task_id: e.target.value })}>
                  <option value="">Select task</option>
                  {tasks.map((task) => (
                    <option key={task.id} value={task.id}>
                      {task.title ? `${task.title} (#${task.id})` : `Task #${task.id}`}
                    </option>
                  ))}
                </select>
              </label>
              <div className="form-actions">
                <button type="submit" className="primary-button">Save comment</button>
                <button type="button" className="secondary-button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default CommentsPage;

import { useEffect, useState } from 'react';
import api from '../services/api.js';
import Header from '../components/Header.jsx';

const statusOptions = ['todo', 'in-progress', 'review', 'done'];
const priorityOptions = ['low', 'medium', 'high', 'critical'];

const TasksPage = ({ auth, onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '', project_id: '', assignee_id: '' });
  const [message, setMessage] = useState(null);

  const loadTasks = async () => {
    try {
      const query = [];
      if (search) query.push(`q=${encodeURIComponent(search)}`);
      if (status) query.push(`status=${encodeURIComponent(status)}`);
      if (priority) query.push(`priority=${encodeURIComponent(priority)}`);
      const url = query.length ? `/tasks/search?${query.join('&')}` : '/tasks';
      const response = await api.get(url);
      setTasks(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to load tasks');
    }
  };

  const loadProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to load projects');
    }
  };

  useEffect(() => {
    loadTasks();
    loadProjects();
  }, []);

  const resetForm = () => {
    setEditing(null);
    setForm({ title: '', description: '', status: 'todo', priority: 'medium', due_date: '', project_id: '', assignee_id: '' });
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const payload = {
        ...form,
        project_id: form.project_id?.toString().trim() ? Number(form.project_id) : null,
        assignee_id: form.assignee_id?.toString().trim() ? Number(form.assignee_id) : null,
        due_date: form.due_date || null,
      };
      if (editing) {
        await api.put(`/tasks/${editing}`, payload);
        setMessage('Task updated successfully');
      } else {
        await api.post('/tasks', payload);
        setMessage('Task created successfully');
      }
      resetForm();
      loadTasks();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to save task');
    }
  };

  const handleEdit = (task) => {
    setEditing(task.id);
    setForm({
      title: task.title,
      description: task.description || '',
      status: task.status || 'todo',
      priority: task.priority || 'medium',
      due_date: task.due_date || '',
      project_id: task.project_id || '',
      assignee_id: task.assignee_id || '',
    });
    setFormOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setMessage('Task deleted successfully');
      loadTasks();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unable to delete task');
    }
  };

  return (
    <>
      <Header auth={auth} onLogout={onLogout} />
      <main className="page container">
        <div className="page-title-row">
          <div>
            <h1>Tasks</h1>
            <p className="subtitle">Track work items, assign ownership, and keep priorities visible.</p>
          </div>
          <button type="button" className="primary-button" onClick={() => setFormOpen(true)}>Add task</button>
        </div>

        <div className="filter-row">
          <input
            type="search"
            value={search}
            placeholder="Search tasks"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && loadTasks()}
          />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All statuses</option>
            {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All priorities</option>
            {priorityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button type="button" className="secondary-button" onClick={loadTasks}>Search</button>
        </div>

        {message && <div className="alert">{message}</div>}

        <div className="table-card">
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Project</th>
                  <th>Due date</th>
                  <th>Assignee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.status}</td>
                    <td>{task.priority}</td>
                    <td>{task.project_name || 'Unassigned'}</td>
                    <td>{task.due_date || '—'}</td>
                    <td>{task.assignee_name || '—'}</td>
                    <td className="table-actions">
                      <button type="button" onClick={() => handleEdit(task)}>Edit</button>
                      <button type="button" className="danger-button" onClick={() => handleDelete(task.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
                {!tasks.length && (
                  <tr>
                    <td colSpan="7">No tasks found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {formOpen && (
          <div className="form-card">
            <h2>{editing ? 'Edit Task' : 'New Task'}</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Title
                <input value={form.title} required onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </label>
              <label>
                Description
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <div className="grid-2">
                <label>
                  Status
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {statusOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
                <label>
                  Priority
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                    {priorityOptions.map((item) => <option key={item} value={item}>{item}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid-2">
                <label>
                  Due date
                  <input type="date" value={form.due_date} onChange={(e) => setForm({ ...form, due_date: e.target.value })} />
                </label>
                <label>
                  Project
                  <select value={form.project_id} onChange={(e) => setForm({ ...form, project_id: e.target.value })}>
                    <option value="">None</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>{project.name}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label>
                Assignee ID
                <input value={form.assignee_id} onChange={(e) => setForm({ ...form, assignee_id: e.target.value })} />
              </label>
              <div className="form-actions">
                <button type="submit" className="primary-button">Save task</button>
                <button type="button" className="secondary-button" onClick={resetForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </>
  );
};

export default TasksPage;

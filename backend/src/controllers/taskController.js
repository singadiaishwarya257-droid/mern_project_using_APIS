import { pool } from '../config/db.js';

export const getTasks = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, t.project_id, p.name AS project_name, t.assignee_id, u.name AS assignee_name
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       LEFT JOIN users u ON u.id = t.assignee_id
       ORDER BY t.updated_at DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, t.project_id, p.name AS project_name, t.assignee_id, u.name AS assignee_name
       FROM tasks t
       LEFT JOIN projects p ON p.id = t.project_id
       LEFT JOIN users u ON u.id = t.assignee_id
       WHERE t.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Task not found' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, due_date, project_id, assignee_id } = req.body;
    await pool.query(
      'INSERT INTO tasks (title, description, status, priority, due_date, project_id, assignee_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [title, description, status || 'todo', priority || 'medium', due_date, project_id, assignee_id]
    );
    return res.status(201).json({ message: 'Task created successfully' });
  } catch (error) {
    return next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, due_date, project_id, assignee_id } = req.body;
    await pool.query(
      'UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status), priority = COALESCE(?, priority), due_date = COALESCE(?, due_date), project_id = COALESCE(?, project_id), assignee_id = COALESCE(?, assignee_id), updated_at = NOW() WHERE id = ?',
      [title, description, status, priority, due_date, project_id, assignee_id, req.params.id]
    );
    return res.json({ message: 'Task updated successfully' });
  } catch (error) {
    return next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const searchTasks = async (req, res, next) => {
  try {
    const { q, status, priority } = req.query;
    const search = `%${q || ''}%`;
    const params = [search, search];
    let query = `SELECT t.id, t.title, t.description, t.status, t.priority, t.due_date, t.project_id, p.name AS project_name, t.assignee_id, u.name AS assignee_name
      FROM tasks t
      LEFT JOIN projects p ON p.id = t.project_id
      LEFT JOIN users u ON u.id = t.assignee_id
      WHERE (t.title LIKE ? OR t.description LIKE ?)`;
    if (status) {
      query += ' AND t.status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND t.priority = ?';
      params.push(priority);
    }
    query += ' ORDER BY t.updated_at DESC';
    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

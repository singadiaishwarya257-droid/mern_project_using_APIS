import { pool } from '../config/db.js';

export const getProjects = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.description, p.status, p.start_date, p.end_date, p.owner_id, u.name AS owner_name
       FROM projects p
       LEFT JOIN users u ON u.id = p.owner_id
       ORDER BY p.created_at DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT p.id, p.name, p.description, p.status, p.start_date, p.end_date, p.owner_id, u.name AS owner_name
       FROM projects p
       LEFT JOIN users u ON u.id = p.owner_id
       WHERE p.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Project not found' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { name, description, status, start_date, end_date, owner_id } = req.body;
    await pool.query(
      'INSERT INTO projects (name, description, status, start_date, end_date, owner_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [name, description, status || 'planning', start_date, end_date, owner_id]
    );
    return res.status(201).json({ message: 'Project created successfully' });
  } catch (error) {
    return next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { name, description, status, start_date, end_date, owner_id } = req.body;
    await pool.query(
      'UPDATE projects SET name = COALESCE(?, name), description = COALESCE(?, description), status = COALESCE(?, status), start_date = COALESCE(?, start_date), end_date = COALESCE(?, end_date), owner_id = COALESCE(?, owner_id), updated_at = NOW() WHERE id = ?',
      [name, description, status, start_date, end_date, owner_id, req.params.id]
    );
    return res.json({ message: 'Project updated successfully' });
  } catch (error) {
    return next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM projects WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const searchProjects = async (req, res, next) => {
  try {
    const { q, status } = req.query;
    const search = `%${q || ''}%`;
    const params = [search, search];
    let query = `SELECT p.id, p.name, p.description, p.status, p.start_date, p.end_date, p.owner_id, u.name AS owner_name
      FROM projects p
      LEFT JOIN users u ON u.id = p.owner_id
      WHERE (p.name LIKE ? OR p.description LIKE ?)`;
    if (status) {
      query += ' AND p.status = ?';
      params.push(status);
    }
    query += ' ORDER BY p.updated_at DESC';
    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

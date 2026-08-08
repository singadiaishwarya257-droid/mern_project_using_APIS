import { pool } from '../config/db.js';

export const getRoles = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, description FROM roles');
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const getRoleById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, description FROM roles WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Role not found' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const createRole = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    await pool.query('INSERT INTO roles (name, description) VALUES (?, ?)', [name, description]);
    return res.status(201).json({ message: 'Role created successfully' });
  } catch (error) {
    return next(error);
  }
};

export const updateRole = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    await pool.query('UPDATE roles SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?', [name, description, req.params.id]);
    return res.json({ message: 'Role updated successfully' });
  } catch (error) {
    return next(error);
  }
};

export const deleteRole = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM roles WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Role deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

import { pool } from '../config/db.js';

export const getUsers = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role_id, status, created_at FROM users ORDER BY created_at DESC');
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const getUserById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, email, role_id, status, created_at FROM users WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'User not found' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const { name, status, role_id } = req.body;
    await pool.query('UPDATE users SET name = COALESCE(?, name), status = COALESCE(?, status), role_id = COALESCE(?, role_id), updated_at = NOW() WHERE id = ?', [name, status, role_id, req.params.id]);
    return res.json({ message: 'User updated successfully' });
  } catch (error) {
    return next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { q } = req.query;
    const search = `%${q || ''}%`;
    const [rows] = await pool.query('SELECT id, name, email, role_id, status FROM users WHERE name LIKE ? OR email LIKE ? ORDER BY created_at DESC', [search, search]);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

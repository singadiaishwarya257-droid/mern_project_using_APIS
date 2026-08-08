import { pool } from '../config/db.js';

export const getSettings = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, key_name, value, description FROM settings ORDER BY key_name ASC');
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const getSettingById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, key_name, value, description FROM settings WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Setting not found' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const updateSetting = async (req, res, next) => {
  try {
    const { value, description } = req.body;
    await pool.query('UPDATE settings SET value = COALESCE(?, value), description = COALESCE(?, description) WHERE id = ?', [value, description, req.params.id]);
    return res.json({ message: 'Setting updated successfully' });
  } catch (error) {
    return next(error);
  }
};

export const searchSettings = async (req, res, next) => {
  try {
    const { q } = req.query;
    const search = `%${q || ''}%`;
    const [rows] = await pool.query('SELECT id, key_name, value, description FROM settings WHERE key_name LIKE ? OR description LIKE ? ORDER BY key_name ASC', [search, search]);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

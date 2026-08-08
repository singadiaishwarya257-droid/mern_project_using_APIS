import { pool } from '../config/db.js';

export const getTags = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, created_at FROM tags ORDER BY name ASC');
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const getTagById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name FROM tags WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Tag not found' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    await pool.query('INSERT INTO tags (name) VALUES (?)', [name]);
    return res.status(201).json({ message: 'Tag created successfully' });
  } catch (error) {
    return next(error);
  }
};

export const updateTag = async (req, res, next) => {
  try {
    const { name } = req.body;
    await pool.query('UPDATE tags SET name = COALESCE(?, name) WHERE id = ?', [name, req.params.id]);
    return res.json({ message: 'Tag updated successfully' });
  } catch (error) {
    return next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM tags WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Tag deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const searchTags = async (req, res, next) => {
  try {
    const { q } = req.query;
    const search = `%${q || ''}%`;
    const [rows] = await pool.query('SELECT id, name FROM tags WHERE name LIKE ? ORDER BY name ASC', [search]);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

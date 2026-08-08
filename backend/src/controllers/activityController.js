import { pool } from '../config/db.js';

export const getActivities = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.entity_type, a.entity_id, a.action, a.user_id, u.name AS user_name, a.created_at
       FROM activities a
       LEFT JOIN users u ON u.id = a.user_id
       ORDER BY a.created_at DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const getActivityById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT a.id, a.entity_type, a.entity_id, a.action, a.user_id, u.name AS user_name, a.created_at
       FROM activities a
       LEFT JOIN users u ON u.id = a.user_id
       WHERE a.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Activity not found' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const createActivity = async (req, res, next) => {
  try {
    const { entity_type, entity_id, action } = req.body;
    await pool.query('INSERT INTO activities (entity_type, entity_id, action, user_id, created_at) VALUES (?, ?, ?, ?, NOW())', [entity_type, entity_id, action, req.user.id]);
    return res.status(201).json({ message: 'Activity logged successfully' });
  } catch (error) {
    return next(error);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const { action } = req.body;
    await pool.query('UPDATE activities SET action = COALESCE(?, action) WHERE id = ?', [action, req.params.id]);
    return res.json({ message: 'Activity updated successfully' });
  } catch (error) {
    return next(error);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM activities WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const searchActivities = async (req, res, next) => {
  try {
    const { q, entity_type } = req.query;
    const search = `%${q || ''}%`;
    const params = [search, search];
    let query = `SELECT a.id, a.entity_type, a.entity_id, a.action, a.user_id, u.name AS user_name, a.created_at
      FROM activities a
      LEFT JOIN users u ON u.id = a.user_id
      WHERE (a.action LIKE ? OR u.name LIKE ?)`;
    if (entity_type) {
      query += ' AND a.entity_type = ?';
      params.push(entity_type);
    }
    query += ' ORDER BY a.created_at DESC';
    const [rows] = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

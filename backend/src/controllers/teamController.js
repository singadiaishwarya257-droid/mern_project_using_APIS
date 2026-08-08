import { pool } from '../config/db.js';

export const getTeams = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, description, created_at FROM teams ORDER BY created_at DESC');
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const getTeamById = async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT id, name, description FROM teams WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: 'Team not found' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const createTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    await pool.query('INSERT INTO teams (name, description, created_at) VALUES (?, ?, NOW())', [name, description]);
    return res.status(201).json({ message: 'Team created successfully' });
  } catch (error) {
    return next(error);
  }
};

export const updateTeam = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    await pool.query('UPDATE teams SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?', [name, description, req.params.id]);
    return res.json({ message: 'Team updated successfully' });
  } catch (error) {
    return next(error);
  }
};

export const deleteTeam = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM teams WHERE id = ?', [req.params.id]);
    return res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const searchTeams = async (req, res, next) => {
  try {
    const { q } = req.query;
    const search = `%${q || ''}%`;
    const [rows] = await pool.query('SELECT id, name, description FROM teams WHERE name LIKE ? OR description LIKE ? ORDER BY created_at DESC', [search, search]);
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

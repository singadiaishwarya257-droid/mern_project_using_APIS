import { pool } from '../config/db.js';

export const getComments = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.content, c.task_id, t.title AS task_title, c.user_id, u.name AS author, c.created_at
       FROM comments c
       LEFT JOIN tasks t ON t.id = c.task_id
       LEFT JOIN users u ON u.id = c.user_id
       ORDER BY c.created_at DESC`
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

export const getCommentById = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.id, c.content, c.task_id, t.title AS task_title, c.user_id, u.name AS author, c.created_at
       FROM comments c
       LEFT JOIN tasks t ON t.id = c.task_id
       LEFT JOIN users u ON u.id = c.user_id
       WHERE c.id = ?`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Comment not found' });
    return res.json(rows[0]);
  } catch (error) {
    return next(error);
  }
};

export const createComment = async (req, res, next) => {
  try {
    const { content, task_id } = req.body;
    await pool.query('INSERT INTO comments (content, task_id, user_id, created_at) VALUES (?, ?, ?, NOW())', [content, task_id, req.user.id]);
    return res.status(201).json({ message: 'Comment created successfully' });
  } catch (error) {
    return next(error);
  }
};

export const updateComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    await pool.query('UPDATE comments SET content = COALESCE(?, content) WHERE id = ? AND user_id = ?', [content, req.params.id, req.user.id]);
    return res.json({ message: 'Comment updated successfully' });
  } catch (error) {
    return next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await pool.query('DELETE FROM comments WHERE id = ? AND (user_id = ? OR ? IN (SELECT id FROM users WHERE role_id = 1))', [req.params.id, req.user.id, req.user.id]);
    return res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export const searchComments = async (req, res, next) => {
  try {
    const { q } = req.query;
    const search = `%${q || ''}%`;
    const [rows] = await pool.query(
      `SELECT c.id, c.content, c.task_id, t.title AS task_title, c.user_id, u.name AS author, c.created_at
       FROM comments c
       LEFT JOIN tasks t ON t.id = c.task_id
       LEFT JOIN users u ON u.id = c.user_id
       WHERE c.content LIKE ? OR t.title LIKE ?
       ORDER BY c.created_at DESC`,
      [search, search]
    );
    return res.json(rows);
  } catch (error) {
    return next(error);
  }
};

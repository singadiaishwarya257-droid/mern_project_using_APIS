import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { pool } from '../config/db.js';

dotenv.config();

const signToken = (user) => jwt.sign(
  { id: user.id, name: user.name, email: user.email, role: user.role_name },
  process.env.JWT_SECRET,
  { expiresIn: '8h' }
);

export const register = async (req, res, next) => {
  try {
    const { name, email, password, role_id = 2 } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Name, email and password are required' });

    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) return res.status(409).json({ error: 'Email already registered' });

    // Validate provided role_id exists to avoid foreign key errors
    const [roleRows] = await pool.query('SELECT id FROM roles WHERE id = ?', [role_id]);
    if (!roleRows.length) return res.status(400).json({ error: 'Invalid role_id' });

    const password_hash = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, role_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, NOW(), NOW())',
      [name, email, password_hash, role_id, 'active']
    );

    const [[userRole]] = await pool.query('SELECT name AS role_name FROM roles WHERE id = ?', [role_id]);

    const token = signToken({ id: result.insertId, name, email, role_name: userRole?.role_name ?? 'user' });
    return res.status(201).json({ token, user: { id: result.insertId, name, email, role: userRole?.role_name ?? 'user' } });
  } catch (error) {
    return next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

    const [[user]] = await pool.query(
      'SELECT u.id, u.name, u.email, u.password_hash, r.name AS role_name FROM users u JOIN roles r ON u.role_id = r.id WHERE u.email = ?',
      [email]
    );

    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role_name } });
  } catch (error) {
    return next(error);
  }
};

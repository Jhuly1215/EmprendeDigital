// backend/src/services/auth.service.js
import { pool } from '../db/mysql.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function signToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

export async function register({ name, email, password }) {
  if (!email || !password) return { ok: false, error: 'email and password required' };
  const hash = await bcrypt.hash(password, 10);
  try {
    const [exists] = await pool.query(`SELECT id FROM users WHERE email=?`, [email]);
    if (exists.length) return { ok: false, error: 'email already registered' };

    const [ins] = await pool.query(
      `INSERT INTO users (name,email,password_hash) VALUES (?,?,?)`,
      [name || null, email, hash]
    );
    const user = { id: ins.insertId, name, email };
    const token = signToken(user);
    return { ok: true, token, user };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}

export async function login({ email, password }) {
  if (!email || !password) return { ok: false, error: 'email and password required' };
  const [rows] = await pool.query(
    `SELECT id,name,email,password_hash FROM users WHERE email=? LIMIT 1`,
    [email]
  );
  const u = rows[0];
  if (!u || !u.password_hash) return { ok: false, error: 'invalid credentials' };
  const ok = await bcrypt.compare(password, u.password_hash);
  if (!ok) return { ok: false, error: 'invalid credentials' };
  const token = signToken(u);
  return { ok: true, token, user: { id: u.id, name: u.name, email: u.email } };
}

export async function me(userId) {
  const [rows] = await pool.query(
    `SELECT id,name,email,created_at FROM users WHERE id=?`,
    [userId]
  );
  return { ok: true, user: rows[0] || null };
}

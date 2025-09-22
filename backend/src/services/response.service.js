// backend/src/services/response.service.js
import { pool } from '../db/mysql.js';

export async function saveResponsesForUser(userId, answers) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const a of answers || []) {
      await conn.query(
        `REPLACE INTO responses (user_id,question_id,option_id) VALUES (?,?,?)`,
        [userId, a.question_id, a.option_id]
      );
    }
    await conn.commit();
    return { ok: true, user_id: userId };
  } catch (e) {
    await conn.rollback();
    return { ok: false, error: e.message };
  } finally {
    conn.release();
  }
}

/* Modo legacy: crea/actualiza usuario por email si no hay token */
export async function saveResponsesLegacy({ user, answers }) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [u] = await conn.query(`SELECT id FROM users WHERE email=?`, [user.email]);
    let userId = u[0]?.id;
    if (!userId) {
      const [ins] = await conn.query(
        `INSERT INTO users(name,email) VALUES(?,?)`,
        [user.name || null, user.email]
      );
      userId = ins.insertId;
    } else if (user.name) {
      await conn.query(`UPDATE users SET name=? WHERE id=?`, [user.name, userId]);
    }
    for (const a of answers || []) {
      await conn.query(
        `REPLACE INTO responses (user_id,question_id,option_id) VALUES (?,?,?)`,
        [userId, a.question_id, a.option_id]
      );
    }
    await conn.commit();
    return { ok: true, user_id: userId };
  } catch (e) {
    await conn.rollback();
    return { ok: false, error: e.message };
  } finally {
    conn.release();
  }
}

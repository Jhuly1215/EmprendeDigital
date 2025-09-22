// backend/src/services/content.service.js
import { pool } from '../db/mysql.js';

export async function listPlatforms() {
  const [p] = await pool.query(`SELECT id,name,category FROM platforms ORDER BY name`);
  const ids = p.map(x => x.id);
  const [t] = ids.length
    ? await pool.query(
        `SELECT id,platform_id,name,kind,website FROM tools WHERE platform_id IN (?) ORDER BY name`,
        [ids]
      )
    : [[]];
  const items = p.map(pl => ({
    ...pl,
    tools: t.filter(k => k.platform_id === pl.id),
  }));
  return { items };
}

export async function listTutorials({ platform, tool }) {
  const params = [];
  let where = [];
  if (platform) {
    where.push(`p.name = ?`);
    params.push(platform);
  }
  if (tool) {
    where.push(`t.name = ?`);
    params.push(tool);
  }
  const sql = `
    SELECT tut.title, tut.url, COALESCE(p.name,'') AS plataforma,
           COALESCE(t.name,'') AS herramienta, tut.level
    FROM tutorials tut
    LEFT JOIN platforms p ON p.id=tut.platform_id
    LEFT JOIN tools t ON t.id=tut.tool_id
    ${where.length ? 'WHERE ' + where.join(' AND ') : ''}
    ORDER BY FIELD(tut.level,'Básico','Intermedio','Avanzado'), tut.title
    LIMIT 50
  `;
  const [rows] = await pool.query(sql, params);
  return { items: rows };
}

// backend/src/services/diagnosis.service.js
import { pool } from '../db/mysql.js';

export async function buildDiagnosis(userId) {
  // plataformas
  const [plat] = await pool.query(
    `
    SELECT p.name AS name, ROUND(SUM(rr.weight),2) AS score
    FROM responses r
    JOIN recommendation_rules rr ON rr.question_id=r.question_id AND rr.option_id=r.option_id
    JOIN platforms p ON p.id=rr.platform_id
    WHERE r.user_id=?
    GROUP BY p.name
    ORDER BY score DESC
    LIMIT 5
  `,
    [userId]
  );

  // herramientas
  const [tools] = await pool.query(
    `
    SELECT t.name AS name, ROUND(SUM(rr.weight),2) AS score
    FROM responses r
    JOIN recommendation_rules rr ON rr.question_id=r.question_id AND rr.option_id=r.option_id
    JOIN tools t ON t.id=rr.tool_id
    WHERE r.user_id=?
    GROUP BY t.name
    ORDER BY score DESC
    LIMIT 5
  `,
    [userId]
  );

  // arquetipo por P2
  const [p2] = await pool.query(
    `
    SELECT o.code
    FROM responses r
    JOIN questions q ON q.id=r.question_id
    JOIN options o ON o.id=r.option_id
    WHERE r.user_id=? AND q.q_number=2
    LIMIT 1
  `,
    [userId]
  );
  const map = {
    a: 'E-commerce Builder',
    b: 'Social Marketer',
    c: 'Content Creator',
    d: 'Tech Maker',
    e: 'Consultor/Infoproductos',
  };
  const archetype = map[p2[0]?.code] || 'Emprendedor Digital';

  // tutoriales
  const platNames = plat.map(p => p.name);
  const toolNames = tools.map(t => t.name);
  const [tuts] = await pool.query(
    `
    SELECT tut.title, tut.url,
           COALESCE(p.name,'') AS plataforma,
           COALESCE(t.name,'') AS herramienta,
           tut.level
    FROM tutorials tut
    LEFT JOIN platforms p ON p.id=tut.platform_id
    LEFT JOIN tools t ON t.id=tut.tool_id
    WHERE ( (? = 0) OR p.name IN (?))
       OR ( (? = 0) OR t.name IN (?))
    ORDER BY FIELD(tut.level,'Básico','Intermedio','Avanzado'), tut.title
    LIMIT 20
  `,
    [platNames.length, platNames, toolNames.length, toolNames]
  );

  return { user_id: userId, archetype, platforms: plat, tools, tutorials: tuts };
}

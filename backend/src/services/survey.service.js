// backend/src/services/survey.service.js
import { pool } from '../db/mysql.js';

export async function getSurvey() {
  const [srows] = await pool.query(
    `SELECT id,title,description FROM surveys WHERE is_active=1 ORDER BY id DESC LIMIT 1`
  );
  const survey = srows[0];
  if (!survey) return { survey: null, questions: [] };

  const [qrows] = await pool.query(
    `SELECT id,q_number,text FROM questions WHERE survey_id=? ORDER BY q_number`,
    [survey.id]
  );
  const ids = qrows.map(q => q.id);
  const [orows] = ids.length
    ? await pool.query(
        `SELECT id,question_id,code,text FROM options WHERE question_id IN (?) ORDER BY code`,
        [ids]
      )
    : [[]];

  const questions = qrows.map(q => ({
    ...q,
    options: orows.filter(o => o.question_id === q.id),
  }));
  return { survey, questions };
}

export async function getStats() {
  const [rows] = await pool.query(`
    SELECT q.q_number, o.code, o.text, COUNT(r.option_id) AS votos
    FROM surveys s
    JOIN questions q ON q.survey_id=s.id
    JOIN options o ON o.question_id=q.id
    LEFT JOIN responses r ON r.question_id=q.id AND r.option_id=o.id
    WHERE s.is_active=1
    GROUP BY q.q_number, o.code, o.text
    ORDER BY q.q_number, o.code
  `);
  return { stats: rows };
}

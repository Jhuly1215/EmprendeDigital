// backend/src/routes/response.routes.js
/**
 * @swagger
 * /api/responses:
 *   post:
 *     tags: [Responses]
 *     summary: Guarda/actualiza respuestas del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SaveResponsesPayload'
 *     responses:
 *       200:
 *         description: Resultado de guardado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaveResponsesResult'
 */
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.js';
import { saveResponsesForUser, saveResponsesLegacy } from '../services/response.service.js';
const router = Router();

/**
 * Requiere token y solo recibe {answers:[{question_id,option_id},...]}
 */
router.post('/', requireAuth, async (req, res) => {
  const { answers, user } = req.body || {};
  if (answers && Array.isArray(answers)) {
    const out = await saveResponsesForUser(req.user.id, answers);
    return res.json(out);
  }
  // Soporte legacy (user + answers)
  if (user && answers) {
    const out = await saveResponsesLegacy({ user, answers });
    return res.json(out);
  }
  res.status(400).json({ ok: false, error: 'invalid payload' });
});

export default router;
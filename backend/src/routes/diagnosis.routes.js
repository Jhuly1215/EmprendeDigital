// backend/src/routes/diagnosis.routes.js
/**
 * @swagger
 * /api/diagnosis/{userId}:
 *   get:
 *     tags: [Diagnosis]
 *     summary: Construye diagnóstico para un usuario
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Diagnóstico calculado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Diagnosis'
 */
import { Router } from 'express';
import { buildDiagnosis } from '../services/diagnosis.service.js';
const router = Router();

router.get('/:userId', async (req, res) => {
  const data = await buildDiagnosis(+req.params.userId);
  res.json(data);
});
export default router;

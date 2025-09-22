// backend/src/routes/survey.routes.js
/**
 * @swagger
 * /api/survey:
 *   get:
 *     tags: [Survey]
 *     summary: Obtiene encuesta activa con preguntas y opciones
 *     responses:
 *       200:
 *         description: Encuesta actual
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SurveyResponse'
 */
/**
 * @swagger
 * /api/survey/stats:
 *   get:
 *     tags: [Survey]
 *     summary: Estadísticas agregadas por pregunta/opción
 *     responses:
 *       200:
 *         description: Conteos por opción
 */
import { Router } from 'express';
import { getSurvey, getStats } from '../services/survey.service.js';
const router = Router();

router.get('/', async (_req, res) => res.json(await getSurvey()));
router.get('/stats', async (_req, res) => res.json(await getStats()));
export default router;

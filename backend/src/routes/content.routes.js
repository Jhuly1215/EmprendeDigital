// backend/src/routes/content.routes.js
/**
 * @swagger
 * /api/content/platforms:
 *   get:
 *     tags: [Content]
 *     summary: Lista plataformas y sus herramientas
 *     responses:
 *       200:
 *         description: Catálogo
 */
/**
 * @swagger
 * /api/content/tutorials:
 *   get:
 *     tags: [Content]
 *     summary: Lista tutoriales (filtrable por plataforma/herramienta)
 *     parameters:
 *       - in: query
 *         name: platform
 *         schema: { type: string }
 *       - in: query
 *         name: tool
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Tutoriales
 */
import { Router } from 'express';
import { listPlatforms, listTutorials } from '../services/content.service.js';
const router = Router();

router.get('/platforms', async (_req, res) => res.json(await listPlatforms()));
router.get('/tutorials', async (req, res) => {
  const { platform, tool } = req.query;
  res.json(await listTutorials({ platform, tool }));
});
export default router;

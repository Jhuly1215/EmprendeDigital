// backend/src/routes/auth.routes.js
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Registro de usuario (email + password)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: OK }
 *
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login (email + password) → JWT
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string, format: password }
 *     responses:
 *       200: { description: OK }
 *
 * /api/me:
 *   get:
 *     tags: [Auth]
 *     summary: Perfil del usuario autenticado
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: OK }
 */
import { Router } from 'express';
import { register, login, me } from '../services/auth.service.js';
import { requireAuth } from '../middlewares/auth.js';

const router = Router();
router.post('/register', async (req, res) => res.json(await register(req.body)));
router.post('/login', async (req, res) => res.json(await login(req.body)));
router.get('/me', requireAuth, async (req, res) => res.json(await me(req.user.id)));

export default router;

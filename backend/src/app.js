// backend/src/app.js  (monta rutas de auth y define esquema bearer para Swagger)
import express from 'express';
import cors from 'cors';
import surveyRoutes from './routes/survey.routes.js';
import responseRoutes from './routes/response.routes.js';
import diagnosisRoutes from './routes/diagnosis.routes.js';
import contentRoutes from './routes/content.routes.js';
import authRoutes from './routes/auth.routes.js';
import { swaggerSpec } from './swagger.js';
import swaggerUi from 'swagger-ui-express';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_, res) => res.json({ ok: true }));

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup({
  ...swaggerSpec,
  components: {
    ...(swaggerSpec.components || {}),
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    }
  },
  security: [{ bearerAuth: [] }]
}));

app.use('/api/auth', authRoutes);
app.use('/api/survey', surveyRoutes);
app.use('/api/responses', responseRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/content', contentRoutes);

export default app;

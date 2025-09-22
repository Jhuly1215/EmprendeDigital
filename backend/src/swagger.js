// backend/src/swagger.js  (NUEVO)
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'Emprende Digital API',
    version: '1.0.0',
    description:
      'API para encuesta, diagnóstico y contenidos de emprendimiento digital.',
  },
  servers: [{ url: 'http://localhost:8000' }],
  tags: [
    { name: 'Survey', description: 'Encuesta y estadísticas' },
    { name: 'Responses', description: 'Registro de respuestas' },
    { name: 'Diagnosis', description: 'Diagnóstico personalizado' },
    { name: 'Content', description: 'Plataformas, herramientas, tutoriales' },
  ],
  components: {
    schemas: {
      Option: {
        type: 'object',
        properties: { id: { type: 'integer' }, code: { type: 'string' }, text: { type: 'string' } },
      },
      Question: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          q_number: { type: 'integer' },
          text: { type: 'string' },
          options: { type: 'array', items: { $ref: '#/components/schemas/Option' } },
        },
      },
      SurveyResponse: {
        type: 'object',
        properties: {
          survey: {
            type: 'object',
            properties: { id: { type: 'integer' }, title: { type: 'string' }, description: { type: 'string' } },
          },
          questions: { type: 'array', items: { $ref: '#/components/schemas/Question' } },
        },
      },
      SaveResponsesPayload: {
        type: 'object',
        required: ['user', 'answers'],
        properties: {
          user: {
            type: 'object',
            required: ['email'],
            properties: { name: { type: 'string' }, email: { type: 'string', format: 'email' } },
          },
          answers: {
            type: 'array',
            items: {
              type: 'object',
              required: ['question_id', 'option_id'],
              properties: {
                question_id: { type: 'integer' },
                option_id: { type: 'integer' },
              },
            },
          },
        },
      },
      SaveResponsesResult: {
        type: 'object',
        properties: { ok: { type: 'boolean' }, user_id: { type: 'integer' }, error: { type: 'string' } },
      },
      Diagnosis: {
        type: 'object',
        properties: {
          user_id: { type: 'integer' },
          archetype: { type: 'string' },
          platforms: {
            type: 'array',
            items: { type: 'object', properties: { name: { type: 'string' }, score: { type: 'number' } } },
          },
          tools: {
            type: 'array',
            items: { type: 'object', properties: { name: { type: 'string' }, score: { type: 'number' } } },
          },
          tutorials: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string' },
                url: { type: 'string' },
                plataforma: { type: 'string' },
                herramienta: { type: 'string' },
                level: { type: 'string' },
              },
            },
          },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: { title: 'Emprende Digital API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:' + (process.env.PORT || 8000) }]
  },
  apis: ['src/routes/*.js'],
});

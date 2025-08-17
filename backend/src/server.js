import express from 'express';
import cors from 'cors';
import knex from 'knex';
import knexConfig from '../knexfile.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import pino from 'pino';
import pinoHttp from 'pino-http';
import * as Sentry from '@sentry/node';

import users from './routes/users.js';
import challenges from './routes/challenges.js';
import votes from './routes/votes.js';
import media from './routes/media.js';

dotenv.config();
Sentry.init({ dsn: process.env.SENTRY_DSN || '' });

const db = knex(knexConfig);

const logger = pino();
const app = express();
app.use(pinoHttp({ logger }));
app.use(Sentry.Handlers.requestHandler());
app.use(cors());
app.use(express.json());

// VK OAuth -> JWT
app.post('/auth/vk', async (req, res) => {
  const { access_token } = req.body;
  if (!access_token) return res.status(400).json({ error: 'access_token required' });
  try {
    const vkRes = await axios.get('https://api.vk.com/method/users.get', {
      params: { access_token, v: '5.131' }
    });
    const info = vkRes.data.response[0];
    const [user] = await db('users').insert({
      vk_id: info.id,
      name: `${info.first_name} ${info.last_name}`,
      avatar: info.photo_max
    }).onConflict('vk_id').merge().returning('*');
    const token = jwt.sign({ id: user.id, vk_id: user.vk_id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(401).json({ error: 'VK auth failed' });
  }
});

app.use((req, res, next) => {
  req.db = db;
  next();
});

app.use('/users', users);
app.use('/challenges', challenges);
app.use('/votes', votes);
app.use('/media', media);

app.use(Sentry.Handlers.errorHandler());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'TT Club API', version: '1.0.0' },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js']
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

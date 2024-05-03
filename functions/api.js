import express from 'express';
import serverless from 'serverless-http';

import { notFoundHandler, routeHandlers } from './routes';

const app = express();

app.use('/.netlify/functions/api', (req, res, next) => {
  const path = req.path;
  const handler = routeHandlers[path] || notFoundHandler;
  handler(req)
    .then((response) => {
      res.status(response.statusCode).send(response.body);
    })
    .catch((err) => {
      next(err);
    });
});

export const handler = serverless(app);

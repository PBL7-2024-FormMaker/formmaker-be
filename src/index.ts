import cors from 'cors';
import dotenv from 'dotenv';
import express, { Request, Response } from 'express';
import { NOT_FOUND } from 'http-status';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import { PORT } from './configs/secrets';
import authRoute from './routes/auth.routes';
import foldersRoute from './routes/folders.routes';
import formsRoute from './routes/forms.routes';
import imagesRoute from './routes/images.routes';
import responseRoute from './routes/responses.routes';
import teamsRoute from './routes/teams.routes';
import usersRoute from './routes/users.routes';
import { swaggerDefinition } from './swaggerDocs/swaggerDefinition';
import { ERROR_MESSAGES, ROUTES } from './constants';
import { errorResponse } from './utils';

dotenv.config();

const app = express();

const options: swaggerJSDoc.Options = {
  swaggerDefinition,
  apis: ['./src/swaggerDocs/*.yaml'],
};
const swaggerDocument = swaggerJSDoc(options);

app.use(cors());

app.use(
  ROUTES.API_DOCS.PATH,
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument),
);

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send(`Hello World!`);
});

app.use(ROUTES.AUTH.PATH, authRoute);

app.use(ROUTES.USER.PATH, usersRoute);

app.use(ROUTES.IMAGE.PATH, imagesRoute);

app.use(ROUTES.FORM.PATH, formsRoute);

app.use(ROUTES.FOLDER.PATH, foldersRoute);
app.use(ROUTES.RESPONSE.PATH, responseRoute);

app.use(ROUTES.TEAM.PATH, teamsRoute);

app.use((req: Request, res: Response) =>
  errorResponse(res, ERROR_MESSAGES.NOT_FOUND_ROUTES, NOT_FOUND),
);

app.listen(PORT, () => {
  console.log(`Server listened in port ${PORT}, http://localhost:${PORT}`);
});

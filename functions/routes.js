import authRoute from '../src/routes/auth.routes';
import foldersRoute from '../src/routes/folders.routes';
import formsRoute from '../src/routes/forms.routes';
import imagesRoute from '../src/routes/images.routes';
import responseRoute from '../src/routes/responses.routes';
import teamsRoute from '../src/routes/teams.routes';
import usersRoute from '../src/routes/users.routes';

const routeHandlers = {
  '/auth': authRoute,
  '/users': usersRoute,
  '/images': imagesRoute,
  '/forms': formsRoute,
  '/folders': foldersRoute,
  '/teams': teamsRoute,
  '/responses': responseRoute,
};

const notFoundHandler = async () => ({
  statusCode: 404,
  body: 'Route not found',
});

export { notFoundHandler, routeHandlers };

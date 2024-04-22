import { DB_URL } from '../configs/secrets';

export const swaggerDefinition = {
  openapi: '3.0.3',
  info: {
    title: 'FormMaker App - API Docs',
    version: '0.1.0',
  },
  servers: [
    {
      url: DB_URL,
    },
  ],
  tags: [
    {
      name: 'Auth',
      description: 'APIs about Auth',
    },
    {
      name: 'Users',
      description: 'APIs about Users',
    },
    {
      name: 'Images',
    },
    {
      name: 'Forms',
      description: 'APIs about Forms',
    },
    {
      name: 'Teams',
      description: 'APIs about Teams',
    },
  ],
};

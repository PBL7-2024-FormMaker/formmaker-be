import { Router } from 'express';

import { ROUTES } from '@/constants';
import {
  getOpenAiController,
  OpenAiController,
} from '@/controllers/openAi.controller';

const openAiRouter = Router();

const openAIController: OpenAiController = getOpenAiController();

openAiRouter.post(
  ROUTES.OPEN_AI.GET_QUESTION,
  openAIController.getElementFromQuestion,
);

export default openAiRouter;

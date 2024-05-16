import { Response } from 'express';
import status from 'http-status';

import { OPEN_AI_ERROR_MESSAGES, systemPrompt } from '@/constants';
import { getOpenAiService, OpenAiService } from '@/services/openAi.service';
import { CustomRequest } from '@/types/customRequest.types';
import { errorResponse, successResponse } from '@/utils';

let instance: OpenAiController | null = null;

export const getOpenAiController = () => {
  if (!instance) {
    instance = new OpenAiController();
  }
  return instance;
};

export class OpenAiController {
  private openAiService: OpenAiService;
  public constructor() {
    this.openAiService = getOpenAiService();
  }
  public getElementFromQuestion = async (
    req: CustomRequest<{ questions: string }>,
    res: Response,
  ) => {
    try {
      const { questions } = req.body;

      if (!questions)
        return errorResponse(
          res,
          OPEN_AI_ERROR_MESSAGES.REQUIRED_QUESTIONS,
          status.UNPROCESSABLE_ENTITY,
        );
      const content = await this.openAiService.getElementFromQuestion({
        systemPrompt: systemPrompt,
        userPrompt: questions,
        temperature: 0.5,
      });
      if (typeof content === 'string') {
        return successResponse(res, { message: content });
      }
      return successResponse(res, { form: content });
    } catch (error: unknown) {
      return errorResponse(res);
    }
  };
}

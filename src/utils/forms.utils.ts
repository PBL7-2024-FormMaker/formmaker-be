import { Response } from 'express';
import status from 'http-status';

import { FORM_ERROR_MESSAGES } from '../constants';
import { FormsService, getFormsService } from '../services/forms.service';

import { errorResponse } from './messages.utils';

const formsService: FormsService = getFormsService();

export const findFormById = async (formId: number, res: Response) => {
  const existingForm = await formsService.getFormById(formId);
  if (!existingForm) {
    return errorResponse(
      res,
      FORM_ERROR_MESSAGES.FORM_NOT_FOUND,
      status.NOT_FOUND,
    );
  }
  return existingForm;
};

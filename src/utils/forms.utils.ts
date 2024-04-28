import { FormsService, getFormsService } from '../services/forms.service';

const formsService: FormsService = getFormsService();

export const findFormById = async (formId: string) =>
  await formsService.getFormById(formId);

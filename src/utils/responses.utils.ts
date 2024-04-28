import { Prisma } from '@prisma/client';
import { JsonValue } from '@prisma/client/runtime/library';
import isUndefined from 'lodash.isundefined';
import toString from 'lodash.tostring';

import { ElementResponseSchema } from '../schemas/createResponse.schemas';
import { ElementSchema } from '../schemas/forms.schemas';
import {
  getResponsesService,
  ResponsesService,
} from '../services/responses.service';

import { isKeyOfObject } from './object.utils';

const responsesService: ResponsesService = getResponsesService();

export const findResponseById = async (responseId: string) =>
  await responsesService.getResponseById(responseId);

export const convertRawResponseToExtraInfoResponse = (
  elementListByIdObject: Record<string, Prisma.JsonValue>,
  response: {
    id: string;
    formAnswers: Prisma.JsonValue[];
    createdAt: Date;
  },
) => {
  const currentFormAnswer = response.formAnswers
    .map((elementResponse) => {
      const currentElementResponse = elementResponse as ElementResponseSchema;
      const formElement = elementListByIdObject[
        currentElementResponse.elementId
      ] as ElementSchema;
      if (!formElement) {
        return undefined;
      }
      const answers = currentElementResponse.answers.map((answer) => ({
        fieldId: answer.fieldId,
        text: answer.text,
        fieldName: formElement.fields.find(
          (field) => field.id === answer.fieldId,
        )?.name,
      }));
      const labelKey = Object.keys(formElement.config).filter((key) =>
        key.includes('fieldLabel'),
      )[0];
      return {
        elementId: currentElementResponse.elementId,
        answers: answers,
        elementName: isKeyOfObject(labelKey, formElement.config)
          ? toString(formElement.config[labelKey])
          : 'Field Label',
      };
    })
    .filter((value) => !isUndefined(value));
  return {
    id: response.id,
    createdAt: response.createdAt,
    formAnswers: currentFormAnswer,
  };
};

export const getHasFieldLabelElementIdAndName = (elements: JsonValue[]) =>
  elements
    .filter((element: JsonValue) =>
      isKeyOfObject('fieldLabel', (element as ElementSchema).config),
    )
    .sort(
      (firstValue, secondValue) =>
        (firstValue as ElementSchema).gridSize.y -
        (secondValue as ElementSchema).gridSize.y,
    )
    .map((element: JsonValue) => ({
      elementId: (element as ElementSchema).id,
      elementName: ((element as ElementSchema).config as { fieldLabel: string })
        .fieldLabel,
    }));

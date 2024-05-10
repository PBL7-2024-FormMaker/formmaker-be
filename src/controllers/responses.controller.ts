import { Form, Response } from '@prisma/client';
import { Response as ExpressResponse } from 'express';
import status from 'http-status';
import keyBy from 'lodash/keyBy';

import {
  RESPONSES_ERROR_MESSAGES,
  RESPONSES_SUCCESS_MESSAGES,
  SORT_DIRECTIONS,
  USER_ERROR_MESSAGES,
  USER_SUCCESS_MESSAGES,
} from '@/constants';
import { getMailService, Mailer } from '@/infracstructure/mailer/mailer';
import { CreatedResponseSchema } from '@/schemas/createResponse.schemas';
import { filterObjectSchema } from '@/schemas/filterObject.schemas';
import { AuthService, getAuthService } from '@/services/auth.service';
import {
  getResponsesService,
  ResponsesService,
} from '@/services/responses.service';
import { CustomRequest } from '@/types/customRequest.types';
import {
  calculatePagination,
  convertRawResponseToExtraInfoResponse,
  errorResponse,
  getHasFieldLabelElementIdAndName,
  isDateActions,
  isOtherFieldsActions,
  successResponse,
} from '@/utils';

let instance: ResponsesController | null = null;

export const getResponsesController = () => {
  if (!instance) {
    instance = new ResponsesController();
  }
  return instance;
};

export class ResponsesController {
  private responsesService: ResponsesService;
  private authService: AuthService;
  public constructor() {
    this.responsesService = getResponsesService();
    this.authService = getAuthService();
  }

  public convertFilterObject(
    fieldFilter: string,
    idElementsOfFormList: number[],
  ) {
    const splittedFieldFilter = fieldFilter.split(':');
    if (splittedFieldFilter.length !== 2) {
      throw new Error(RESPONSES_ERROR_MESSAGES.INVALID_FIELD_FILTER);
    }
    const [key, value] = splittedFieldFilter;
    const valueKey = key.split(':');
    if (
      (valueKey.length === 4 &&
        idElementsOfFormList.includes(+valueKey[0]) &&
        isDateActions(valueKey[1])) ||
      (valueKey.length === 3 &&
        idElementsOfFormList.includes(+valueKey[0]) &&
        isOtherFieldsActions(valueKey[1]))
    ) {
      return {
        element_id: valueKey[0],
        answers: {
          has: {
            text: {
              [valueKey[1]]: value,
            },
          },
        },
      };
    }
    throw new Error(RESPONSES_ERROR_MESSAGES.INVALID_FIELD_FILTER);
  }

  public getAllResponseByFormId = async (
    req: CustomRequest<{ form: Form }>,
    res: ExpressResponse,
  ) => {
    try {
      const reqDate = filterObjectSchema.parse(req.query);
      const page = Number(reqDate.page);
      const pageSize = Number(reqDate.pageSize);
      const searchText = reqDate.searchText;
      const fieldsFilter = reqDate.fieldsFilter;
      const filterList = fieldsFilter?.split(',') || [];
      const { form } = req.body;
      const totalResponses = form.totalSubmissions;
      const idElementsOfFormList = form.elements.map(
        (element) => +JSON.parse(JSON.stringify(element)).id,
      );
      const objectFilterList = filterList.map((fieldFilter) =>
        this.convertFilterObject(fieldFilter, idElementsOfFormList),
      );
      const sortField = reqDate.sortField;
      const sortDirection = reqDate.sortDirection || SORT_DIRECTIONS.ASCENDING;

      const { totalPages, offset, limit } = calculatePagination({
        condition: searchText == null,
        totalResponses,
        pageSize,
        page,
      });

      const responses = await this.responsesService.getResponsesByFormId({
        formId: form.id,
        offset,
        limit,
        searchText,
        filterList: objectFilterList,
        sortField,
        sortDirection,
      });

      const elementIdAndNameList = getHasFieldLabelElementIdAndName(
        form.elements,
      );

      const elementListByIdObject = keyBy(form.elements, 'id');

      const updatedResponses = responses.map((response) =>
        convertRawResponseToExtraInfoResponse(elementListByIdObject, response),
      );

      return successResponse(
        res,
        {
          elementIdAndNameList: elementIdAndNameList,
          responses: updatedResponses,
          page,
          pageSize,
          totalResponses,
          totalPages,
        },
        RESPONSES_SUCCESS_MESSAGES.RESPONSE_GET_SUCCESS,
      );
    } catch (error) {
      if (error instanceof Error) {
        return errorResponse(res, error.message, status.UNPROCESSABLE_ENTITY);
      }
      return errorResponse(res);
    }
  };

  public createResponse = async (
    req: CustomRequest<CreatedResponseSchema & { form: Form }>,
    res: ExpressResponse,
  ) => {
    try {
      const { form, formAnswers } = req.body;

      if (form.disabled || form.deletedAt !== null)
        return errorResponse(
          res,
          RESPONSES_ERROR_MESSAGES.FORM_NOT_ACCEPTING_RESPONSES,
        );

      const createdResponse = await this.responsesService.createResponse(
        form.totalSubmissions,
        form.id,
        { formAnswers },
      );

      if (!form.disabledNotification) {
        try {
          const creatorId = form.creatorId;
          const user = await this.authService.getUserById(creatorId);
          if (!user)
            return errorResponse(
              res,
              USER_ERROR_MESSAGES.USER_NOT_FOUND,
              status.NOT_FOUND,
            );
          const elementIdAndNameList = getHasFieldLabelElementIdAndName(
            form.elements,
          );
          const email = user.email;
          const mailer: Mailer = getMailService();
          const responsePath = `${process.env.FRONT_END_URL}/responses/${form.id}`;
          mailer.sendNotificationResponse(
            email,
            form.title,
            responsePath,
            createdResponse.formAnswers,
            elementIdAndNameList,
          );
          return successResponse(
            res,
            createdResponse,
            USER_SUCCESS_MESSAGES.SENT_EMAIL_SUCCESS,
            status.CREATED,
          );
        } catch (error) {
          return errorResponse(res, USER_ERROR_MESSAGES.ERROR_SEND_EMAIL, 500);
        }
      }
      return successResponse(
        res,
        createdResponse,
        RESPONSES_SUCCESS_MESSAGES.RESPONSE_CREATED,
        status.CREATED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public deleteMultipleResponses = async (
    req: CustomRequest<{ responsesIds: string[]; form: Form }>,
    res: ExpressResponse,
  ) => {
    try {
      const { formId } = req.params;
      const { responsesIds, form } = req.body;
      if (!responsesIds || !formId) {
        return errorResponse(
          res,
          RESPONSES_ERROR_MESSAGES.ID_PARAMS_NOT_FOUND,
          status.UNPROCESSABLE_ENTITY,
        );
      }

      const deletedResponses =
        await this.responsesService.deleteMultipleResponses(
          form.totalSubmissions,
          formId,
          responsesIds,
        );

      return successResponse(
        res,
        deletedResponses,
        RESPONSES_SUCCESS_MESSAGES.RESPONSE_DELETED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };

  public deleteResponse = async (
    req: CustomRequest<
      CreatedResponseSchema & { response: Response; form: Form }
    >,
    res: ExpressResponse,
  ) => {
    try {
      const { form, response } = req.body;

      const deletedResponse = await this.responsesService.deleteResponse(
        form.totalSubmissions,
        form.id,
        response.id,
      );
      return successResponse(
        res,
        deletedResponse,
        RESPONSES_SUCCESS_MESSAGES.RESPONSE_DELETED,
      );
    } catch (error) {
      return errorResponse(res);
    }
  };
}

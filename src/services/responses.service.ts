import prisma from '@/configs/db.config';
import { CreatedResponseSchema } from '@/schemas/createResponse.schemas';
import { GetResponsesByFormIdParams } from '@/types/responses.types';

let instance: ResponsesService;

export const getResponsesService = () => {
  if (!instance) {
    instance = new ResponsesService();
  }
  return instance;
};

export class ResponsesService {
  public createResponse = async (
    totalSubmissions: number,
    formId: number,
    payload: CreatedResponseSchema,
  ) =>
    prisma.$transaction(async (tx) => {
      await tx.form.update({
        where: { id: formId },
        data: { totalSubmissions: totalSubmissions + 1 },
      });
      return tx.response.create({
        data: { formId, formAnswers: [...payload.formAnswers] },
      });
    });

  public deleteResponse = async (
    totalSubmissions: number,
    formId: number,
    responseId: number,
  ) =>
    prisma.$transaction(async (tx) => {
      await tx.form.update({
        where: { id: formId },
        data: { totalSubmissions: totalSubmissions - 1 },
      });
      return tx.response.delete({
        where: {
          id: responseId,
        },
      });
    });

  public getResponseById = async (responseId: number) =>
    prisma.response.findUnique({
      where: {
        id: responseId,
      },
    });
  public deleteMultipleResponses = async (
    totalSubmissions: number,
    formId: number,
    responsesIds: number[],
  ) =>
    prisma.$transaction(async (tx) => {
      await tx.form.update({
        where: { id: formId },
        data: { totalSubmissions: totalSubmissions - responsesIds.length },
      });
      return tx.response.deleteMany({
        where: {
          id: {
            in: responsesIds,
          },
        },
      });
    });

  public getResponsesByFormId = async (props: GetResponsesByFormIdParams) => {
    const { formId, offset, limit, filterList, sortField, sortDirection } =
      props;
    return prisma.response.findMany({
      skip: offset,
      take: limit,
      where: { formId: formId, ...filterList },
      orderBy: {
        [sortField]: sortDirection,
      },
      select: {
        id: true,
        formAnswers: true,
        createdAt: true,
      },
    });
  };
}

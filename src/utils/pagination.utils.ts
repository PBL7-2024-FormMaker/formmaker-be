interface PaginationParams {
  condition: boolean;
  totalResponses: number;
  pageSize: number;
  page: number;
}

export const calculatePagination = ({
  condition,
  totalResponses,
  pageSize,
  page,
}: PaginationParams) => {
  const totalPages = Math.ceil(totalResponses / pageSize);
  const offset = condition ? 0 : (page - 1) * pageSize;
  const limit = condition ? totalResponses : pageSize;

  return {
    totalPages,
    offset,
    limit,
  };
};

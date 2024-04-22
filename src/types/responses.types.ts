import type { SORT_DIRECTIONS } from '@/constants';

export interface GetResponsesByFormIdParams {
  formId: number;
  offset: number;
  limit: number;
  searchText: string;
  filterList: {
    element_id: string;
    answers: {
      has: {
        text: {
          [x: string]: string;
        };
      };
    };
  }[];
  sortField: string;
  sortDirection: SORT_DIRECTIONS;
}

import { z } from 'zod';

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  DEFAULT_SEARCH_TEXT,
  DEFAULT_SORT_FIELD,
  RESPONSES_ERROR_MESSAGES,
  SORT_DIRECTIONS,
} from '@/constants';
import { isSortDirection } from '@/utils';

export const filterObjectSchema = z.object({
  page: z.string().optional().default(DEFAULT_PAGE.toString()),
  pageSize: z.string().optional().default(DEFAULT_PAGE_SIZE.toString()),
  searchText: z.string().optional().default(DEFAULT_SEARCH_TEXT),
  fieldsFilter: z.string().optional(),
  sortField: z.string().optional().default(DEFAULT_SORT_FIELD),
  sortDirection: z
    .string()
    .refine((value) => !isSortDirection(value), {
      message: RESPONSES_ERROR_MESSAGES.INVALID_SORT_DIRECTION,
    })
    .transform((value) => value as SORT_DIRECTIONS)
    .optional(),
});

export type FilterObjectSchema = z.infer<typeof filterObjectSchema>;

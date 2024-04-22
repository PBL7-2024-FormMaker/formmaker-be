import { z } from 'zod';

import { ERROR_MESSAGES, FORM_ERROR_MESSAGES } from '../constants';

const settingsSchema = z
  .object(
    {
      colors: z
        .object(
          {
            pageColor: z
              .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
              .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
            formColor: z
              .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
              .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
            fontColor: z
              .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
              .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
            inputBackground: z
              .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
              .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
          },
          {
            required_error: ERROR_MESSAGES.REQUIRED_FIELD,
            invalid_type_error: ERROR_MESSAGES.REQUIRED_OBJECT_TYPE,
          },
        )
        .strict(),
      styles: z
        .object(
          {
            formWidth: z
              .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
              .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
            questionSpacing: z
              .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
              .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
            font: z
              .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
              .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
            fontSize: z
              .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
              .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
          },
          {
            required_error: ERROR_MESSAGES.REQUIRED_FIELD,
            invalid_type_error: ERROR_MESSAGES.REQUIRED_OBJECT_TYPE,
          },
        )
        .strict(),
    },
    {
      required_error: ERROR_MESSAGES.REQUIRED_FIELD,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_OBJECT_TYPE,
    },
  )
  .strict();

const fieldsSchema = z
  .object(
    {
      id: z.string({
        required_error: ERROR_MESSAGES.REQUIRED_FIELD,
        invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
      }),
      name: z
        .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
        .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    },
    {
      required_error: ERROR_MESSAGES.REQUIRED_FIELD,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_OBJECT_TYPE,
    },
  )
  .strict()
  .array();

const gridSizeSchema = z
  .object(
    {
      x: z.number({
        required_error: ERROR_MESSAGES.REQUIRED_FIELD,
        invalid_type_error: ERROR_MESSAGES.REQUIRED_NUMBER_TYPE,
      }),
      y: z.number({
        required_error: ERROR_MESSAGES.REQUIRED_FIELD,
        invalid_type_error: ERROR_MESSAGES.REQUIRED_NUMBER_TYPE,
      }),
      w: z.number({
        required_error: ERROR_MESSAGES.REQUIRED_FIELD,
        invalid_type_error: ERROR_MESSAGES.REQUIRED_NUMBER_TYPE,
      }),
      h: z.number({
        required_error: ERROR_MESSAGES.REQUIRED_FIELD,
        invalid_type_error: ERROR_MESSAGES.REQUIRED_NUMBER_TYPE,
      }),
    },
    {
      required_error: ERROR_MESSAGES.REQUIRED_FIELD,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_OBJECT_TYPE,
    },
  )
  .strict();

const elementSchema = z
  .object(
    {
      id: z.string({
        required_error: ERROR_MESSAGES.REQUIRED_FIELD,
        invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
      }),
      type: z
        .string({ required_error: ERROR_MESSAGES.REQUIRED_FIELD })
        .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
      fields: fieldsSchema,
      gridSize: gridSizeSchema,
      config: z.object(
        {},
        {
          required_error: ERROR_MESSAGES.REQUIRED_FIELD,
          invalid_type_error: ERROR_MESSAGES.REQUIRED_OBJECT_TYPE,
        },
      ),
    },
    {
      required_error: ERROR_MESSAGES.REQUIRED_FIELD,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_ARRAY_TYPE,
    },
  )
  .strict();

const elementsSchema = elementSchema
  .array()
  .nonempty({ message: ERROR_MESSAGES.NO_EMPTY_FIELD });

export const CreateFormSchema = z.object({
  title: z
    .string({
      required_error: ERROR_MESSAGES.REQUIRED_FIELD,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
    })
    .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  logoUrl: z
    .string({
      invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
    })
    .optional(),
  settings: settingsSchema.partial(),
  elements: elementsSchema,
});

export const UpdateFormSchema = z
  .object({
    title: z
      .string({
        invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    logoUrl: z.string({
      invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
    }),
    settings: settingsSchema.partial(),
    elements: elementsSchema,
  })
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: ERROR_MESSAGES.NO_EMPTY_REQUEST_BODY,
  });

export const headingConfigSchema = z
  .object({
    headingText: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_HEADING_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    subheadingText: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_HEADING_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const fullnameConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_FULLNAME_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_FULLNAME_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    sublabels: z
      .object({
        firstName: z.string({
          required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_FULLNAME_CONFIG,
        }),
        lastName: z.string({
          required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_FULLNAME_CONFIG,
        }),
      })
      .strict(),
  })
  .strict();

export const emailConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_EMAIL_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_EMAIL_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    sublabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_EMAIL_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const addressConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_ADDRESS_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_ADDRESS_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    sublabels: z
      .object({
        street: z.string({
          required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_ADDRESS_CONFIG,
        }),
        ward: z.string({
          required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_ADDRESS_CONFIG,
        }),
        district: z.string({
          required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_ADDRESS_CONFIG,
        }),
        city: z.string({
          required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_ADDRESS_CONFIG,
        }),
      })
      .strict(),
  })
  .strict();

export const phoneConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_PHONE_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_PHONE_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    sublabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_PHONE_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const datepickerConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DATEPICKER_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DATEPICKER_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    sublabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DATEPICKER_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const appointmentConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_APPOINTMENT_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_APPOINTMENT_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
  })
  .strict();

export const shortTextConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SHORT_TEXT_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SHORT_TEXT_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    placeholder: z.string().optional(),
    sublabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SHORT_TEXT_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const longTextConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_LONG_TEXT_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_LONG_TEXT_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    placeholder: z.string().optional(),
    sublabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_LONG_TEXT_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const dropdownConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DROPDOWN_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DROPDOWN_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    sublabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DROPDOWN_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    options: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DROPDOWN_CONFIG,
      })
      .array()
      .nonempty({ message: ERROR_MESSAGES.NO_EMPTY_FIELD }),
  })
  .strict();

export const singleChoiceConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SINGLE_CHOICE_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error:
        FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SINGLE_CHOICE_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    options: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SINGLE_CHOICE_CONFIG,
      })
      .array()
      .nonempty({ message: ERROR_MESSAGES.NO_EMPTY_FIELD }),
    otherOption: z
      .object(
        {
          isDisplayed: z.boolean({
            required_error:
              FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SINGLE_CHOICE_CONFIG,
            invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
          }),
          text: z
            .string({
              required_error:
                FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SINGLE_CHOICE_CONFIG,
            })
            .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
        },
        {
          required_error:
            FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SINGLE_CHOICE_CONFIG,
          invalid_type_error: ERROR_MESSAGES.REQUIRED_OBJECT_TYPE,
        },
      )
      .strict()
      .optional(),
  })
  .strict();

export const multipleChoiceConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_MULTIPLE_CHOICE_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error:
        FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_MULTIPLE_CHOICE_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    options: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_MULTIPLE_CHOICE_CONFIG,
      })
      .array()
      .nonempty({ message: ERROR_MESSAGES.NO_EMPTY_FIELD }),
    otherOption: z
      .object(
        {
          isDisplayed: z.boolean({
            required_error:
              FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_MULTIPLE_CHOICE_CONFIG,
            invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
          }),
          text: z
            .string({
              required_error:
                FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_MULTIPLE_CHOICE_CONFIG,
            })
            .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
        },
        {
          required_error:
            FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_MULTIPLE_CHOICE_CONFIG,
          invalid_type_error: ERROR_MESSAGES.REQUIRED_OBJECT_TYPE,
        },
      )
      .strict()
      .optional(),
  })
  .strict();

export const numberConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_NUMBER_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_NUMBER_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    sublabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_NUMBER_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const imageConfigSchema = z
  .object({
    image: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_IMAGE_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    size: z
      .object(
        {
          width: z
            .string({
              required_error:
                FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_IMAGE_CONFIG,
            })
            .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
          height: z
            .string({
              required_error:
                FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_IMAGE_CONFIG,
            })
            .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
        },
        {
          required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_IMAGE_CONFIG,
          invalid_type_error: ERROR_MESSAGES.REQUIRED_OBJECT_TYPE,
        },
      )
      .strict(),
    imageAlignment: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_IMAGE_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const fileUploadConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_FILE_UPLOAD_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_FILE_UPLOAD_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    sublabel: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_FILE_UPLOAD_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const timeConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_TIME_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_TIME_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    sublabels: z
      .object({
        hour: z.string({
          required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_TIME_CONFIG,
        }),
        minutes: z.string({
          required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_TIME_CONFIG,
        }),
      })
      .strict(),
  })
  .strict();

export const submitConfigSchema = z
  .object({
    buttonText: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SUBMIT_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    buttonColor: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SUBMIT_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    buttonAlignment: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SUBMIT_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const inputTableConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_INPUT_TABLE_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_INPUT_TABLE_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    rows: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_INPUT_TABLE_CONFIG,
      })
      .array()
      .nonempty({ message: ERROR_MESSAGES.NO_EMPTY_FIELD }),
    columns: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_INPUT_TABLE_CONFIG,
      })
      .array()
      .nonempty({ message: ERROR_MESSAGES.NO_EMPTY_FIELD }),
  })
  .strict();

export const starRatingConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_STAR_RATING_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_STAR_RATING_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    sublabel: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_STAR_RATING_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const scaleRatingConfigSchema = z
  .object({
    fieldLabel: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SCALE_RATING_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    required: z.boolean({
      required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SCALE_RATING_CONFIG,
      invalid_type_error: ERROR_MESSAGES.REQUIRED_BOOLEAN_TYPE,
    }),
    lowestRatingText: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SCALE_RATING_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    highestRatingText: z
      .string({
        required_error:
          FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_SCALE_RATING_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const dividerConfigSchema = z
  .object({
    lineColor: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DIVIDER_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    dividerStyle: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DIVIDER_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    dividerHeight: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DIVIDER_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    spaceBelow: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DIVIDER_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    spaceAbove: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_DIVIDER_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const pageBreakConfigSchema = z
  .object({
    backButtonText: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_PAGE_BREAK_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    nextButtonText: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_PAGE_BREAK_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    backButtonColor: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_PAGE_BREAK_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
    nextButtonColor: z
      .string({
        required_error: FORM_ERROR_MESSAGES.REQUIRED_FIELD_IN_PAGE_BREAK_CONFIG,
      })
      .min(1, ERROR_MESSAGES.NO_EMPTY_FIELD),
  })
  .strict();

export const GetFormsQueryParamsSchema = z
  .object({
    page: z
      .number({
        invalid_type_error: ERROR_MESSAGES.REQUIRED_NUMBER_TYPE,
      })
      .positive(ERROR_MESSAGES.NUMBER_MUST_BE_POSITIVE),
    pageSize: z
      .number({
        invalid_type_error: ERROR_MESSAGES.REQUIRED_NUMBER_TYPE,
      })
      .positive(ERROR_MESSAGES.NUMBER_MUST_BE_POSITIVE),
    search: z.string({
      invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
    }),
    isDeleted: z
      .number({
        invalid_type_error: ERROR_MESSAGES.REQUIRED_NUMBER_TYPE,
      })
      .nonnegative(ERROR_MESSAGES.NUMBER_MUST_BE_NONNEGATIVE),
    isFavourite: z
      .number({
        invalid_type_error: ERROR_MESSAGES.REQUIRED_NUMBER_TYPE,
      })
      .nonnegative(ERROR_MESSAGES.NUMBER_MUST_BE_NONNEGATIVE),
    sortField: z.string({
      invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
    }),
    sortDirection: z.string({
      invalid_type_error: ERROR_MESSAGES.REQUIRED_STRING_TYPE,
    }),
    folderId: z
      .number({
        invalid_type_error: ERROR_MESSAGES.REQUIRED_NUMBER_TYPE,
      })
      .positive(ERROR_MESSAGES.NUMBER_MUST_BE_POSITIVE),
    teamId: z
      .number({
        invalid_type_error: ERROR_MESSAGES.REQUIRED_NUMBER_TYPE,
      })
      .positive(ERROR_MESSAGES.NUMBER_MUST_BE_POSITIVE),
  })
  .strict()
  .partial();

export type CreateFormSchemaType = z.infer<typeof CreateFormSchema>;

export type UpdateFormSchemaType = z.infer<typeof UpdateFormSchema>;

export type GetFormsQueryParamsSchemaType = z.infer<
  typeof GetFormsQueryParamsSchema
>;

export type ElementSchema = z.infer<typeof elementSchema>;

export type ElementsSchema = z.infer<typeof elementsSchema>;

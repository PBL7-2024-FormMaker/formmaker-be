import { createdResponseValidation } from '@/schemas/createResponse.schemas';
import { filterObjectSchema } from '@/schemas/filterObject.schemas';

import {
  CreateFolderSchema,
  UpdateFolderSchema,
} from '../schemas/folders.schemas';
import { CreateFormSchema, UpdateFormSchema } from '../schemas/forms.schemas';
import {
  AddTeamMemberSchema,
  CreateTeamSchema,
  RemoveTeamMemberSchema,
  UpdateTeamSchema,
} from '../schemas/teams.schemas';
import {
  ChangePasswordSchema,
  LoginSchema,
  SignUpSchema,
  UpdateUserSchema,
} from '../schemas/users.schemas';

import { verifyToken } from './authorization.middlewares';
import {
  checkFormExistence,
  validateConfigSchema,
  validateGetFormQueryParamsSchema,
} from './forms.middlewares';
import { checkResponseExistence } from './responses.middlewares';
import {
  checkMemberExistsInTeam,
  checkTeamExistence,
} from './teams.middlewares';
import { checkUserExistence } from './users.middlewares';
import { validate } from './validation.middlewares';

const validateSignUpInput = validate(SignUpSchema);
const validateLoginInput = validate(LoginSchema);

const validateChangePasswordInput = validate(ChangePasswordSchema);
const validateUpdateUserInput = validate(UpdateUserSchema);

const validateCreateFormSchema = validate(CreateFormSchema);
const validateUpdateFormSchema = validate(UpdateFormSchema);

const validateCreateFolderSchema = validate(CreateFolderSchema);
const validateUpdateFolderSchema = validate(UpdateFolderSchema);

const validateCreateTeamSchema = validate(CreateTeamSchema);
const validateUpdateTeamSchema = validate(UpdateTeamSchema);
const validateAddTeamMemberSchema = validate(AddTeamMemberSchema);
const validateRemoveTeamMemberSchema = validate(RemoveTeamMemberSchema);

const validateCreatedResponse = validate(createdResponseValidation);
const validateFilterObject = validate(filterObjectSchema);

export {
  checkFormExistence,
  checkMemberExistsInTeam,
  checkResponseExistence,
  checkTeamExistence,
  checkUserExistence,
  validateAddTeamMemberSchema,
  validateChangePasswordInput,
  validateConfigSchema,
  validateCreatedResponse,
  validateCreateFolderSchema,
  validateCreateFormSchema,
  validateCreateTeamSchema,
  validateFilterObject,
  validateGetFormQueryParamsSchema,
  validateLoginInput,
  validateRemoveTeamMemberSchema,
  validateSignUpInput,
  validateUpdateFolderSchema,
  validateUpdateFormSchema,
  validateUpdateTeamSchema,
  validateUpdateUserInput,
  verifyToken,
};

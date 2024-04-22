import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';

export interface CustomRequest<T = unknown, U = qs.ParsedQs>
  extends Request<ParamsDictionary, unknown, T, U> {}

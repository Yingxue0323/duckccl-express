import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AuthError, ParamError } from "../utils/errors";
import { ResponseCode } from '../utils/constants';
import { ErrorHandler } from '../utils/response';
import logger from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled error: ${err.stack}`);

  if (err instanceof AuthError || err instanceof ParamError) {
    return ErrorHandler(res, err.code, err.message);
  }
  
  // unknown error
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? `Unknown error: ${err.message}` 
    : 'Internal server error';
  
  return ErrorHandler(res, ResponseCode.INTERNAL_SERVER_ERROR, errorMessage);
};
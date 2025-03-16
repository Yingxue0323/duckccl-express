import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AuthError, ParamError } from "../utils/errors";
import { ResponseCode } from '../utils/constants';
import { ErrorHandler } from '../utils/response';
import logger from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
  logger.error(`未捕获的错误: ${err.stack}`);

  if (err instanceof AuthError || err instanceof ParamError) {
    return ErrorHandler(res, err.code, err.message);
  }
  
  // 未知错误统一返回服务器错误
  const errorMessage = process.env.NODE_ENV === 'development' 
    ? `未捕获错误：${err.message}` 
    : '服务器内部错误';
  
  return ErrorHandler(res, ResponseCode.INTERNAL_SERVER_ERROR, errorMessage);
};
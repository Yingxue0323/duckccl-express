import { Response } from 'express';
import { ResponseCode, ErrorMessages } from './constants';

// Get the HTTP status code corresponding to the business error code
function getHttpStatus(code: ResponseCode): number {
  if (code == ResponseCode.SUCCESS) {
    return 200;
  }
  // Auth (40000 - 41000)
  if (code >= 40000 && code < 41000) {
    return 401;  // Unauthorized
  }
  // User, Word, Exercise (41xxx)
  if (code >= 41000 && code < 45000) {
    return 404;  // Not Found
  }
  // Parameter (45001)
  if (code == ResponseCode.INVALID_PARAM) {
    return 400;  // Bad Request
  }
  // Server (5xxxx)
  if (code >= 50000) {
    return 500;  // Internal Server Error
  }
  // default
  return 500;  
}

export function ErrorHandler(res: Response, code: ResponseCode, errorMessage?: string) {
  const httpStatus = getHttpStatus(code);
  return res.status(httpStatus).json({
    code,
    message: errorMessage || ErrorMessages[code]
  });  
}

export function SuccessHandler(res: Response, data?: any) {
  return res.status(200).json({
    code: ResponseCode.SUCCESS,
    message: ErrorMessages[ResponseCode.SUCCESS],
    data
  });
} 
import { Response } from 'express';
import { ResponseCode, ErrorMessages } from './constants';

export function ErrorHandler(res: Response, code: ResponseCode, errorMessage: string) {
  return res.json({
    code,
    message: errorMessage
  });  
}

export function SuccessHandler(res: Response, data?: any) {
  return res.json({
    code: ResponseCode.SUCCESS,
    message: ErrorMessages[ResponseCode.SUCCESS],
    data
  });
} 
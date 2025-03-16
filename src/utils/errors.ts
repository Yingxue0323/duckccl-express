import { ResponseCode } from './constants';

export class AuthError extends Error {
  constructor(
    public code: ResponseCode,
    message: string
  ) {
    super(message);
    this.name = 'AuthError';
  }
} 

export class ParamError extends Error {
  constructor(
    public code: ResponseCode,
    message: string
  ) {
    super(message);
    this.name = 'ParamError';
  }
}
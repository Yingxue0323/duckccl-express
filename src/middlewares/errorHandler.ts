import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AuthError } from "../utils/errors";
import logger from "../utils/logger";

export const errorHandler: ErrorRequestHandler = (err, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AuthError) {
      res.status(401).json({
        code: err.code,
        message: err.message
      });
      return next();
    }
    
    logger.error(err.stack);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: err.message
    });
    return next();
  };
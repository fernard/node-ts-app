import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';

enum NodeEnvironment {
    DEV = 'development',
    PROD = 'production',
    TEST = 'test',
}

const createProgrammingErrorMessage = (message: string): string => {
    switch (process.env.NODE_ENV) {
        case NodeEnvironment.DEV:
        case NodeEnvironment.TEST:
            return message;
        case NodeEnvironment.PROD:
            return 'Something went wrong';
        default:
            new Error('Invalid environment!');
    }
};

export const unhandledRoute = (req: Request, res: Response, next: NextFunction): void => {
    const httpException = new HttpException(404, {
        message: `Path ${req.path} was not found`,
        type: 'Not Found',
    });
    next(httpException);
};

export const httpExceptionHandler = (error: HttpException, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'Failed';
    const type = error.type || 'Error';
    const message = error.isOperational ? error.message : createProgrammingErrorMessage(error.message);

    res.status(statusCode).json({
        status,
        message,
        type,
    });
};

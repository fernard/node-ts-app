import { NextFunction, Request, Response } from 'express';
import { HttpException } from '../exceptions/httpException';

export function asyncCatch(
    target: Object,
    propertyName: string,
    propertyDescriptor: PropertyDescriptor,
): PropertyDescriptor {
    const method = propertyDescriptor.value;
    propertyDescriptor.value = async function(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await method.call(this, req, res, next);
        } catch (e) {
            const error = new HttpException(400, {
                message: e.message,
                type: e.name,
            });
            next(error);
        }
    };

    return propertyDescriptor;
}

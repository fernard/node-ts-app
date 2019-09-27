interface HttpExceptionPayload {
    message: string;
    type: string;
}

export class HttpException extends Error {
    public readonly statusCode: number;
    public readonly status: string;
    public readonly isOperational: boolean;
    public readonly type: string;

    constructor(statusCode: number, payload: HttpExceptionPayload) {
        super(payload.message);
        this.status = 'Failed';
        this.type = payload.type;
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}

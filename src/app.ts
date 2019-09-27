import * as express from 'express';
import * as morgan from 'morgan';

import { tourRouter } from './routers/tourRouter';
import { userRouter } from './routers/userRouter';
import { httpExceptionHandler, unhandledRoute } from './middleware/httpExceptionHandler';

class App {
    private readonly express: express.Application;
    constructor() {
        this.express = express();
        this.registerMiddleware();
        this.registerRoutes();
    }
    public getInstance(): express.Application {
        return this.express;
    }
    private registerMiddleware(): void {
        this.express.use(morgan('dev'));
        this.express.use(express.json());
    }
    private registerRoutes(): void {
        this.express.use('/api/v1/tours', tourRouter);
        this.express.use('/api/v1/users', userRouter);
        this.express.all('*', unhandledRoute);
        this.express.use(httpExceptionHandler);
    }
}

export const app = new App().getInstance();

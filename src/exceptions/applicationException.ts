import * as http from 'http';

enum ApplicationException {
    UNCAUGHT_EXCEPTION = 'uncaughtException',
    UNHANDLED_REJECTION = 'unhandledRejection',
}

export class ApplicationExceptionHandler {
    public registerUncaughtException(): void {
        process.on(ApplicationException.UNCAUGHT_EXCEPTION, (err: Error) => {
            console.log(`Uncaught exception occurred: ${err.name}`);
            console.log('Shutting down the application...');
            process.exit(1);
        });
    }

    public registerUnhandledRejection(server: http.Server): void {
        process.on(ApplicationException.UNHANDLED_REJECTION, (err: Error) => {
            console.log(`Unhandled rejection occurred: ${err.name}`);
            console.log('Shutting down the application...');
            server.close(() => process.exit(1));
        });
    }
}

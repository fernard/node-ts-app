import * as dotenv from 'dotenv';
import * as path from 'path';
import * as http from 'http';
import { connect } from 'mongoose';
import { ApplicationExceptionHandler } from './exceptions/applicationException';

const applicationExceptionHandler = new ApplicationExceptionHandler();
applicationExceptionHandler.registerUncaughtException();

import { app } from './app';

dotenv.config({
    path: `${path.resolve()}/config.env`,
});

connect(
    process.env.DB_URL,
    {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
    },
).then(() => console.log('DB connection established'));

const port = process.env.PORT || 3000;
const server: http.Server = app.listen(port, () => {
    console.log(`Listening on port ${port}...`);
});

applicationExceptionHandler.registerUnhandledRejection(server);

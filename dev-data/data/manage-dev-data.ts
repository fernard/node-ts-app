import * as fs from 'fs';
import * as dotenv from 'dotenv';
import {connect} from 'mongoose';
import {Tour} from './../../src/models/Tour';

dotenv.config({ path: './config.env' });

connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(() => console.log('DB connection successful!'));

// READ JSON FILE
const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async (): Promise<void> => {
    try {
        await Tour.create(tours.map(tour => {
            const {id, ...rest} = tour;
            return rest;
        }));
        console.log('Data successfully loaded!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async (): Promise<void> => {
    try {
        await Tour.deleteMany({});
        console.log('Data successfully deleted!');
    } catch (err) {
        console.log(err);
    }
    process.exit();
};

if (process.argv[2] === '--import') {
    importData();
} else if (process.argv[2] === '--delete') {
    deleteData();
}

import { Tour } from '../models/Tour';
import { QueryHandler } from '../utils/QueryHandler';
import { NextFunction, Request, Response } from 'express';
import { asyncCatch } from '../decorators/asyncCatch';
import { HttpException } from '../exceptions/httpException';

export class TourController {
    @asyncCatch
    public static async getAllTours(req: Request, res: Response): Promise<void> {
        const queryHandler = new QueryHandler(Tour.find(), req.query);
        const allTours = await queryHandler
            .filter()
            .sort()
            .selectFields()
            .paginate()
            .getQuery();

        res.status(200).json({
            status: 'Success',
            total: allTours.length,
            data: allTours,
        });
    }

    @asyncCatch
    public static async addTour(req: Request, res: Response): Promise<void> {
        const newTour = await Tour.create(req.body);
        res.status(201).json({
            status: 'Success',
            data: newTour,
        });
    }
    @asyncCatch
    public static async getTourById(req: Request, res: Response, next: NextFunction): Promise<void> {
        const tour = await Tour.findById(req.params.id);
        if (!tour)
            return next(
                new HttpException(404, {
                    message: `Could not find tour with id ${req.params.id}`,
                    type: 'Not Found',
                }),
            );
        res.status(200).json({
            status: 'Success',
            data: tour,
        });
    }

    @asyncCatch
    public static async updateTour(req: Request, res: Response, next: NextFunction): Promise<void> {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body);
        if (!tour)
            return next(
                new HttpException(404, {
                    message: `Could not find tour with id ${req.params.id}`,
                    type: 'Not Found',
                }),
            );
        res.status(200).json({
            status: 'Success',
            message: `Tour with id ${tour._id} successfully updated`,
        });
    }

    @asyncCatch
    public static async deleteTour(req: Request, res: Response, next: NextFunction): Promise<void> {
        const tour = await Tour.findByIdAndDelete(req.params.id);
        if (!tour)
            return next(
                new HttpException(404, {
                    message: `Could not find tour with id ${req.params.id}`,
                    type: 'Not Found',
                }),
            );
        res.status(204).json({
            status: 'Success',
            message: `Tour with id ${tour._id} successfully deleted`,
        });
    }

    @asyncCatch
    public static async getTourStats(req: Request, res: Response): Promise<void> {
        const stats = await Tour.aggregate([
            {
                $match: {
                    ratingsAverage: { $gte: 4.5 },
                },
            },
            {
                $group: {
                    _id: req.query.groupBy ? `$${req.query.groupBy}` : '$difficulty',
                    numTours: { $sum: 1 },
                    numRatings: { $sum: '$ratingsQuantity' },
                    avgRating: { $avg: '$ratingsAverage' },
                    avgPrice: { $avg: '$price' },
                    minPrice: { $min: '$price' },
                    maxPrice: { $max: '$price' },
                },
            },
            {
                $sort: { _id: 1 },
            },
        ]);

        res.status(200).json({
            status: 'Success',
            data: stats,
        });
    }

    @asyncCatch
    public static async getMonthlyPlan(req: Request, res: Response): Promise<void> {
        const year = Number(req.params.year);
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates',
            },
            {
                $match: {
                    startDates: {
                        $gte: new Date(`${year}-01-01`),
                        $lte: new Date(`${year}-12-31`),
                    },
                },
            },
            {
                $group: {
                    _id: {
                        $month: '$startDates',
                    },
                    numOfTours: { $sum: 1 },
                    tours: {
                        $push: '$name',
                    },
                },
            },
            {
                $addFields: {
                    month: '$_id',
                },
            },
            {
                $project: {
                    _id: 0,
                },
            },
            {
                $sort: {
                    numOfTours: -1,
                },
            },
        ]);
        res.status(200).json({
            status: 'Success',
            data: plan,
        });
    }
}

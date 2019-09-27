import { Router } from 'express';
import { TourController } from '../controllers/tourController';

class TourRouter {
    private readonly router: Router;
    constructor() {
        this.router = Router();
        this.setRoutes();
    }
    public getInstance(): Router {
        return this.router;
    }
    private setRoutes(): void {
        this.router.route('/stats').get(TourController.getTourStats);

        this.router
            .route('/')
            .get(TourController.getAllTours)
            .post(TourController.addTour);

        this.router
            .route('/:id')
            .get(TourController.getTourById)
            .put(TourController.updateTour)
            .delete(TourController.deleteTour);

        this.router.route('/monthlyPlan/:year').get(TourController.getMonthlyPlan);
    }
}

export const tourRouter = new TourRouter().getInstance();

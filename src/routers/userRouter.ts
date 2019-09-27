import { Router } from 'express';
import { UserController } from '../controllers/userController';

class UserRouter {
    private readonly router: Router;
    constructor() {
        this.router = Router();
        this.setRoutes();
    }
    public getInstance(): Router {
        return this.router;
    }
    private setRoutes(): void {
        this.router.route('/').get(UserController.getAllUsers);
    }
}

export const userRouter = new UserRouter().getInstance();

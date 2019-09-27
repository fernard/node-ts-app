import { Request, Response } from 'express';

export class UserController {
    public static async getAllUsers(req: Request, res: Response): Promise<void> {
        res.status(500).json({
            status: 'Error',
            message: 'This route is not yet defined',
        });
    }
}

import { Router, Request, Response } from 'express';
import { ApiResponse } from '../utils/response';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  ApiResponse.success(
    res,
    {
      status: 'healthy',
      service: 'CampusCare API',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    'CampusCare Backend API is running smoothly'
  );
});

export default router;

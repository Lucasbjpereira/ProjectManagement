import express from 'express';
import { createProject } from '../controllers/projectController';
import { authenticateToken } from '../middleware/authMiddleware';


const router = express.Router();

router.post('/project/new', authenticateToken, createProject);

export default router;

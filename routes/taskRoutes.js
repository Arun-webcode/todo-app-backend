import express from 'express';
import {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} from '../controllers/taskController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/createtask', authMiddleware, createTask);
router.get('/getalltasks', authMiddleware, getAllTasks);
router.get('/task/:id', authMiddleware, getTaskById);
router.put('/task/:id', authMiddleware, updateTask);
router.delete('/task/:id', authMiddleware, deleteTask);

export default router;

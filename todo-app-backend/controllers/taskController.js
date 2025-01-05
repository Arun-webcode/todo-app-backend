import { Task } from "../models/task.model.js"
import { User } from "../models/user.model.js"

export const createTask = async (req, res) => {
    try {
        const { title, description, priority, user } = req.body;

        const userId = req.id;
        let userExisted = await User.findById(userId);

        if (!userExisted) {
            return res.status(400).json({
                message: "User not authenticated",
                success: false,
            });
        }

        const newTask = new Task({ title, description, priority, user });
        const savedTask = await newTask.save();
        res.status(201).json({
            message: 'Task created successfully',
            task: savedTask,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error creating task',
            error: error.message,
            success: false,
        });
    }
};

export const getAllTasks = async (req, res) => {
    try {
        const userId = req.id;
        let userExisted = await User.findById(userId);

        if (!userExisted) {
            return res.status(400).json({
                message: "User not authenticated",
                success: false,
            });
        }

        const tasks = await Task.find().populate('user', 'name email');
        res.status(200).json({
            message: 'Tasks fetched successfully',
            tasks,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching tasks',
            error: error.message,
            success: false,
        });
    }
};

export const getTaskById = async (req, res) => {
    try {
        const userId = req.id;
        let userExisted = await User.findById(userId);

        if (!userExisted) {
            return res.status(400).json({
                message: "User not authenticated",
                success: false,
            });
        }

        const task = await Task.findById(req.params.id).populate('user', 'name email');
        if (!task) {
            return res.status(404).json({
                message: 'Task not found',
                success: false,
            });
        }
        res.status(200).json({
            message: 'Task fetched successfully',
            task,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching task',
            error: error.message,
            success: false,
        });
    }
};

export const updateTask = async (req, res) => {
    try {
        const userId = req.id;
        let userExisted = await User.findById(userId);

        if (!userExisted) {
            return res.status(400).json({
                message: "User not authenticated",
                success: false,
            });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('user', 'name email');
        if (!updatedTask) {
            return res.status(404).json({
                message: 'Task not found',
                success: false,
            });
        }
        res.status(200).json({
            message: 'Task updated successfully',
            task: updatedTask,
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error updating task',
            error: error.message,
            success: false,
        });
    }
};

export const deleteTask = async (req, res) => {
    try {
        const userId = req.id;
        let userExisted = await User.findById(userId);

        if (!userExisted) {
            return res.status(400).json({
                message: "User not authenticated",
                success: false,
            });
        }

        const deletedTask = await Task.findByIdAndDelete(req.params.id);
        if (!deletedTask) {
            return res.status(404).json({
                message: 'Task not found',
                success: false,
            });
        }
        res.status(200).json({
            message: 'Task deleted successfully',
            success: true,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error deleting task',
            error: error.message,
            success: false,
        });
    }
};

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { 
        type: String,
        required: true
    },
    description: {
        type: String
    },
    priority: {
        type: String,
        enum: ["low", "medium", "high"],
        default: "low" 
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["doing", "done"],
        default: "doing"
    },
});

module.exports = mongoose.model("Task", taskSchema);

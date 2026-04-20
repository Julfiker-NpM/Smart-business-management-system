const Task = require("../models/Task");

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ owner: req.user.id })
      .populate("related_client", "name status")
      .populate("related_lead", "name status")
      .sort({ due_date: 1 });
    return res.json(tasks);
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.user.id });
    return res.status(201).json(task);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getTasks, createTask };

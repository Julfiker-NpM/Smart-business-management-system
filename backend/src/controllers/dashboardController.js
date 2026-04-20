const Client = require("../models/Client");
const Lead = require("../models/Lead");
const Task = require("../models/Task");

const getStats = async (req, res, next) => {
  try {
    const [totalClients, totalLeads, totalTasks, overdueTasks] = await Promise.all([
      Client.countDocuments({ owner: req.user.id }),
      Lead.countDocuments({ owner: req.user.id }),
      Task.countDocuments({ owner: req.user.id }),
      Task.countDocuments({
        owner: req.user.id,
        due_date: { $lt: new Date() },
        status: { $nin: ["done"] },
      }),
    ]);

    return res.json({
      totalClients,
      totalLeads,
      totalTasks,
      overdueTasks,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getStats };

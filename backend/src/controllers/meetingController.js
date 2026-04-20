const Meeting = require("../models/Meeting");

const getMeetings = async (req, res, next) => {
  try {
    const meetings = await Meeting.find({ owner: req.user.id }).sort({ date: 1 });
    return res.json(meetings);
  } catch (error) {
    return next(error);
  }
};

const createMeeting = async (req, res, next) => {
  try {
    const meeting = await Meeting.create({ ...req.body, owner: req.user.id });
    return res.status(201).json(meeting);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getMeetings, createMeeting };

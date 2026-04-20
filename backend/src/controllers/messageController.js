const Message = require("../models/Message");
const MessageTemplate = require("../models/MessageTemplate");

const defaultTemplates = [
  { title: "Follow-up", body: "Hi {{name}}, just checking in on our previous conversation." },
  { title: "Meeting Reminder", body: "Reminder: our meeting is scheduled for {{date}} at {{time}}." },
];

const getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ owner: req.user.id })
      .populate("client_id", "name email")
      .sort({ sent_at: -1 });
    return res.json(messages);
  } catch (error) {
    return next(error);
  }
};

const createMessage = async (req, res, next) => {
  try {
    const message = await Message.create({ ...req.body, owner: req.user.id });
    return res.status(201).json(message);
  } catch (error) {
    return next(error);
  }
};

const getTemplates = async (req, res, next) => {
  try {
    let templates = await MessageTemplate.find({ owner: req.user.id }).sort({ createdAt: -1 });
    if (templates.length === 0) {
      templates = await MessageTemplate.insertMany(
        defaultTemplates.map((template) => ({ ...template, owner: req.user.id }))
      );
    }
    return res.json(templates);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getMessages, createMessage, getTemplates };

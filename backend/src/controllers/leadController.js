const Lead = require("../models/Lead");
const Task = require("../models/Task");

const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({ owner: req.user.id })
      .populate("assigned_to", "name email")
      .sort({ createdAt: -1 });
    return res.json(leads);
  } catch (error) {
    return next(error);
  }
};

const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create({
      ...req.body,
      assigned_to: req.body.assigned_to || req.user.id,
      owner: req.user.id,
    });

    // Automation: create follow-up task for every new lead.
    await Task.create({
      title: `Follow up with lead: ${lead.name}`,
      description: "Automated follow-up task created from new lead.",
      due_date: new Date(Date.now() + 24 * 60 * 60 * 1000),
      status: "todo",
      related_lead: lead._id,
      owner: req.user.id,
    });

    return res.status(201).json(lead);
  } catch (error) {
    return next(error);
  }
};

const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, owner: req.user.id });
    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }
    Object.assign(lead, req.body);
    const updated = await lead.save();
    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getLeads, createLead, updateLead };

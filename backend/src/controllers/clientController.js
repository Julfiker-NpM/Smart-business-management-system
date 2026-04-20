const ActivityLog = require("../models/ActivityLog");
const Client = require("../models/Client");

const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({ owner: req.user.id }).sort({ createdAt: -1 });
    const now = new Date();
    const enriched = clients.map((client) => {
      const daysSinceContact = Math.floor(
        (now.getTime() - new Date(client.last_contact_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      return {
        ...client.toObject(),
        needs_follow_up: daysSinceContact > 3,
      };
    });

    return res.json(enriched);
  } catch (error) {
    return next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const client = await Client.create({
      ...req.body,
      owner: req.user.id,
    });
    return res.status(201).json(client);
  } catch (error) {
    return next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const client = await Client.findOne({ _id: req.params.id, owner: req.user.id });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const previousStatus = client.status;
    Object.assign(client, req.body);
    const updated = await client.save();

    if (req.body.status && req.body.status !== previousStatus) {
      await ActivityLog.create({
        client: updated._id,
        user: req.user.id,
        action: "CLIENT_STATUS_CHANGED",
        details: `Status changed from ${previousStatus} to ${req.body.status}`,
      });
    }

    return res.json(updated);
  } catch (error) {
    return next(error);
  }
};

const deleteClient = async (req, res, next) => {
  try {
    const deleted = await Client.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!deleted) {
      return res.status(404).json({ message: "Client not found" });
    }
    return res.json({ message: "Client deleted" });
  } catch (error) {
    return next(error);
  }
};

module.exports = { getClients, createClient, updateClient, deleteClient };

const cron = require("node-cron");
const Client = require("../models/Client");
const Task = require("../models/Task");

const runStaleClientReminderJob = async () => {
  const cutoff = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const staleClients = await Client.find({ last_contact_date: { $lt: cutoff } }).select("_id name owner");

  for (const client of staleClients) {
    const title = `Reminder: contact client ${client.name}`;
    const existingReminder = await Task.findOne({
      title,
      related_client: client._id,
      owner: client.owner,
      status: { $nin: ["done"] },
    });

    if (!existingReminder) {
      await Task.create({
        title,
        description: "Automated reminder created because no contact happened in 3+ days.",
        due_date: new Date(),
        status: "todo",
        related_client: client._id,
        owner: client.owner,
      });
    }
  }
};

const runOverdueTaskMarkerJob = async () => {
  await Task.updateMany(
    {
      due_date: { $lt: new Date() },
      status: { $nin: ["done", "overdue"] },
    },
    { $set: { status: "overdue" } }
  );
};

const startAutomationJobs = () => {
  // Run hourly to keep reminders and overdue states current.
  cron.schedule("0 * * * *", async () => {
    try {
      await runStaleClientReminderJob();
      await runOverdueTaskMarkerJob();
      console.log("Automation jobs completed.");
    } catch (error) {
      console.error("Automation jobs failed:", error.message);
    }
  });
};

module.exports = { startAutomationJobs };

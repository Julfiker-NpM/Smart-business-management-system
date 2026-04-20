require("dotenv").config();
const app = require("./app");
const connectDb = require("./config/db");
const { startAutomationJobs } = require("./utils/automationJobs");

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  startAutomationJobs();
  app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
  });
});

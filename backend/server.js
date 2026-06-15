const app = require("./app");
require("dotenv").config();

// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});



// CRON JOB
require("./utils/expiryScheduler");

process.on("uncaughtException", err => {
  console.log("UNCAUGHT ERROR:", err);
});
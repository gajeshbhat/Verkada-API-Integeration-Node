const express = require('express');
const cron = require('node-cron');
const { initializeModels } = require('./models');
const { fetchAndStoreData } = require('./utils');

// Initialize App and Database Models and PORT
const app = express();
initializeModels();
const PORT = process.env.PORT || 3000;


// Schedule Cron Job for every hour
cron.schedule('0 * * * *', () => {
  console.log('Running Cron Job to fetch and store data from the Sales API and Integerate with Verkada Helix API');
  fetchAndStoreData();
});

// Display Information about the App in the deafult get / endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Verkada Helix API Demo!");
});

// Start the server
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
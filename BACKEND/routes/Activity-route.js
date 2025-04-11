const express = require("express");
const router = express.Router();
const activity = require("../models/Activity");

//routes and connect to the controllers

app.get("/api/inventory/activities", async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ timestamp: -1 }) // Sort by timestamp, most recent first
      .limit(10); // Limit to 10 activities
    res.json(activities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

app.post("/api/inventory/activities", async (req, res) => {
  try {
    const activity = new Activity(req.body);
    await activity.save();
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ error: "Failed to log activity" });
  }
});

module.exports = router;

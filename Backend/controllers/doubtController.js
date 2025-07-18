// backend/controllers/doubtController.js
const Doubt = require('../models/Doubt');

// Get all doubts for a session
const getDoubts = async (req, res) => {
  try {
    const sessionId = req.params.id.trim(); // remove spaces
    const doubts = await Doubt.find({
      sessionId: { $regex: `^${sessionId}$`, $options: 'i' }, // case-insensitive exact match
    });
    res.json(doubts);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch doubts', error: err.message });
  }
};

// Post a new doubt
const postDoubt = async (req, res) => {
  try {
    const { text, sessionId } = req.body;
    if (!text || !sessionId) {
      return res.status(400).json({ message: "Missing text or sessionId" });
    }

    const doubt = await Doubt.create({ text, sessionId });
    res.status(201).json(doubt);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create doubt', error: err.message });
  }
};

// Mark a doubt as resolved
const resolveDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ message: "Doubt not found" });
    }

    doubt.isResolved = true;
    await doubt.save();
    res.json(doubt);
  } catch (err) {
    res.status(500).json({ message: 'Failed to resolve doubt', error: err.message });
  }
};

// Send answer
const sendAnswer = async (req, res) => {
  try {
    const { answer } = req.body;
    const doubt = await Doubt.findById(req.params.id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    doubt.answer = answer;
    doubt.isResolved = true;
    await doubt.save();
    res.json(doubt);
  } catch (err) {
    res.status(500).json({ message: 'Failed to send answer', error: err.message });
  }
};

// Delete doubt
const deleteDoubt = async (req, res) => {
  try {
    const doubt = await Doubt.findByIdAndDelete(req.params.id);
    if (!doubt) return res.status(404).json({ message: "Doubt not found" });

    res.json({ message: "Doubt deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete doubt', error: err.message });
  }
};


module.exports = { getDoubts, postDoubt, resolveDoubt,sendAnswer,deleteDoubt };

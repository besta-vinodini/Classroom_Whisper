// backend/routes/doubtRoutes.js
const express = require('express');
const {
  getDoubts,
  postDoubt,
  resolveDoubt,
  sendAnswer,
  deleteDoubt,  
} = require('../controllers/doubtController.js');

const router = express.Router();

router.get('/:id', getDoubts);             // Get doubts for a session
router.post('/', postDoubt);               // Post new doubt
router.put('/:id/resolve', resolveDoubt);  // Resolve a doubt
router.put('/:id/answer', sendAnswer);     // Send answer
router.delete('/:id', deleteDoubt);        // Use controller here

module.exports = router;

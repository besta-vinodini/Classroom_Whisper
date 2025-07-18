const mongoose = require('mongoose');

const doubtSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    isResolved: { type: Boolean, default: false },
    answer: { type: String, default: "" },
    upvotes: { type: Number, default: 0 },
    sessionId: { type: String, required: true },

    subject: {
      type: String,
      required: true,
      enum: ["OS", "DBMS", "DSA", "CN", "TOC"], // add more if needed
    },
    className: {
      type: String,
      required: true,
      enum: ["CSE-E1", "CSE-E2", "CSE-E3", "CSE-E4"], // add more sections if needed
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

module.exports = mongoose.model('Doubt', doubtSchema);

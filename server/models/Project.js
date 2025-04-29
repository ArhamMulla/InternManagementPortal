const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },  // Changed 'name' to 'title'
  description: { type: String },
  requiredTech: { type: [String] },  // Add 'requiredTech' as an array of strings
  assignedInterns: [{ internId: String, name: String }],
});

module.exports = mongoose.model('Project', projectSchema);
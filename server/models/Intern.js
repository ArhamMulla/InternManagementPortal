const mongoose = require('mongoose');

const internSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String },
  gender: { type: String },
  description: { type: String },
  skills: [String],
  funFact: { type: String },
  email: { type: String },
  phone: { type: String },
  role: { type: String },
  joiningDate: { type: String },
  assignedProject: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }, // linked project
  techStack: [String], 
});

module.exports = mongoose.model('Intern', internSchema);

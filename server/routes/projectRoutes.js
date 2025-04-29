const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController1');

// Define project-related routes
router.get('/', projectController.getAllProjects);            // GET /api/projects
router.post('/assign', projectController.assignInternToProject); // POST /api/projects/assign
router.post('/', projectController.addProject);   // 👈 Add route
router.delete('/:id', projectController.deleteProject);

module.exports = router;

const express = require('express');
const router = express.Router();
const internController = require('../controllers/internController1');

// Define intern-related routes
router.get('/', internController.getAllInterns);        // GET /api/interns
router.post('/', internController.createIntern);       // POST /api/interns
router.put('/:id', internController.updateIntern);     // PUT /api/interns/:id
router.delete('/:id', internController.deleteIntern);

module.exports = router;

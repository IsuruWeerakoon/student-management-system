const express = require('express');
const router = express.Router();
const timetableController = require('../controllers/timetableController');
const { authenticateUser, authorizeRoles } = require('../middleware/authMiddleware');

// Get timetable for a specific teacher
// AdminTimetable.jsx
router.get('/timetable/teacher/:teacherId', authenticateUser, authorizeRoles('admin'), timetableController.getTimetableByTeacher);
// Create new time slot
// AdminTimetable.jsx
router.post('/timetable', authenticateUser, authorizeRoles('admin'), timetableController.addTimeSlot);
// Update a time slot
// AdminTimetable.jsx
router.put('/timetable/:id', authenticateUser, authorizeRoles('admin'), timetableController.updateTimeSlot);
// Delete a time slot
// AdminTimetable.jsx
router.delete('/timetable/:id', authenticateUser, authorizeRoles('admin'), timetableController.deleteTimetableSlot);



// // Get timetable for a specific teacher
// // AdminTimetable.jsx
// router.get('/teacher/:teacherId', authenticateUser, authorizeRoles('admin'), timetableController.getTimetableByTeacher);
// // Create new time slot
// // AdminTimetable.jsx
// router.post('/', authenticateUser, authorizeRoles('admin'), timetableController.addTimeSlot);
// // Update a time slot
// // AdminTimetable.jsx
// router.put('/:id', authenticateUser, authorizeRoles('admin'), timetableController.updateTimeSlot);
// // Delete a time slot
// // AdminTimetable.jsx
// router.delete('/:id', authenticateUser, authorizeRoles('admin'), timetableController.deleteTimetableSlot);

module.exports = router;
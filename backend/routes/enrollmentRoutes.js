const express = require('express');
const { enrollStudent, getMyCourses, updateCourseProgress } = require('../controllers/enrollmentController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/enroll', protect, enrollStudent);
router.get('/my-courses', protect, getMyCourses);
router.put('/progress', protect, updateCourseProgress);

module.exports = router;

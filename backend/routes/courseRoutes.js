const express = require('express');
const { createCourse, getCourses, getCourseById } = require('../controllers/courseController');
const { protect, instructor } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, instructor, createCourse)
  .get(getCourses);

router.route('/:id')
  .get(getCourseById);

module.exports = router;

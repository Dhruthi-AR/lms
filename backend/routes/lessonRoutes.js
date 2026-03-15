const express = require('express');
const { createLesson, getLessonsByCourseId } = require('../controllers/lessonController');
const { protect, instructor } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/')
  .post(protect, instructor, createLesson);

router.route('/:courseId')
  .get(protect, getLessonsByCourseId);

module.exports = router;

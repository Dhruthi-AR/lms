const express = require('express');
const { createQuiz, getQuizByLessonId, submitQuiz } = require('../controllers/quizController');
const { protect, instructor } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', protect, instructor, createQuiz);
router.get('/:lessonId', protect, getQuizByLessonId);
router.post('/submit', protect, submitQuiz);

module.exports = router;

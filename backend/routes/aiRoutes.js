const express = require('express');
const { aiChat, generateQuiz, summarizeNotes, getRecommendations } = require('../controllers/aiController');
const { protect, instructor } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/chat', protect, aiChat);
router.post('/generate-quiz', protect, generateQuiz);
router.post('/summarize', protect, summarizeNotes);
router.get('/recommendations', protect, getRecommendations);

module.exports = router;

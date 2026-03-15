const prisma = require('../prisma/client');

// @desc    Create a quiz
// @route   POST /api/quiz
// @access  Private/Instructor
const createQuiz = async (req, res) => {
  try {
    const { lessonId, question, options, correctAnswer } = req.body;

    const quiz = await prisma.quiz.create({
      data: {
        lessonId,
        question,
        options,
        correctAnswer
      }
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get quizzes for a lesson
// @route   GET /api/quiz/:lessonId
// @access  Private
const getQuizByLessonId = async (req, res) => {
  try {
    const lessonId = Number(req.params.lessonId);

    const quizzes = await prisma.quiz.findMany({
      where: { lessonId }
    });

    res.json(quizzes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Submit quiz answers and score
// @route   POST /api/quiz/submit
// @access  Private/Student
const submitQuiz = async (req, res) => {
  try {
    const { quizId, score } = req.body;
    const studentId = req.user.id;

    // Create or update score
    const studentQuiz = await prisma.studentQuiz.upsert({
      where: {
        studentId_quizId: {
          studentId,
          quizId
        }
      },
      update: {
        score
      },
      create: {
        studentId,
        quizId,
        score
      }
    });

    res.status(200).json(studentQuiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createQuiz, getQuizByLessonId, submitQuiz };

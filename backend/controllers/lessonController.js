const prisma = require('../prisma/client');

// @desc    Create a new lesson
// @route   POST /api/lessons
// @access  Private/Instructor
const createLesson = async (req, res) => {
  try {
    const { courseId, title, videoUrl, notes } = req.body;

    // Verify instructor owns the course
    const course = await prisma.course.findUnique({
      where: { id: courseId }
    });

    if (!course || course.instructorId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to add lessons to this course' });
    }

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        title,
        videoUrl,
        notes
      }
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get lessons by course ID
// @route   GET /api/lessons/:courseId
// @access  Private
const getLessonsByCourseId = async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);

    // Add check here if student is enrolled or if user is instructor/admin
    // For simplicity, returning if they are authenticated

    const lessons = await prisma.lesson.findMany({
      where: { courseId }
    });

    res.json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { createLesson, getLessonsByCourseId };

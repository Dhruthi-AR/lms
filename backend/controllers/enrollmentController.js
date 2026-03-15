const prisma = require('../prisma/client');

// @desc    Enroll student in a course
// @route   POST /api/enroll
// @access  Private/Student
const enrollStudent = async (req, res) => {
  try {
    const { courseId } = req.body;

    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: req.user.id,
          courseId: courseId
        }
      }
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: 'Already enrolled in this course' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: req.user.id,
        courseId: courseId
      }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user's enrolled courses
// @route   GET /api/my-courses
// @access  Private/Student
const getMyCourses = async (req, res) => {
  try {
    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: req.user.id },
      include: {
        course: {
          include: {
            instructor: { select: { name: true, email: true } }
          }
        }
      }
    });

    // Formatting response to return a neat list of courses with progress
    const courses = enrollments.map(e => ({
      ...e.course,
      progress: e.progress,
      enrollmentId: e.id
    }));

    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update course progress
// @route   PUT /api/enroll/progress
// @access  Private/Student
const updateCourseProgress = async (req, res) => {
  try {
    const { courseId, progress } = req.body;
    
    // Validate bounds
    const newProgress = Math.min(Math.max(progress, 0), 100);

    const updated = await prisma.enrollment.update({
      where: {
        studentId_courseId: {
          studentId: req.user.id,
          courseId: courseId
        }
      },
      data: { progress: newProgress }
    });

    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { enrollStudent, getMyCourses, updateCourseProgress };

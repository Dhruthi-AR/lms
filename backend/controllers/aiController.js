const { generateText } = require('../utils/aiProvider');
const prisma = require('../prisma/client');

// @desc    Chat with AI Tutor
// @route   POST /api/ai/chat
// @access  Private/Student
const aiChat = async (req, res) => {
  try {
    const { message } = req.body;
    
    const reply = await generateText(
      message, 
      "You are SmartLearn AI, a helpful and encouraging tutor. Explain concepts clearly and concisely."
    );
    
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Service Error' });
  }
};

// @desc    Generate a quiz from lesson notes
// @route   POST /api/ai/generate-quiz
// @access  Private/Instructor
const generateQuiz = async (req, res) => {
  try {
    const { lessonNotes, count = 5 } = req.body;
    
    if (!lessonNotes) return res.status(400).json({ message: 'Lesson notes are required' });

    const prompt = `Generate ${count} multiple choice questions from the following lesson content. 
Return ONLY a valid JSON array of objects, where each object has:
- question: (string)
- options: (array of 4 strings)
- correctAnswer: (string, one of the options)

Content:
${lessonNotes}
`;

    const result = await generateText(prompt, "You are a quiz generator. Output ONLY strict JSON array, no markdown wrappers or other text.");
    
    try {
      // Parse JSON array assuming AI obeyed instruction
      let cleanedJson = result.replace(/```json/gi, '').replace(/```/g, '').trim();
      const quizzes = JSON.parse(cleanedJson);
      res.json(quizzes);
    } catch (parseError) {
      console.error('Failed to parse AI JSON:', result);
      res.status(500).json({ message: 'AI did not return valid JSON' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Service Error' });
  }
};

// @desc    Summarize lesson notes
// @route   POST /api/ai/summarize
// @access  Private
const summarizeNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    if (!notes) return res.status(400).json({ message: 'Notes are required' });

    const summary = await generateText(
      `Please summarize the following lesson notes into key bullet points:\n\n${notes}`,
      "You are an expert summarizer. Keep summaries concise and highlight the main takeaways."
    );

    res.json({ summary });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Service Error' });
  }
};

// @desc    Learning Recommendations
// @route   GET /api/ai/recommendations
// @access  Private/Student
const getRecommendations = async (req, res) => {
  try {
    const studentId = req.user.id;

    // Fetch student's quizzes to assess performance
    const scores = await prisma.studentQuiz.findMany({
      where: { studentId },
      include: {
        quiz: {
          include: { lesson: { select: { title: true } } }
        }
      }
    });

    if (scores.length === 0) {
      return res.json({ recommendation: "You haven't taken any quizzes yet. Start learning and taking quizzes to get recommendations!" });
    }

    const performanceSummary = scores.map(s => `Topic: ${s.quiz.lesson.title}, Score: ${s.score}%`).join('; ');
    
    const prompt = `Based on the student's performance on the following topics: [${performanceSummary}], suggest what they should study next and give one encouraging tip.`;

    const recommendation = await generateText(
      prompt,
      "You are a learning counselor analyzing quiz scores. Provide a short, constructive summary and a specific study recommendation."
    );

    res.json({ recommendation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI Service Error' });
  }
};

module.exports = { aiChat, generateQuiz, summarizeNotes, getRecommendations };

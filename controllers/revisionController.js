import { Revision } from '../Model/Revision.js';

// Fetch all questions
export const getAllQuestions = async (req, res) => {
  try {
    const questions = await Revision.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error });
  }
};

// Fetch a question by ID
export const getQuestionById = async (req, res) => {
  const { id } = req.params;
  try {
    const question = await Revision.findById(id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question', error });
  }
};

// Create a new question
export const createQuestion = async (req, res) => {
  try {
    const data = req.body; // Assuming the body contains an array of objects

    // Validate input
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: "Request body must be an array of questions" });
    }

    // Log the entire request body for debugging
    console.log("Request Body:", data);

    // Create all questions in the database
    const newQuestions = await Revision.insertMany(data);

    res.status(201).json({ message: "Questions created successfully", data: newQuestions });
  } catch (error) {
    res.status(400).json({ message: "Error creating questions", error });
  }
};


export const deleteQuestion = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedQuestion = await Revision.findByIdAndDelete(id);
    if (!deletedQuestion) return res.status(404).json({ message: 'Question not found' });
    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question', error });
  }
};

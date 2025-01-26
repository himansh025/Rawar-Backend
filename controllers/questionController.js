// Import the Question model
import { Question } from '../Model/Question.js';

// Create a single question
export const addQuestion = async (req, res) => {
  try {
    const newQuestion = new Question(req.body);
    await newQuestion.save();
    res.status(201).json(newQuestion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Bulk add multiple questions
export const bulkAddQuestions = async (req, res) => {
  try {
    const questions = req.body; // Expecting an array of question objects
    if (!Array.isArray(questions)) {
      return res.status(400).json({ error: 'Input must be an array of questions' });
    }
    const result = await Question.insertMany(questions);
    res.status(201).json({ message: 'Questions added successfully', data: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Fetch all questions
export const getQuestions = async (req, res) => {
  try {
    const { category, difficulty, tags } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (tags) filter.tags = { $in: tags.split(',') };

    const questions = await Question.find(filter);
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch a specific question by ID
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    
    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json(question);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a question by ID
export const deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedQuestion = await Question.findByIdAndDelete(id);

    if (!deletedQuestion) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

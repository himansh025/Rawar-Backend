import User from './Model/user.model';

class UserRepository {
  async createUser(data) {
    try {
      const user = new User(data);
      return await user.save();
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      return await User.findById(userId);
    } catch (error) {
      throw new Error(`Error fetching user by ID: ${error.message}`);
    }
  }

  async getUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw new Error(`Error fetching user by email: ${error.message}`);
    }
  }

  async updateUser(userId, updates) {
    try {
      return await User.findByIdAndUpdate(userId, updates, { new: true });
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error) {
      throw new Error(`Error deleting user: ${error.message}`);
    }
  }
  async updateProgress(userId, updateData) {
    return Question.findByIdAndUpdate(
      userId,
      { $inc: updateData }, // Incremental update for progress
      { new: true } // Return updated document
    );
  }

  // Get leaderboard
  async getLeaderboard() {
    return Question.find({})
      .sort({ 'progress.correctAnswers': -1 })
      .limit(10)
      .select('name progress.correctAnswers');
  }
};
export default new UserRepository();


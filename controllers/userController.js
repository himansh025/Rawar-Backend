import userRepository from './user.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class UserController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if the user already exists
      const existingUser = await userRepository.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const newUser = await userRepository.createUser({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find the user by email
      const user = await userRepository.getUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate a token
      const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getUserProfile(req, res) {
    try {
      const userId = req.user.userId;
      const user = await userRepository.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateUserProfile(req, res) {
    try {
      const userId = req.user.userId;
      const updates = req.body;

      const updatedUser = await userRepository.updateUser(userId, updates);
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteUser(req, res) {
    try {
      const userId = req.user.userId;

      const deletedUser = await userRepository.deleteUser(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new UserController();

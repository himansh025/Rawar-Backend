import adminRepository from './admin.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AdminController {
  async register(req, res) {
    try {
      const { name, email, password } = req.body;

      // Check if the admin already exists
      const existingAdmin = await adminRepository.getAdminByEmail(email);
      if (existingAdmin) {
        return res.status(400).json({ message: 'Admin already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new admin
      const newAdmin = await adminRepository.createAdmin({
        name,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({ message: 'Admin registered successfully', admin: newAdmin });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Find the admin by email
      const admin = await adminRepository.getAdminByEmail(email);
      if (!admin) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Compare the password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Generate a token
      const token = jwt.sign({ adminId: admin._id, role: admin.role }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      return res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async getAdminProfile(req, res) {
    try {
      const adminId = req.admin.adminId;
      const admin = await adminRepository.getAdminById(adminId);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      return res.status(200).json({ admin });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async updateAdminProfile(req, res) {
    try {
      const adminId = req.admin.adminId;
      const updates = req.body;

      const updatedAdmin = await adminRepository.updateAdmin(adminId, updates);
      if (!updatedAdmin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      return res.status(200).json({ message: 'Profile updated successfully', admin: updatedAdmin });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  async deleteAdmin(req, res) {
    try {
      const adminId = req.admin.adminId;

      const deletedAdmin = await adminRepository.deleteAdmin(adminId);
      if (!deletedAdmin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      return res.status(200).json({ message: 'Admin deleted successfully' });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}

module.exports = new AdminController();

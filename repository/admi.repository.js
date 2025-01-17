import Admin from './admin.model';

class AdminRepository {
  async createAdmin(data) {
    try {
      const admin = new Admin(data);
      return await admin.save();
    } catch (error) {
      throw new Error(`Error creating admin: ${error.message}`);
    }
  }

  async getAdminByEmail(email) {
    try {
      return await Admin.findOne({ email });
    } catch (error) {
      throw new Error(`Error fetching admin by email: ${error.message}`);
    }
  }

  async getAdminById(adminId) {
    try {
      return await Admin.findById(adminId);
    } catch (error) {
      throw new Error(`Error fetching admin by ID: ${error.message}`);
    }
  }

  async updateAdmin(adminId, updates) {
    try {
      return await Admin.findByIdAndUpdate(adminId, updates, { new: true });
    } catch (error) {
      throw new Error(`Error updating admin: ${error.message}`);
    }
  }

  async deleteAdmin(adminId) {
    try {
      return await Admin.findByIdAndDelete(adminId);
    } catch (error) {
      throw new Error(`Error deleting admin: ${error.message}`);
    }
  }
}

module.exports = new AdminRepository();

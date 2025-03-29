import bcrypt from "bcryptjs";
import { UserRepository } from "@/repositories/userRepository";

export const UserService = {
  async getAll() {
    const users = await UserRepository.findAll();
    // Hindari mengirim field password
    return users.map(({ password, ...rest }) => rest);
  },

  async getById(id) {
    const user = await UserRepository.findById(id);
    if (!user) return null;

    // Jangan expose password
    const { password, ...safeUser } = user;
    return safeUser;
  },

  async create(data) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const payload = { ...data, password: hashedPassword };
    return UserRepository.create(payload);
  },

  async update(id, data) {
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }
    return UserRepository.update(id, data);
  },

  async delete(id) {
    return UserRepository.delete(id);
  },
};

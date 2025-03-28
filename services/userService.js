import { UserRepository } from "@/repositories/userRepository";

export const UserService = {
  getAll: () => UserRepository.findAll(),

  getById: (id) => UserRepository.findById(id),

  create: (payload) => UserRepository.create(payload),

  update: (id, payload) => UserRepository.update(id, payload),
};

import { KriteriaRepository } from "@/repositories/kriteriaRepository";

export const KriteriaService = {
  getAll: () => KriteriaRepository.findAll(),

  getById: (id) => KriteriaRepository.findById(id),

  create: (payload) => KriteriaRepository.create(payload),

  update: (id, payload) => KriteriaRepository.update(id, payload),
};

import { PeriodeRepository } from "@/repositories/periodeRepository";

export const PeriodeService = {
  getAll: () => PeriodeRepository.findAll(),

  getById: (id) => PeriodeRepository.findById(id),

  create: (payload) => PeriodeRepository.create(payload),

  update: (id, payload) => PeriodeRepository.update(id, payload),
};

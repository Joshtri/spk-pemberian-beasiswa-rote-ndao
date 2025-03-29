import { SubKriteriaRepository } from "@/repositories/subKriteriaRepository";

export const SubKriteriaService = {
  getAll: () => SubKriteriaRepository.findAll(),

  getById: (id) => SubKriteriaRepository.findById(id),

  create: (payload) => {
    const { kriteriaId, ...rest } = payload;
    return SubKriteriaRepository.create({
      ...rest,
      kriteria: {
        connect: { id: kriteriaId },
      },
    });
  },

  update: (id, payload) => {
    const { kriteriaId, ...rest } = payload;
    const data = {
      ...rest,
      ...(kriteriaId && {
        kriteria: {
          connect: { id: kriteriaId },
        },
      }),
    };
    return SubKriteriaRepository.update(id, data);
  },

  delete: (id) => SubKriteriaRepository.delete(id),
};

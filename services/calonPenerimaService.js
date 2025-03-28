import { CalonPenerimaRepository } from "@/repositories/calonPenerimaRepository";

export const CalonPenerimaService = {
  getAll: () => CalonPenerimaRepository.findAll(),

  getById: (id) => CalonPenerimaRepository.findById(id),

  getByUserId: (userId) => CalonPenerimaRepository.findByUserId(userId),

  create: (payload) =>
    CalonPenerimaRepository.create({
      ...payload,
      user: { connect: { id: payload.userId } },
    }),

  update: (id, payload) =>
    CalonPenerimaRepository.update(id, payload),

  delete: (id) =>
    CalonPenerimaRepository.delete(id).then(() => undefined),
};

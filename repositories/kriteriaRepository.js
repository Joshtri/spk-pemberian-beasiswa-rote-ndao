import prisma  from "@/lib/prisma";

export const KriteriaRepository = {
  findAll: () => prisma.kriteria.findMany(),

  findById: (id) => prisma.kriteria.findUnique({ where: { id } }),

  create: (data) => prisma.kriteria.create({ data }),

  update: (id, data) =>
    prisma.kriteria.update({ where: { id }, data }),

  delete: (id) =>
    prisma.kriteria.delete({ where: { id } }),
};

import prisma  from "@/lib/prisma";

export const SubKriteriaRepository = {
  findAll: () =>
    prisma.subKriteria.findMany({
      include: { kriteria: true },
    }),

  findById: (id) =>
    prisma.subKriteria.findUnique({
      where: { id },
      include: { kriteria: true },
    }),

  create: (data) => prisma.subKriteria.create({ data }),

  update: (id, data) =>
    prisma.subKriteria.update({ where: { id }, data }),

  delete: (id) =>
    prisma.subKriteria.delete({ where: { id } }),
};

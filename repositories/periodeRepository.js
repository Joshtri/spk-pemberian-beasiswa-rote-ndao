import prisma  from "@/lib/prisma";

export const PeriodeRepository = {
  findAll: () => prisma.periode.findMany(),

  findById: (id) => prisma.periode.findUnique({ where: { id } }),

  create: (data) => prisma.periode.create({ data }),

  update: (id, data) =>
    prisma.periode.update({ where: { id }, data }),

  delete: (id) =>
    prisma.periode.delete({ where: { id } }), // Fix: sebelumnya salah pakai prisma.user
};

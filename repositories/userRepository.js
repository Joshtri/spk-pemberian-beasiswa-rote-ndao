import prisma  from "@/lib/prisma";

export const UserRepository = {
  findAll: () => prisma.user.findMany(),

  findById: (id) => prisma.user.findUnique({ where: { id } }),

  create: (data) => prisma.user.create({ data }),

  update: (id, data) =>
    prisma.user.update({ where: { id }, data }),

  delete: (id) =>
    prisma.user.delete({ where: { id } }),
};

import prisma  from "@/lib/prisma";

export const CalonPenerimaRepository = {
  findAll: () => prisma.calonPenerima.findMany(),

  findByUserId: (userId) =>
    prisma.calonPenerima.findFirst({
      where: { userId },
    }),

  findById: (id) =>
    prisma.calonPenerima.findUnique({
      where: { id },
    }),

  create: (data) =>
    prisma.calonPenerima.create({ data }),

  update: (id, data) =>
    prisma.calonPenerima.update({
      where: { id },
      data,
    }),

  delete: (id) =>
    prisma.calonPenerima.delete({
      where: { id },
    }),
};

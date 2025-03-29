import { KriteriaService } from "@/services/kriteriaService";
import { NextResponse } from "next/server";

export const KriteriaController = {
  async getAll() {
    const users = await KriteriaService.getAll();
    return NextResponse.json(users);
  },

  async getById(id) {
    const kriteria = await KriteriaService.getById(id);
    if (!kriteria) {
      return NextResponse.json({ message: "kriteria not found" }, { status: 404 });
    }
    return NextResponse.json(kriteria);
  },

  async create(data) {
    const kriteria = await KriteriaService.create(data);
    return NextResponse.json(kriteria, { status: 201 });
  },

  async update(id, data) {
    const kriteria = await KriteriaService.update(id, data);
    return NextResponse.json(kriteria);
  },

  async delete(id) {
    await KriteriaService.delete(id);
    return NextResponse.json(null, { status: 204 });
  },
};

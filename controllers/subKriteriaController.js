import { SubKriteriaService } from "@/services/subKriteriaService";
import { NextResponse } from "next/server";

export const SubKriteriaController = {
  async getAll() {
    const list = await SubKriteriaService.getAll();
    return NextResponse.json(list);
  },

  async getById(id) {
    const item = await SubKriteriaService.getById(id);
    if (!item) {
      return NextResponse.json({ message: "SubKriteria not found" }, { status: 404 });
    }
    return NextResponse.json(item);
  },

  async create(data) {
    const created = await SubKriteriaService.create(data);
    return NextResponse.json(created, { status: 201 });
  },

  async update(id, data) {
    const updated = await SubKriteriaService.update(id, data);
    return NextResponse.json(updated);
  },

  async delete(id) {
    await SubKriteriaService.delete(id);
    return NextResponse.json(null, { status: 204 });
  },
};

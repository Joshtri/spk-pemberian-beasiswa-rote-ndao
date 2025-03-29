import { PeriodeService } from "@/services/periodeService";
import { NextResponse } from "next/server";

export const PeriodeController = {
  async getAll() {
    const list = await PeriodeService.getAll();
    return NextResponse.json(list);
  },

  async getById(id) {
    const data = await PeriodeService.getById(id);
    if (!data) {
      return NextResponse.json({ message: "Periode not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  },

  async create(data) {
    const created = await PeriodeService.create(data);
    return NextResponse.json(created, { status: 201 });
  },

  async update(id, data) {
    const updated = await PeriodeService.update(id, data);
    return NextResponse.json(updated);
  },

  async delete(id) {
    await PeriodeService.delete(id);
    return NextResponse.json(null, { status: 204 });
  },
};

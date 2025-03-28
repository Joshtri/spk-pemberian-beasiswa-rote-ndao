import { CalonPenerimaService } from "@/services/calonPenerimaService";
import { NextResponse } from "next/server";

export const CalonPenerimaController = {
  async getAll() {
    const list = await CalonPenerimaService.getAll();
    return NextResponse.json(list);
  },

  async getById(id) {
    const data = await CalonPenerimaService.getById(id);
    if (!data) {
      return NextResponse.json({ message: "Data not found" }, { status: 404 });
    }
    return NextResponse.json(data);
  },

  async getByUserId(userId) {
    const data = await CalonPenerimaService.getByUserId(userId);
    return NextResponse.json({ onboarded: !!data });
  },

  async create(data) {
    const created = await CalonPenerimaService.create(data);
    return NextResponse.json(created, { status: 201 });
  },

  async update(id, data) {
    const updated = await CalonPenerimaService.update(id, data);
    return NextResponse.json(updated);
  },

  async delete(id) {
    await CalonPenerimaService.delete(id);
    return NextResponse.json(null, { status: 204 });
  },
};

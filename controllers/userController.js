import { UserService } from "@/services";
import { NextResponse } from "next/server";

export const UserController = {
  async getAll() {
    const users = await UserService.getAll();
    return NextResponse.json(users);
  },

  async getById(id) {
    const user = await UserService.getById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  },

  async create(data) {
    const user = await UserService.create(data);
    return NextResponse.json(user, { status: 201 });
  },

  async update(id, data) {
    const user = await UserService.update(id, data);
    return NextResponse.json(user);
  },

  // async delete(id) {
  //   await UserService.delete(id);
  //   return NextResponse.json(null, { status: 204 });
  // },
};

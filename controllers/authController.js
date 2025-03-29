import { AuthService } from "@/services/authService";
import { NextResponse } from "next/server";

export const AuthController = {
  async login(request) {
    try {
      const { email, password } = await request.json();

      if (!email || !password) {
        return NextResponse.json({ message: "Email dan password wajib diisi" }, { status: 400 });
      }

      const { token, user } = await AuthService.login(email, password);
      return NextResponse.json({ token, user });

    } catch (error) {
      return NextResponse.json({ message: error.message }, { status: 401 });
    }
  },
};

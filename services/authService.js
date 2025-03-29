import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserRepository } from "@/repositories/userRepository";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret";
const JWT_EXPIRES_IN = "7d";

export const AuthService = {
  async login(email, password) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error("User not found");

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) throw new Error("Invalid credentials");

    // Remove password before returning
    const { password: _, ...safeUser } = user;

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { token, user: safeUser };
  },
};

import {Request, Response, NextFunction} from "express";
import prisma from "../../prisma/prisma";
import {LoginInput, loginSchema, RegisterInput, registerSchema} from "../zod/schema";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {env} from "../env";

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, password}: LoginInput = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {email},
    });

    if (!user) {
      return res.status(404).json({message: "User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({message: "Invalid password"});
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      env.JWT_SECRET,
      {expiresIn: "1d", algorithm: "HS256"}
    );

    const refreshToken = jwt.sign(
      {id: user.id},
      env.JWT_SECRET,
      {expiresIn: "7d", algorithm: "HS256"}
    );

    // --- REVISI LOGIKA COOKIE ---
    // Karena kita menggunakan Proxy (Rewrite) di Frontend,
    // request dianggap berasal dari domain yang sama (Same-Origin).
    const isProduction = env.NODE_ENV === "production";

    const cookieOptions: any = {
      httpOnly: true,
      // Secure wajib true di Vercel (HTTPS), tapi false di Localhost (HTTP)
      secure: isProduction,
      // Gunakan 'lax' agar cookie dikirim di navigasi normal & request same-origin.
      // Jangan gunakan 'none' karena ini bukan lagi cross-site request berkat proxy.
      sameSite: "lax",
      path: "/",
      // PENTING: Jangan set atribut 'domain' secara manual!
      // Biarkan kosong agar browser mengikat cookie ke domain Frontend (host saat ini).
    };

    res.cookie("access_token", accessToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.cookie("refresh_token", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    // -----------------------------


    return res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (e) {
    next(e);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isProduction = env.NODE_ENV === "production";

    // Config harus SAMA PERSIS dengan saat cookie dibuat agar bisa dihapus
    const clearOptions: any = {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/"
      // Domain tidak perlu diset karena saat create juga tidak diset
    };

    res.clearCookie("access_token", clearOptions);
    res.clearCookie("refresh_token", clearOptions);

    return res.status(200).json({
      message: "Logout successful"
    });
  } catch (error) {
    next(error)
  }
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, password, name, role}: RegisterInput = registerSchema.parse(req.body);
    const registerProcess = await prisma.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: {email}
      })
      if (existingUser) {
        return res.status(409).json({message: 'User already exists'})
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await tx.user.create({
        data: {
          id: `${role === "USER" ? 'USER-' : role === "ORGANIZER" ? 'ORG-' : 'ADM'}` + Date.now(),
          role,
          name,
          email,
          password: hashedPassword
        }
      })
      const {password: _, ...userWithoutPassword} = newUser;
      return {user: userWithoutPassword}
    })
    if (!registerProcess) return;
    return res.status(201).json({message: 'Registration successful', data: registerProcess})
  } catch (e) {
    next(e);
  }
}
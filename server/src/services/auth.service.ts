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

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

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

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {email, password, name}: RegisterInput = registerSchema.parse(req.body);
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
          id: 'USER-' + Date.now(),
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
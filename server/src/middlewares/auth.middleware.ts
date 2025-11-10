import {NextFunction, Request, Response} from "express";
import jwt from "jsonwebtoken";
import {env} from "../env";

interface JwtPayload {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN' | 'ORGANIZER';
  iat: number;
  exp: number;
}

// Extend Express Request agar bisa punya properti `user`
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Ambil token dari cookie
    const token = req.cookies?.access_token;

    if (!token) {
      return res.status(401).json({message: "Access token missing"});
    }

    // Verifikasi token
    // Simpan payload ke req.user
    req.user = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    next(); // lanjut ke route handler
  } catch (err: any) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({message: "Token expired"});
    }
    return res.status(403).json({message: "Invalid token"});
  }
};

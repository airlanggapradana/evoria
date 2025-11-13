import {Request, Response, NextFunction} from "express";
import prisma from "../../prisma/prisma";

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.id;
    const user = await prisma.user.findUnique({
      where: {id: userId},
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    })
    if (!user) {
      return res.status(404).json({message: 'User not found'});
    }
    res.status(200).json({
      user
    })
  } catch (e) {
    next(e)
  }
}
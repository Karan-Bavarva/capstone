import { Request, Response, NextFunction } from 'express';
export const permit = (...allowed: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Not authorized' });
    if (allowed.includes(user.role)) return next();
    return res.status(403).json({ message: 'Forbidden' });
  };
};

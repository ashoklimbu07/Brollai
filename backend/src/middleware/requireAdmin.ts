import type { Request, Response, NextFunction } from 'express';
import { readSessionUser } from '../services/auth/session.js';
import { UserModel } from '../models/user.model.js';
import { ADMIN_EMAILS } from '../config.js';

/**
 * Middleware that blocks non-admin access.
 * Fetches fresh role from DB — JWT may be stale.
 */
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const sessionUser = readSessionUser(req);
    if (!sessionUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const dbUser = await UserModel.findById(sessionUser.id).lean();
        if (!dbUser) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        const isAdmin = ADMIN_EMAILS.includes(dbUser.email) || dbUser.role === 'admin';
        if (!isAdmin) {
            res.status(403).json({ error: 'Forbidden: admin only' });
            return;
        }

        next();
    } catch {
        res.status(500).json({ error: 'Failed to verify admin access' });
    }
}

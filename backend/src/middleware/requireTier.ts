import type { Request, Response, NextFunction } from 'express';
import { readSessionUser } from '../services/auth/session.js';
import { UserModel } from '../models/user.model.js';
import { TIER_LIMITS, ADMIN_EMAILS } from '../config.js';

/**
 * Middleware that enforces per-tier usage limits.
 * Must run AFTER requireAuth.
 *
 * Flow:
 *  1. Fetch fresh user from DB (JWT may be stale after tier changes)
 *  2. Admin + ultra → unlimited, pass through
 *  3. Check if monthly cycle has expired → reset counter if so
 *  4. If usageCount >= limit → 429 with remaining/limit info
 *  5. Increment usageCount atomically and continue
 */
export async function requireTier(req: Request, res: Response, next: NextFunction) {
    const sessionUser = readSessionUser(req);
    if (!sessionUser) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }

    try {
        const dbUser = await UserModel.findById(sessionUser.id);
        if (!dbUser) {
            res.status(401).json({ error: 'User not found' });
            return;
        }

        // Re-check admin status from ADMIN_EMAILS in case env changed
        const isAdmin = ADMIN_EMAILS.includes(dbUser.email) || dbUser.role === 'admin';

        // Unlimited tiers — skip all counting
        if (isAdmin || dbUser.tier === 'ultra') {
            next();
            return;
        }

        const limit: number = TIER_LIMITS[dbUser.tier] ?? TIER_LIMITS['free'] ?? 3;

        // Reset monthly cycle if it has expired
        const now = new Date();
        const resetAt = dbUser.usageResetAt;
        if (resetAt && now > resetAt) {
            dbUser.usageCount = 0;
            dbUser.usageResetAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        }

        // Enforce limit
        if (dbUser.usageCount >= limit) {
            res.status(429).json({
                error: 'Usage limit reached',
                tier: dbUser.tier,
                used: dbUser.usageCount,
                limit,
            });
            return;
        }

        // Set reset date on first use
        if (!dbUser.usageResetAt) {
            dbUser.usageResetAt = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        }

        // Increment and save
        dbUser.usageCount += 1;
        await dbUser.save();

        next();
    } catch (err) {
        console.error('requireTier error:', err);
        res.status(500).json({ error: 'Failed to check usage limit' });
    }
}

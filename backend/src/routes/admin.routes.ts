import { Router, type Request, type Response } from 'express';
import { UserModel } from '../models/user.model.js';

const router = Router();

// GET /api/admin/users — list all users with their role, tier, usage
router.get('/users', async (req: Request, res: Response) => {
    try {
        const users = await UserModel.find({})
            .select('name email role tier usageCount usageResetAt tierStartedAt lastLoginAt createdAt provider')
            .sort({ createdAt: -1 })
            .lean();

        // Normalize users created before the tier/role fields were added
        const normalized = users.map((u) => ({
            ...u,
            role: u.role ?? 'user',
            tier: u.tier ?? 'free',
            usageCount: u.usageCount ?? 0,
            // Free users fall back to createdAt as their cycle start
            tierStartedAt: u.tierStartedAt ?? u.createdAt,
        }));

        res.json({ users: normalized });
    } catch {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// PUT /api/admin/users/:id/tier — update a user's tier
router.put('/users/:id/tier', async (req: Request, res: Response) => {
    const { id } = req.params;
    const { tier } = req.body as { tier?: string };

    const validTiers = ['free', 'pro', 'ultra'];
    if (!tier || !validTiers.includes(tier)) {
        res.status(400).json({ error: `tier must be one of: ${validTiers.join(', ')}` });
        return;
    }

    try {
        const now = new Date();
        const user = await UserModel.findByIdAndUpdate(
            id,
            {
                tier,
                // Reset usage and start a fresh 30-day cycle when tier changes
                usageCount: 0,
                tierStartedAt: now,
                usageResetAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
            },
            { new: true, select: 'name email role tier usageCount tierStartedAt' },
        ).lean();

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ user });
    } catch {
        res.status(500).json({ error: 'Failed to update tier' });
    }
});

// POST /api/admin/users/:id/reset-usage — manually reset a user's monthly counter
router.post('/users/:id/reset-usage', async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const user = await UserModel.findByIdAndUpdate(
            id,
            { usageCount: 0, usageResetAt: null },
            { new: true, select: 'name email usageCount' },
        ).lean();

        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ user });
    } catch {
        res.status(500).json({ error: 'Failed to reset usage' });
    }
});

export { router as adminRoutes };

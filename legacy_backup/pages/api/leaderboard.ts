import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'server', 'db.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        if (!fs.existsSync(DB_PATH)) {
            return res.status(200).json({ users: [] });
        }

        const dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
        const users = Object.values(dbData.users).sort((a: any, b: any) => b.xp - a.xp);

        res.status(200).json({ users });
    } catch (error) {
        console.error('Leaderboard error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

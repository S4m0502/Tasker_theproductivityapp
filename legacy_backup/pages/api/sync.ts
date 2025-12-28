import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'server', 'db.json');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { userId, name, xp, coins, level, inventory } = req.body;

        if (!fs.existsSync(DB_PATH)) {
            // Ensure directory exists
            const dir = path.dirname(DB_PATH);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(DB_PATH, JSON.stringify({ users: {} }));
        }

        const dbData = JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));

        // Update user data
        dbData.users[userId] = {
            name: name || 'Unknown',
            xp,
            coins,
            level,
            inventory,
            lastSeen: new Date().toISOString()
        };

        fs.writeFileSync(DB_PATH, JSON.stringify(dbData, null, 2));

        res.status(200).json({ message: 'Synced successfully' });
    } catch (error) {
        console.error('Sync error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

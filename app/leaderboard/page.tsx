'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface LeaderboardUser {
    id: string;
    email: string;
    stats: {
        xp: number;
        coins: number;
        level: number;
    };
}

export default function LeaderboardPage() {
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const router = useRouter();

    useEffect(() => {
        const q = query(collection(db, 'users'), orderBy('stats.xp', 'desc'), limit(10));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedUsers = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as LeaderboardUser[];
            setUsers(loadedUsers);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
            <h1 className="text-2xl font-bold text-center mb-8">Leaderboard 🏆</h1>

            <div className="space-y-4">
                {users.map((user, index) => (
                    <div key={user.id} className={`flex items-center p-4 rounded-xl border ${index === 0 ? 'bg-yellow-900/20 border-yellow-500/50' : 'bg-gray-800 border-gray-700'
                        }`}>
                        <div className={`w-8 font-bold text-center ${index === 0 ? 'text-yellow-400 text-xl' : 'text-gray-400'
                            }`}>
                            #{index + 1}
                        </div>
                        <div className="flex-1 ml-4">
                            <div className="font-bold">{user.email?.split('@')[0] || 'Anonymous'}</div>
                            <div className="text-xs text-gray-400">Level {user.stats.level}</div>
                        </div>
                        <div className="font-mono text-blue-400 font-bold">
                            {user.stats.xp} XP
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 flex justify-around">
                <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-white">Tasks</button>
                <button className="text-blue-400 font-bold">Leaderboard</button>
            </nav>
        </div>
    );
}

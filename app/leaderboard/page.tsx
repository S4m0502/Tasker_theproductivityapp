'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import BottomNav from '../../components/BottomNav';

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
        <div className="min-h-screen bg-gray-950 text-white pb-32">
            <div className="max-w-md mx-auto px-6 pt-10">
                <h1 className="text-3xl font-black tracking-tight mb-2">Multiverse</h1>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-8">Top Operators</p>

                <div className="space-y-3">
                    {users.map((user, index) => (
                        <div
                            key={user.id}
                            className={`flex items-center p-4 rounded-2xl border transition-all ${index === 0
                                ? 'bg-yellow-500/10 border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.15)]'
                                : 'bg-gray-800/80 border-gray-700'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black ${index === 0 ? 'bg-yellow-500/20 text-yellow-400 text-lg' : 'bg-gray-900/50 text-gray-500 text-sm'
                                }`}>
                                #{index + 1}
                            </div>
                            <div className="flex-1 ml-4">
                                <div className="font-bold tracking-tight">{user.email?.split('@')[0] || 'Anonymous'}</div>
                                <div className="text-[10px] text-gray-500 uppercase tracking-widest">Level {user.stats.level}</div>
                            </div>
                            <div className="flex flex-col items-end">
                                <div className="font-mono text-blue-400 font-black text-lg">{user.stats.xp}</div>
                                <div className="text-[10px] text-gray-600 uppercase tracking-tighter">XP</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent pt-10">
                <BottomNav currentPage="leaderboard" />
            </div>
        </div>
    );
}

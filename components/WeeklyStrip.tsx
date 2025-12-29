'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, limit, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';

interface WeeklyStripProps {
    user: User | null;
    onExpand: () => void;
}

export default function WeeklyStrip({ user, onExpand }: WeeklyStripProps) {
    const [completions, setCompletions] = useState<Record<string, number>>({});

    const days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        days.push(d);
    }

    useEffect(() => {
        if (!user) return;

        const startOfWeek = new Date();
        startOfWeek.setDate(today.getDate() - 7);
        const startStr = startOfWeek.toISOString().split('T')[0];

        const q = query(
            collection(db, `users/${user.uid}/completions`),
            where('date', '>=', startOfWeek),
            orderBy('date', 'desc'),
            limit(7)
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const data: Record<string, number> = {};
            snapshot.forEach(doc => {
                data[doc.id] = doc.data().count || 0;
            });
            setCompletions(data);
        });

        return () => unsub();
    }, [user]);

    return (
        <div
            onClick={onExpand}
            className="bg-gray-800/30 border border-gray-700/50 rounded-2xl p-4 cursor-pointer hover:bg-gray-800/50 transition-colors group"
        >
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Weekly Progress</h3>
                <span className="text-[10px] text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold">View Calendar →</span>
            </div>
            <div className="flex justify-between items-center">
                {days.map((day, i) => {
                    const dateStr = day.toISOString().split('T')[0];
                    const count = completions[dateStr] || 0;
                    const isToday = day.toDateString() === today.toDateString();

                    return (
                        <div key={dateStr} className="flex flex-col items-center gap-2">
                            <span className={`text-[10px] font-bold ${isToday ? 'text-white' : 'text-gray-600'}`}>
                                {day.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)}
                            </span>
                            <div className={`relative w-7 h-7 rounded-lg flex items-center justify-center transition-all ${count > 0
                                    ? 'bg-blue-500/20 border border-blue-500/50 shadow-[0_0_8px_rgba(59,130,246,0.3)]'
                                    : 'bg-gray-800/50 border border-gray-700/30'
                                } ${isToday ? 'ring-1 ring-gray-600 ring-offset-2 ring-offset-gray-900' : ''}`}>
                                {count > 0 && (
                                    <div className={`w-1.5 h-1.5 rounded-full ${count >= 3 ? 'bg-blue-300' : 'bg-blue-500'} animate-pulse`} />
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

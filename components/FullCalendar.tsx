'use client';

import { useState, useEffect } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User } from 'firebase/auth';

interface FullCalendarProps {
    user: User | null;
    onClose: () => void;
}

export default function FullCalendar({ user, onClose }: FullCalendarProps) {
    const [completions, setCompletions] = useState<Record<string, number>>({});
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (!user) return;

        // Listen to all completions for the current month
        const q = query(collection(db, `users/${user.uid}/completions`));
        const unsub = onSnapshot(q, (snapshot) => {
            const data: Record<string, number> = {};
            snapshot.forEach(doc => {
                data[doc.id] = doc.data().count || 0;
            });
            setCompletions(data);
        });

        return () => unsub();
    }, [user]);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    return (
        <div className="fixed inset-0 z-[110] bg-gray-950 flex flex-col p-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-white">History</h2>
                    <p className="text-gray-500 font-mono text-sm">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </p>
                </div>
                <button
                    onClick={onClose}
                    className="bg-gray-800 p-3 rounded-full border border-gray-700 active:scale-90 transition-transform"
                >
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-3 mb-4">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                    <div key={d} className="text-center text-[10px] font-bold text-gray-700 uppercase tracking-widest">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2 flex-grow auto-rows-min">
                {blanks.map(i => <div key={`blank-${i}`} />)}
                {days.map(day => {
                    const date = new Date(year, month, day);
                    const dateStr = date.toISOString().split('T')[0];
                    const count = completions[dateStr] || 0;
                    const isToday = date.toDateString() === new Date().toDateString();

                    return (
                        <div
                            key={day}
                            className={`aspect-square rounded-xl flex flex-col items-center justify-center border transition-all ${count > 0
                                    ? 'bg-blue-500/10 border-blue-500/30 ring-1 ring-blue-500/10'
                                    : 'bg-gray-900/50 border-gray-800'
                                } ${isToday ? 'border-gray-500 ring-1 ring-gray-500 ring-offset-2 ring-offset-gray-950' : ''}`}
                        >
                            <span className={`text-xs font-bold leading-none mb-1 ${count > 0 ? 'text-blue-400' : 'text-gray-600'}`}>
                                {day}
                            </span>
                            {count > 0 && (
                                <div
                                    className={`w-1.5 h-1.5 rounded-full ${count >= 5 ? 'bg-blue-300' : 'bg-blue-600'}`}
                                    title={`${count} tasks completed`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-6 bg-gray-900/50 border border-gray-800 rounded-3xl">
                <h4 className="text-[10px] uppercase font-bold text-gray-600 tracking-widest mb-4">Insights</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <div className="text-2xl font-black text-blue-400">
                            {Object.values(completions).reduce((a, b) => a + b, 0)}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Total Completed</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black text-orange-400">
                            {Object.values(completions).filter(v => v > 0).length}
                        </div>
                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">Active Days</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

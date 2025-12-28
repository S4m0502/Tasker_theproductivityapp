'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import { useUserData, Task } from '../../lib/hooks/useFirestore';
import LockedOverlay from '../../components/LockedOverlay';

export default function Dashboard() {
    const { user, loading: authLoading, signOut } = useAuth();
    const { stats, tasks, loading: dataLoading, addTask, toggleTask } = useUserData(user);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (stats.xp >= 0) { // Simple check to ensure stats loaded
            const today = new Date().toDateString();
            const unlockedDate = localStorage.getItem('unlocked_date');
            if (unlockedDate !== today) {
                setIsLocked(true);
            }
        }
    }, [stats]);

    if (authLoading || dataLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    if (!user) return null;

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskTitle.trim()) return;
        await addTask(newTaskTitle);
        setNewTaskTitle('');
    };


    const handleUnlock = () => {
        setIsLocked(false);
        localStorage.setItem('unlocked_date', new Date().toDateString());
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-4 pb-20">
            <LockedOverlay isLocked={isLocked} onUnlock={handleUnlock} />

            {/* Header */}
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-xl font-bold">Welcome, {user.email?.split('@')[0]}</h1>
                    <div className="text-sm text-gray-400">Level {stats.level}</div>
                </div>
                <button onClick={() => signOut()} className="text-sm text-red-400">Logout</button>
            </header>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-xs uppercase tracking-wider">XP</div>
                    <div className="text-2xl font-bold text-blue-400">{stats.xp}</div>
                </div>
                <div className="bg-gray-800 p-4 rounded-xl border border-gray-700">
                    <div className="text-gray-400 text-xs uppercase tracking-wider">Coins</div>
                    <div className="text-2xl font-bold text-yellow-400">{stats.coins}</div>
                </div>
            </div>

            {/* Tasks */}
            <div className="space-y-3 mb-24">
                <h2 className="text-lg font-semibold mb-2">Today's Tasks</h2>
                {tasks.map(task => (
                    <div
                        key={task.id}
                        onClick={() => toggleTask(task)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${task.isCompleted
                            ? 'bg-green-900/20 border-green-500/50 opacity-70'
                            : 'bg-gray-800 border-gray-700 hover:border-gray-600'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${task.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-500'
                                }`}>
                                {task.isCompleted && <span className="text-black text-xs">✓</span>}
                            </div>
                            <span className={task.isCompleted ? 'line-through text-gray-500' : ''}>{task.title}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            🔥 {task.streak}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Task Input */}
            <form onSubmit={handleAddTask} className="fixed bottom-20 left-4 right-4">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Add a new task..."
                        className="flex-1 p-4 bg-gray-800 rounded-xl border border-gray-700 focus:border-blue-500 outline-none shadow-lg"
                    />
                    <button
                        type="submit"
                        className="bg-blue-600 text-white p-4 rounded-xl font-bold shadow-lg"
                    >
                        +
                    </button>
                </div>
            </form>

            {/* Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 p-4 flex justify-around">
                <button className="text-blue-400 font-bold">Tasks</button>
                <button onClick={() => router.push('/leaderboard')} className="text-gray-400 hover:text-white">Leaderboard</button>
            </nav>
        </div>
    );
}

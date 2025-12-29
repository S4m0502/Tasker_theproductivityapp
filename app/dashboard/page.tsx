'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/hooks/useAuth';
import { useUserData, Task } from '../../lib/hooks/useFirestore';
import LockedOverlay from '../../components/LockedOverlay';
import XPBar from '../../components/XPBar';
import GoldCoin from '../../components/GoldCoin';
import WeeklyStrip from '../../components/WeeklyStrip';
import TaskCard from '../../components/TaskCard';
import TaskActionPanel from '../../components/TaskActionPanel';
import FullCalendar from '../../components/FullCalendar';
import BottomNav from '../../components/BottomNav';
import AvatarCreator from '../../components/AvatarCreator';
import AvatarDisplay from '../../components/AvatarDisplay';

export default function Dashboard() {
    const { user, loading: authLoading, signOut } = useAuth();
    const {
        stats,
        tasks,
        loading: dataLoading,
        addTask,
        toggleTask,
        deleteTask,
        updateTask,
        togglePin
    } = useUserData(user);

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isLocked, setIsLocked] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [showAvatarCreator, setShowAvatarCreator] = useState(false);
    const [avatarConfig, setAvatarConfig] = useState<any>(null);
    const router = useRouter();

    // Check for avatar on mount
    useEffect(() => {
        const savedAvatar = localStorage.getItem('user_avatar');
        if (savedAvatar) {
            setAvatarConfig(JSON.parse(savedAvatar));
        } else if (user) {
            // Show avatar creator on first load
            setShowAvatarCreator(true);
        }
    }, [user]);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (stats.xp >= 0) {
            const today = new Date().toDateString();
            const unlockedDate = localStorage.getItem('unlocked_date');
            if (unlockedDate !== today) {
                setIsLocked(true);
            }
        }
    }, [stats]);

    if (authLoading || dataLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white font-mono tracking-widest text-xs uppercase animate-pulse">
                Initializing Protocol...
            </div>
        );
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
        <div className="min-h-screen bg-gray-950 text-white pb-32">
            <LockedOverlay isLocked={isLocked} onUnlock={handleUnlock} />

            {showCalendar && (
                <FullCalendar user={user} onClose={() => setShowCalendar(false)} />
            )}

            {selectedTask && (
                <TaskActionPanel
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    onDelete={deleteTask}
                    onTogglePin={togglePin}
                    onUpdate={updateTask}
                />
            )}

            {showAvatarCreator && (
                <AvatarCreator
                    onComplete={(config) => {
                        setAvatarConfig(config);
                        localStorage.setItem('user_avatar', JSON.stringify(config));
                        setShowAvatarCreator(false);
                    }}
                    onSkip={() => setShowAvatarCreator(false)}
                />
            )}

            <div className="max-w-md mx-auto px-6 pt-10">
                {/* Modern Header */}
                <header className="flex flex-col gap-6 mb-10">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-4">
                            {avatarConfig && (
                                <div
                                    onClick={() => setShowAvatarCreator(true)}
                                    className="cursor-pointer hover:scale-105 transition-transform active:scale-95 bg-gray-800/50 rounded-2xl p-2 border border-gray-700/50"
                                >
                                    <AvatarDisplay config={avatarConfig} size={50} />
                                </div>
                            )}
                            <div className="flex flex-col">
                                <h1 className="text-3xl font-black tracking-tight leading-none mb-1">
                                    {user.email?.split('@')[0]}
                                </h1>
                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Operator State: ACTIVE</span>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-sm"
                        >
                            Abstain
                        </button>
                    </div>

                    <div className="flex flex-col gap-4 bg-gray-900/40 p-5 rounded-[2rem] border border-gray-800/40 backdrop-blur-md">
                        <div className="flex justify-between items-center px-1">
                            <span className="text-xs font-black uppercase text-gray-400">Progression</span>
                            <GoldCoin amount={stats.coins} />
                        </div>
                        <XPBar xp={stats.xp} level={stats.level} />
                    </div>
                </header>

                {/* Progress Strip */}
                <div className="mb-10">
                    <WeeklyStrip user={user} onExpand={() => setShowCalendar(true)} />
                </div>

                {/* Tasks List */}
                <div className="space-y-4">
                    <div className="flex justify-between items-end px-2">
                        <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">Objectives</h2>
                        <span className="text-[10px] font-bold text-blue-500/60 uppercase">Hold to Edit</span>
                    </div>

                    <div className="space-y-3">
                        {tasks.length === 0 ? (
                            <div className="text-center py-10 bg-gray-900/20 border-2 border-dashed border-gray-800 rounded-[2rem]">
                                <span className="text-gray-600 text-xs font-bold uppercase tracking-widest">No Active Missions</span>
                            </div>
                        ) : (
                            tasks.map(task => (
                                <TaskCard
                                    key={task.id}
                                    task={task}
                                    onToggle={toggleTask}
                                    onLongPress={setSelectedTask}
                                />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Add Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-gray-950 via-gray-950/90 to-transparent pt-10">
                <form
                    onSubmit={handleAddTask}
                    className="max-w-md mx-auto flex gap-3 p-2 bg-gray-900/80 border border-gray-800 rounded-3xl backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Define next objective..."
                        className="flex-1 bg-transparent px-4 py-3 text-sm focus:outline-none placeholder:text-gray-600 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={!newTaskTitle.trim()}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-800 text-white w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-900/20 active:scale-90"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                </form>

                <BottomNav currentPage="dashboard" />
            </div>
        </div>
    );
}

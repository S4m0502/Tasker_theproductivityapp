'use client';

import { useState, useRef, useEffect } from 'react';
import { Task } from '../lib/hooks/useFirestore';

interface TaskCardProps {
    task: Task;
    onToggle: (task: Task) => void;
    onLongPress: (task: Task) => void;
}

export default function TaskCard({ task, onToggle, onLongPress }: TaskCardProps) {
    const [isPressing, setIsPressing] = useState(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const startPress = () => {
        setIsPressing(true);
        timerRef.current = setTimeout(() => {
            onLongPress(task);
            setIsPressing(false);
        }, 600); // 600ms for long press
    };

    const endPress = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        setIsPressing(false);
    };

    return (
        <div
            onMouseDown={startPress}
            onMouseUp={endPress}
            onMouseLeave={endPress}
            onTouchStart={startPress}
            onTouchEnd={endPress}
            className={`relative group p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-center justify-between active:scale-95 ${task.isCompleted
                    ? 'bg-green-500/10 border-green-500/30 opacity-60'
                    : 'bg-gray-800/80 border-gray-700 hover:border-blue-500/50 hover:bg-gray-800 shadow-lg'
                } ${task.isPinned ? 'border-l-4 border-l-blue-500' : ''} ${isPressing ? 'scale-95 bg-gray-700/50 border-blue-500' : ''}`}
            onClick={(e) => {
                // Prevent click if long press was triggered
                if (!isPressing && !timerRef.current) return;
                onToggle(task);
            }}
        >
            <div className="flex items-center gap-4">
                <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-green-500 border-green-500' : 'border-gray-500 group-hover:border-blue-500'
                        }`}
                >
                    {task.isCompleted && (
                        <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>
                <div className="flex flex-col">
                    <span className={`font-semibold tracking-tight ${task.isCompleted ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                        {task.title}
                    </span>
                    {task.isPinned && (
                        <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mt-0.5">Pinned</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="bg-gray-900/50 px-2 py-1 rounded-lg border border-gray-700/50 flex items-center gap-1.5">
                    <span className="text-sm">🔥</span>
                    <span className="text-xs font-bold text-orange-400 font-mono">{task.streak}</span>
                </div>
            </div>

            {isPressing && (
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                    <div className="h-1 bg-blue-500 absolute bottom-0 left-0 transition-all duration-[600ms] ease-linear" style={{ width: '100%' }} />
                </div>
            )}
        </div>
    );
}

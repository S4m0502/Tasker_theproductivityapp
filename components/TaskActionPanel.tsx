'use client';

import { Task } from '../lib/hooks/useFirestore';
import { useState } from 'react';

interface TaskActionPanelProps {
    task: Task | null;
    onClose: () => void;
    onDelete: (id: string) => void;
    onTogglePin: (task: Task) => void;
    onUpdate: (id: string, data: Partial<Task>) => void;
}

export default function TaskActionPanel({ task, onClose, onDelete, onTogglePin, onUpdate }: TaskActionPanelProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task?.title || '');

    if (!task) return null;

    const handleUpdate = () => {
        if (editTitle.trim()) {
            onUpdate(task.id, { title: editTitle });
            setIsEditing(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-8 sm:pb-12 bg-black/60 backdrop-blur-sm transition-all duration-300">
            <div
                className="fixed inset-0"
                onClick={onClose}
            />
            <div className="relative w-full max-w-sm bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="w-12 h-1.5 bg-gray-800 rounded-full mx-auto mb-6" />

                {isEditing ? (
                    <div className="space-y-4">
                        <input
                            autoFocus
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-2xl p-4 text-white focus:border-blue-500 outline-none"
                            placeholder="Edit task title..."
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex-1 bg-gray-800 text-gray-400 p-4 rounded-2xl font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="flex-1 bg-blue-600 text-white p-4 rounded-2xl font-bold"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-4 px-2">Task Actions</h3>

                        <button
                            onClick={() => onTogglePin(task)}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-2xl border border-gray-750 transition-colors"
                        >
                            <span className="font-bold">{task.isPinned ? 'Unpin Task' : 'Pin to Top'}</span>
                            <span className="text-xl">📌</span>
                        </button>

                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full flex items-center justify-between p-4 bg-gray-800 hover:bg-gray-750 rounded-2xl border border-gray-750 transition-colors"
                        >
                            <span className="font-bold">Edit Title</span>
                            <span className="text-xl">✏️</span>
                        </button>

                        <button
                            onClick={() => {
                                onDelete(task.id);
                                onClose();
                            }}
                            className="w-full flex items-center justify-between p-4 bg-red-900/20 hover:bg-red-900/30 border border-red-500/20 rounded-2xl text-red-400 transition-colors"
                        >
                            <span className="font-bold">Delete Task</span>
                            <span className="text-xl">🗑️</span>
                        </button>

                        <button
                            onClick={onClose}
                            className="w-full p-4 mt-2 text-gray-500 font-bold uppercase tracking-widest text-xs"
                        >
                            Dismiss
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

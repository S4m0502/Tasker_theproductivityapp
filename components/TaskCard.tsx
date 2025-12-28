import React from 'react';
import { Task } from '../lib/types';

interface TaskCardProps {
    task: Task;
    onComplete: (id: string) => void;
    onUndo: (id: string) => void;
    onRemove: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onUndo, onRemove }) => {
    const today = new Date().toISOString().split('T')[0];
    const isCompletedToday = task.lastCompletedDate === today;

    return (
        <div className="card" style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            opacity: isCompletedToday ? 0.5 : 1,
            background: isCompletedToday ? 'var(--bg-primary)' : 'var(--bg-secondary)',
            border: isCompletedToday ? '1px dashed var(--border-color)' : 'none'
        }}>
            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        fontSize: '1.5rem',
                        background: 'var(--bg-primary)',
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: 'var(--shadow-soft)'
                    }}>
                        {task.icon}
                    </div>
                    <div>
                        <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{task.title}</h3>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ color: task.streak > 0 ? 'var(--color-accent)' : 'var(--text-secondary)' }}>
                                {task.streak} Day Streak
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                {!isCompletedToday ? (
                    <button
                        onClick={() => onComplete(task.id)}
                        style={{
                            background: 'var(--color-primary)',
                            border: 'none',
                            borderRadius: '20px',
                            padding: '0.5rem 1.25rem',
                            color: '#fff',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(118, 199, 70, 0.3)',
                            transition: 'transform 0.1s'
                        }}
                    >
                        Done
                    </button>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <button
                            onClick={() => onUndo(task.id)}
                            style={{
                                background: 'var(--color-danger)',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '0.5rem 1.25rem',
                                color: '#fff',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(255, 59, 48, 0.3)',
                                transition: 'transform 0.1s'
                            }}
                        >
                            Undo
                        </button>
                    </div>
                )}
                <button
                    onClick={() => onRemove(task.id)}
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        padding: '0.5rem',
                        marginLeft: '0.5rem'
                    }}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default TaskCard;

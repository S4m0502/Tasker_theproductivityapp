import React, { useState, useEffect } from 'react';

interface TaskManagerProps {
    onAdd: (title: string, icon: string, color: string) => void;
}

const RECENT_EMOJIS_DEFAULT = ['💪', '🧠', '📚', '💧', '🧘', '🏃', '🎸', '💻'];
const LIBRARY_EMOJIS = [
    '💪', '🧠', '📚', '💧', '🧘', '🏃', '🎸', '💻', '🎨', '🧹',
    '🥗', '💊', '🛌', '📝', '🤝', '💰', '🌱', '🍳', '🚶', '🚴',
    '🏊', '🥊', '🎮', '🎧', '📸', '🎥', '🎤', '🎹', '🎻', '🎺',
    '✈️', '🚗', '🏠', '🐶', '🐱', '🪴', '☀️', '🌙', '⭐️', '🔥'
];



const TaskManager: React.FC<TaskManagerProps> = ({ onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [selectedIcon, setSelectedIcon] = useState(RECENT_EMOJIS_DEFAULT[0]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd(title, selectedIcon, '#000000');
            setTitle('');
            setIsOpen(false);
            setShowEmojiPicker(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                style={{
                    width: '100%',
                    padding: '1rem',
                    background: 'transparent',
                    border: '1px dashed var(--border-color)',
                    borderRadius: '12px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    marginTop: '1rem',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    transition: 'all 0.2s'
                }}
            >
                + Add New Task
            </button>
        );
    }

    return (
        <div className="card" style={{ marginTop: '1rem', position: 'relative' }}>
            <form onSubmit={handleSubmit}>
                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        style={{
                            fontSize: '1.5rem',
                            width: '50px',
                            height: '50px',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-primary)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {selectedIcon}
                    </button>

                    <div style={{ flex: 1, position: 'relative' }}>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What habit do you want to build?"
                            style={{
                                width: '100%',
                                height: '50px',
                                padding: '0 1rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)',
                                background: 'var(--bg-primary)',
                                color: 'var(--text-primary)',
                                fontSize: '1rem',
                                outline: 'none'
                            }}
                            autoFocus
                        />
                    </div>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                    <div style={{
                        marginBottom: '1rem',
                        padding: '1rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)'
                    }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>POPULAR EMOJIS</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', maxHeight: '150px', overflowY: 'auto' }}>
                            {LIBRARY_EMOJIS.map(icon => (
                                <button
                                    key={icon}
                                    type="button"
                                    onClick={() => { setSelectedIcon(icon); setShowEmojiPicker(false); }}
                                    style={{
                                        fontSize: '1.5rem',
                                        width: '40px',
                                        height: '40px',
                                        border: 'none',
                                        background: 'var(--bg-primary)',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {icon}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-secondary)',
                            cursor: 'pointer',
                            fontWeight: '500'
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        style={{
                            flex: 1,
                            background: 'var(--text-primary)',
                            color: 'var(--bg-primary)',
                            border: 'none',
                            borderRadius: '12px',
                            padding: '0.75rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        Create Task
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TaskManager;

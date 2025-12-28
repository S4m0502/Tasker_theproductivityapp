import React, { useEffect, useState } from 'react';

interface LockedScreenProps {
    onUnlock: () => void;
    mood: string;
}

const LockedScreen: React.FC<LockedScreenProps> = ({ onUnlock, mood }) => {
    const [showUnlock, setShowUnlock] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowUnlock(true);
        }, 2000); // Delay unlock button for dramatic effect
        return () => clearTimeout(timer);
    }, []);

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.95)',
            backdropFilter: 'blur(10px)',
            color: '#fff',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            textAlign: 'center',
            animation: 'fadeIn 0.5s ease-out'
        }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔒</div>
            <h1 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                letterSpacing: '-1px',
                marginBottom: '0.5rem',
                color: '#ff3b30'
            }}>
                LOCKED
            </h1>
            <p style={{
                fontSize: '1.2rem',
                color: '#86868b',
                maxWidth: '300px',
                marginBottom: '2rem',
                lineHeight: 1.5
            }}>
                Access denied. Earn your unlock.
            </p>

            <div style={{
                background: '#1c1c1e',
                padding: '1.5rem',
                borderRadius: '12px',
                marginBottom: '2rem',
                maxWidth: '100%'
            }}>
                <div style={{ color: '#ff3b30', fontWeight: 'bold', marginBottom: '0.5rem' }}>RESTRICTIONS ACTIVE</div>
                <ul style={{ listStyle: 'none', textAlign: 'left', color: '#86868b', fontSize: '0.9rem' }}>
                    <li style={{ marginBottom: '0.5rem' }}>🚫 No YouTube</li>
                    <li style={{ marginBottom: '0.5rem' }}>🚫 No Netflix</li>
                    <li style={{ marginBottom: '0.5rem' }}>🚫 No Food Delivery</li>
                    <li>🚫 No Doomscrolling</li>
                </ul>
            </div>

            {mood && (
                <div style={{ marginBottom: '2rem', fontStyle: 'italic', color: '#ffd700' }}>
                    "{mood}"
                </div>
            )}

            {showUnlock && (
                <button
                    onClick={onUnlock}
                    style={{
                        background: 'transparent',
                        border: '1px solid #fff',
                        color: '#fff',
                        padding: '1rem 2rem',
                        borderRadius: '30px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        animation: 'fadeIn 0.5s ease-in'
                    }}
                >
                    I Accept the Challenge
                </button>
            )}
        </div>
    );
};

export default LockedScreen;

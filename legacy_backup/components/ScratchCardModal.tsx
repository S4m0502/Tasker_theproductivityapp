import React, { useState } from 'react';
import { Reward } from '../lib/types';

interface ScratchCardModalProps {
    reward: Reward;
    onRedeem: (id: string) => void;
    onClose: () => void;
}

const ScratchCardModal: React.FC<ScratchCardModalProps> = ({ reward, onRedeem, onClose }) => {
    const [isRevealed, setIsRevealed] = useState(reward.isRedeemed);

    const handleScratch = () => {
        if (!isRevealed) {
            setIsRevealed(true);
            onRedeem(reward.id);
        }
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100
        }}>
            <div style={{
                background: 'var(--bg-primary)',
                padding: '2rem',
                borderRadius: '24px',
                textAlign: 'center',
                color: 'var(--text-primary)',
                maxWidth: '320px',
                width: '90%',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
                <h2 style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>Reward Unlocked</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                    You've earned a new reward for your consistency.
                </p>

                <div
                    onClick={handleScratch}
                    style={{
                        width: '100%',
                        height: '160px',
                        background: isRevealed ? 'var(--bg-secondary)' : 'var(--border-color)',
                        backgroundImage: isRevealed ? 'none' : 'linear-gradient(45deg, #e5e5e5 25%, #f0f0f0 25%, #f0f0f0 50%, #e5e5e5 50%, #e5e5e5 75%, #f0f0f0 75%, #f0f0f0 100%)',
                        backgroundSize: '20px 20px',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: isRevealed ? 'default' : 'pointer',
                        marginBottom: '2rem',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s'
                    }}
                >
                    {isRevealed ? (
                        <div style={{ animation: 'float 2s infinite' }}>
                            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{reward.type === 'FOOD' ? '🍔' : '📺'}</div>
                            <div style={{ fontWeight: '600', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{reward.label}</div>
                        </div>
                    ) : (
                        <div style={{ fontWeight: '600', color: 'var(--text-secondary)', letterSpacing: '1px' }}>TAP TO REVEAL</div>
                    )}
                </div>

                <button
                    onClick={onClose}
                    style={{
                        background: 'var(--text-primary)',
                        color: 'var(--bg-primary)',
                        border: 'none',
                        padding: '1rem 2rem',
                        borderRadius: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        width: '100%',
                        fontSize: '1rem'
                    }}
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ScratchCardModal;

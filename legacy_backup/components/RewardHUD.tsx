import React from 'react';
import { UserState } from '../lib/types';

interface RewardHUDProps {
    user: UserState;
}

const RewardHUD: React.FC<RewardHUDProps> = ({ user }) => {
    const xpProgress = (user.xp / (user.level * 100)) * 100;

    return (
        <div style={{
            marginBottom: '2rem',
            padding: '0 0.5rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '0.75rem' }}>
                <div>
                    <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                        Level {user.level}
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                        {user.coins} <span style={{ fontSize: '1rem', color: 'var(--color-accent)' }}>Coins</span>
                    </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {user.xp} / {user.level * 100} XP
                </div>
            </div>

            {/* Minimalist XP Bar */}
            <div style={{
                height: '6px',
                background: 'var(--bg-secondary)',
                borderRadius: '3px',
                overflow: 'hidden'
            }}>
                <div style={{
                    width: `${xpProgress}%`,
                    height: '100%',
                    background: 'var(--color-primary)',
                    transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}></div>
            </div>
        </div>
    );
};

export default RewardHUD;

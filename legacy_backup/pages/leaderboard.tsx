import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { useGame } from '../lib/store';

interface LeaderboardUser {
    name: string;
    ip?: string;
    xp: number;
    coins: number;
    level: number;
    inventory: any[];
    lastSeen: string;
    lastAction?: string;
}

const Leaderboard: NextPage = () => {
    const { user } = useGame();
    const [users, setUsers] = useState<LeaderboardUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch('/api/leaderboard');
                const data = await res.json();
                setUsers(data.users || []);
            } catch (error) {
                console.error('Failed to fetch leaderboard', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
        const interval = setInterval(fetchLeaderboard, 1000); // Poll every 1s
        return () => clearInterval(interval);
    }, []);

    return (
        <Layout title="Leaderboard">
            <main className="container">
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1.5rem', textAlign: 'center' }}>
                    Leaderboard 🏆
                </h1>

                {loading ? (
                    <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {users.map((u, index) => {
                            // Mask IP for display: 192.168.1.5 -> 192.168.x.5
                            const displayIp = u.ip ? u.ip.split('.').map((part, i) => i === 2 ? 'x' : part).join('.') : 'Unknown';

                            return (
                                <div key={index} className="card" style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    border: index === 0 ? '2px solid var(--color-accent)' : '1px solid transparent'
                                }}>
                                    <div style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: index === 0 ? 'var(--color-accent)' : 'var(--text-secondary)',
                                        width: '30px',
                                        textAlign: 'center'
                                    }}>
                                        #{index + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                                            {u.name} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>({displayIp})</span>
                                        </div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                            Level {u.level} • {u.coins} Coins
                                        </div>
                                        {u.lastAction && (
                                            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary)', marginTop: '0.25rem', fontStyle: 'italic' }}>
                                                "{u.lastAction}"
                                            </div>
                                        )}
                                    </div>
                                    <div style={{
                                        background: 'var(--bg-primary)',
                                        padding: '0.5rem 1rem',
                                        borderRadius: '12px',
                                        fontWeight: 'bold',
                                        color: 'var(--color-primary)'
                                    }}>
                                        {u.xp} XP
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                    Updates in real-time...
                </div>
            </main>
        </Layout>
    );
};

export default Leaderboard;

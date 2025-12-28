import type { NextPage } from 'next';
import { useState } from 'react';
import Layout from '../components/Layout';
import RewardHUD from '../components/RewardHUD';
import TaskCard from '../components/TaskCard';
import TaskManager from '../components/TaskManager';
import ScratchCardModal from '../components/ScratchCardModal';
import { useGame } from '../lib/store';

const Home: NextPage = () => {
    const { user, addTask, removeTask, completeTask, undoTask, redeemReward } = useGame();
    const [activeRewardId, setActiveRewardId] = useState<string | null>(null);

    // Check for unredeemed rewards
    const unredeemedReward = user.inventory.find(r => !r.isRedeemed);

    // Auto-open modal if there's a new reward (optional, or user clicks chest)
    // For now, let's show a "Chest" button if there are rewards, or just auto-show the first one

    return (
        <Layout title="Tasker">
            <main>
                <RewardHUD user={user} />

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', padding: '0 0.5rem' }}>
                    <h2 style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>My Tasks</h2>
                    {unredeemedReward && (
                        <button
                            onClick={() => setActiveRewardId(unredeemedReward.id)}
                            style={{
                                background: 'var(--color-accent)',
                                color: '#000',
                                border: 'none',
                                padding: '0.5rem 1rem',
                                borderRadius: '20px',
                                fontWeight: '600',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                boxShadow: '0 2px 8px rgba(255, 215, 0, 0.3)'
                            }}
                        >
                            🎁 Open Reward
                        </button>
                    )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {user.tasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onComplete={completeTask}
                            onUndo={undoTask}
                            onRemove={removeTask}
                        />
                    ))}
                </div>

                <TaskManager onAdd={addTask} />

                {activeRewardId && (
                    <ScratchCardModal
                        reward={user.inventory.find(r => r.id === activeRewardId)!}
                        onRedeem={redeemReward}
                        onClose={() => setActiveRewardId(null)}
                    />
                )}
            </main>
        </Layout>
    );
};

export default Home;

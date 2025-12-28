import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserState, Task, Reward, INITIAL_TASKS } from './types';

interface GameContextType {
    user: UserState;
    addTask: (title: string, icon: string, color: string) => void;
    removeTask: (id: string) => void;
    completeTask: (id: string) => void;
    undoTask: (id: string) => void;
    redeemReward: (id: string) => void;
    resetData: () => void;
    unlockApp: () => void;
}

const INITIAL_USER: UserState = {
    tasks: INITIAL_TASKS,
    coins: 0,
    xp: 0,
    level: 1,
    inventory: [],
    lastVisitDate: new Date().toISOString().split('T')[0],
    isLocked: true,
    mood: "Let's get to work."
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserState>(INITIAL_USER);

    // Load from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('tasker_user');
        if (savedUser) {
            const parsedUser = JSON.parse(savedUser);
            checkDailyReset(parsedUser);
        } else {
            // New user, still check reset to set initial lock if needed (though INITIAL_USER sets it)
            // But actually, for a brand new user, maybe we don't want to lock immediately? 
            // The prompt says "on the first open... Access denied". So yes, lock.
            checkDailyReset(INITIAL_USER);
        }
    }, []);

    const syncWithBackend = (currentUser: UserState, action?: string) => {
        fetch('/api/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                // userId is now determined by IP on the server
                name: 'Me', // The server will override this if we want, or we can let user set it later
                xp: currentUser.xp,
                coins: currentUser.coins,
                level: currentUser.level,
                inventory: currentUser.inventory,
                action: action
            })
        }).catch(err => console.error('Sync failed', err));
    };

    // Save to localStorage on change
    useEffect(() => {
        if (user !== INITIAL_USER) {
            localStorage.setItem('tasker_user', JSON.stringify(user));
        }
    }, [user]);

    const checkDailyReset = (currentUser: UserState) => {
        const today = new Date().toISOString().split('T')[0];
        const lastVisit = currentUser.lastVisitDate;

        if (lastVisit !== today) {
            // It's a new day!
            console.log("Daily Reset Triggered");

            // 1. Calculate Decay (Penalties for yesterday's missed tasks)
            // If we strictly want to check yesterday, we'd need more complex date math.
            // For simplicity, if lastVisit != today, we assume a day passed.

            // Count uncompleted tasks from "yesterday" (which are just tasks with lastCompletedDate != lastVisit)
            // Actually, tasks reset daily. So if lastCompletedDate != lastVisit, they weren't done on the last active day.
            const missedTasks = currentUser.tasks.filter(t => t.lastCompletedDate !== lastVisit).length;

            let coinsPenalty = 0;
            let xpPenalty = 0;
            let moodMessage = "Fresh start. Seize the day.";

            if (missedTasks > 0) {
                coinsPenalty = missedTasks * 5;
                xpPenalty = missedTasks * 10;
                moodMessage = "Skipped yesterday? Expect restlessness today.";
            } else {
                moodMessage = "You earned calm. Keep it up.";
            }

            // 2. Expire Rewards
            // Clear all rewards as per "Rewards should expire daily"
            // Or maybe just unredeemed ones? "Miss the window -> gone."
            // Let's clear all unredeemed rewards.
            const validInventory = currentUser.inventory.filter(r => r.isRedeemed); // Keep history? Or just wipe? 
            // "Unlocks disappear". So wipe unredeemed.

            const newCoins = Math.max(0, currentUser.coins - coinsPenalty);
            const newXp = Math.max(0, currentUser.xp - xpPenalty);

            setUser({
                ...currentUser,
                coins: newCoins,
                xp: newXp,
                inventory: [], // Wipe inventory for fresh start? Or just remove unredeemed? Prompt says "Unlocks disappear".
                lastVisitDate: today,
                isLocked: true, // Re-lock every day
                mood: moodMessage
            });
        } else {
            // Same day, just load user
            setUser(currentUser);
        }
    };

    const unlockApp = () => {
        setUser(prev => ({ ...prev, isLocked: false }));
    };

    const addTask = (title: string, icon: string, color: string) => {
        const newTask: Task = {
            id: Date.now().toString(),
            title,
            streak: 0,
            lastCompletedDate: null,
            color,
            icon,
        };
        setUser((prev) => ({ ...prev, tasks: [...prev.tasks, newTask] }));
    };

    const removeTask = (id: string) => {
        setUser((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
    };

    const completeTask = (id: string) => {
        const today = new Date().toISOString().split('T')[0];
        const task = user.tasks.find((t) => t.id === id);

        if (!task || task.lastCompletedDate === today) return;

        // Calculate Rewards
        const streakBonus = task.streak * 5;
        const coinsEarned = 10 + streakBonus;
        const xpEarned = 20;

        // Update Task
        const updatedTasks = user.tasks.map((t) => {
            if (t.id === id) {
                return { ...t, streak: t.streak + 1, lastCompletedDate: today };
            }
            return t;
        });

        // Update User Stats
        let newCoins = user.coins + coinsEarned;
        let newXp = user.xp + xpEarned;
        let newLevel = user.level;
        let newInventory = [...user.inventory];

        // Level Up Check
        const xpThreshold = newLevel * 100;
        if (newXp >= xpThreshold) {
            newLevel += 1;
            newXp = newXp - xpThreshold; // Carry over excess XP

            // Grant Scratch Card
            const rewardType = Math.random() > 0.5 ? 'FOOD' : 'YOUTUBE';
            const rewardLabel = rewardType === 'FOOD' ? 'Cheat Meal' : '30m Youtube';

            // Set expiry based on type
            let validWindow = '';
            const now = new Date();
            const expiry = new Date();

            if (rewardType === 'FOOD') {
                validWindow = 'Valid until 9 PM';
                expiry.setHours(21, 0, 0, 0); // 9 PM
            } else {
                validWindow = 'Valid until 10 PM';
                expiry.setHours(22, 0, 0, 0); // 10 PM
            }

            newInventory.push({
                id: Date.now().toString(),
                type: rewardType,
                label: rewardLabel,
                isRedeemed: false,
                validWindow,
                expiresAt: expiry.toISOString()
            });
        }

        setUser((prev) => {
            const newState = {
                ...prev,
                tasks: updatedTasks,
                coins: newCoins,
                xp: newXp,
                level: newLevel,
                inventory: newInventory,
            };
            syncWithBackend(newState, `Completed: ${task.title}`);
            return newState;
        });
    };

    const undoTask = (id: string) => {
        const today = new Date().toISOString().split('T')[0];
        const task = user.tasks.find((t) => t.id === id);

        if (!task || task.lastCompletedDate !== today) return;

        // Calculate Rewards to Remove
        // Current streak is S (already incremented). Bonus was calculated on S-1.
        const previousStreak = task.streak - 1;
        const streakBonus = previousStreak * 5;
        const coinsToRemove = 10 + streakBonus;
        const xpToRemove = 20;

        // Update Task
        const updatedTasks = user.tasks.map((t) => {
            if (t.id === id) {
                return { ...t, streak: Math.max(0, t.streak - 1), lastCompletedDate: null };
            }
            return t;
        });

        // Update User Stats
        // Prevent negative Coins/XP for now to avoid complex de-leveling logic
        let newCoins = Math.max(0, user.coins - coinsToRemove);
        let newXp = Math.max(0, user.xp - xpToRemove);

        setUser((prev) => {
            const newState = {
                ...prev,
                tasks: updatedTasks,
                coins: newCoins,
                xp: newXp,
            };
            syncWithBackend(newState, `Undid: ${task.title}`);
            return newState;
        });
    };

    const redeemReward = (id: string) => {
        setUser((prev) => {
            const reward = prev.inventory.find(r => r.id === id);
            const newState = {
                ...prev,
                inventory: prev.inventory.map((r) => (r.id === id ? { ...r, isRedeemed: true } : r)),
            };
            syncWithBackend(newState, `Redeemed: ${reward?.label || 'Reward'}`);
            return newState;
        });
    };

    const resetData = () => {
        setUser(INITIAL_USER);
        localStorage.removeItem('tasker_user');
    };

    return (
        <GameContext.Provider value={{ user, addTask, removeTask, completeTask, undoTask, redeemReward, resetData, unlockApp }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGame = () => {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
};

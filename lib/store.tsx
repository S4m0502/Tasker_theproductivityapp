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
}

const INITIAL_USER: UserState = {
    tasks: INITIAL_TASKS,
    coins: 0,
    xp: 0,
    level: 1,
    inventory: [],
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserState>(INITIAL_USER);

    // Load from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('tasker_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        if (user !== INITIAL_USER) {
            localStorage.setItem('tasker_user', JSON.stringify(user));
        }
    }, [user]);

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
            newInventory.push({
                id: Date.now().toString(),
                type: rewardType,
                label: rewardLabel,
                isRedeemed: false,
            });
        }

        setUser((prev) => ({
            ...prev,
            tasks: updatedTasks,
            coins: newCoins,
            xp: newXp,
            level: newLevel,
            inventory: newInventory,
        }));
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

        setUser((prev) => ({
            ...prev,
            tasks: updatedTasks,
            coins: newCoins,
            xp: newXp,
        }));
    };

    const redeemReward = (id: string) => {
        setUser((prev) => ({
            ...prev,
            inventory: prev.inventory.map((r) => (r.id === id ? { ...r, isRedeemed: true } : r)),
        }));
    };

    const resetData = () => {
        setUser(INITIAL_USER);
        localStorage.removeItem('tasker_user');
    };

    return (
        <GameContext.Provider value={{ user, addTask, removeTask, completeTask, undoTask, redeemReward, resetData }}>
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

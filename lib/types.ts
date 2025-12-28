export interface Task {
    id: string;
    title: string;
    streak: number;
    lastCompletedDate: string | null;
    color: string;
    icon: string;
}

export type RewardType = 'FOOD' | 'YOUTUBE';

export interface Reward {
    id: string;
    type: RewardType;
    label: string;
    isRedeemed: boolean;
}

export interface UserState {
    tasks: Task[];
    coins: number;
    xp: number;
    level: number;
    inventory: Reward[];
}

export const INITIAL_TASKS: Task[] = [
    { id: '1', title: 'Hit Protein Goal', streak: 0, lastCompletedDate: null, color: '#FF6B6B', icon: '🥩' },
    { id: '2', title: 'Workout', streak: 0, lastCompletedDate: null, color: '#4ECDC4', icon: '💪' },
    { id: '3', title: 'Deep Work', streak: 0, lastCompletedDate: null, color: '#FFE66D', icon: '🧠' },
];

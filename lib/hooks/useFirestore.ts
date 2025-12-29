import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, setDoc, updateDoc, deleteDoc, increment, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { User } from 'firebase/auth';

export interface Task {
    id: string;
    title: string;
    isCompleted: boolean;
    streak: number;
    isPinned?: boolean;
    completedAt: any; // Timestamp
}

export interface UserStats {
    xp: number;
    coins: number;
    level: number;
}

export function useUserData(user: User | null) {
    const [stats, setStats] = useState<UserStats>({ xp: 0, coins: 0, level: 1 });
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            setStats({ xp: 0, coins: 0, level: 1 });
            setTasks([]);
            setLoading(false);
            return;
        }

        // Listen to User Stats
        const userRef = doc(db, 'users', user.uid);
        const unsubUser = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                setStats(doc.data().stats as UserStats);
            } else {
                // Initialize new user
                setDoc(userRef, {
                    email: user.email,
                    stats: { xp: 0, coins: 0, level: 1 },
                    lastActive: serverTimestamp()
                });
            }
        });

        // Listen to Tasks
        const tasksQuery = query(
            collection(db, `users/${user.uid}/tasks`),
            orderBy('isPinned', 'desc'),
            orderBy('createdAt', 'desc')
        );
        const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
            const loadedTasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Task[];
            setTasks(loadedTasks);
            setLoading(false);
        });

        return () => {
            unsubUser();
            unsubTasks();
        };
    }, [user]);

    const addTask = async (title: string) => {
        if (!user) return;
        const newTaskRef = doc(collection(db, `users/${user.uid}/tasks`));
        await setDoc(newTaskRef, {
            title,
            isCompleted: false,
            streak: 0,
            isPinned: false,
            createdAt: serverTimestamp()
        });
    };

    const deleteTask = async (taskId: string) => {
        if (!user) return;
        await deleteDoc(doc(db, `users/${user.uid}/tasks`, taskId));
    };

    const updateTask = async (taskId: string, data: Partial<Task>) => {
        if (!user) return;
        await updateDoc(doc(db, `users/${user.uid}/tasks`, taskId), data);
    };

    const togglePin = async (task: Task) => {
        if (!user) return;
        await updateDoc(doc(db, `users/${user.uid}/tasks`, task.id), {
            isPinned: !task.isPinned
        });
    };

    const toggleTask = async (task: Task) => {
        if (!user) return;
        const taskRef = doc(db, `users/${user.uid}/tasks`, task.id);
        const userRef = doc(db, 'users', user.uid);

        if (!task.isCompleted) {
            // Complete Task
            await updateDoc(taskRef, {
                isCompleted: true,
                streak: increment(1),
                completedAt: serverTimestamp()
            });
            // Grant Rewards
            await updateDoc(userRef, {
                'stats.xp': increment(20),
                'stats.coins': increment(10),
                lastActive: serverTimestamp()
            });

            // Record completion for calendar
            const today = new Date().toISOString().split('T')[0];
            const completionRef = doc(db, `users/${user.uid}/completions`, today);
            await setDoc(completionRef, {
                count: increment(1),
                date: serverTimestamp()
            }, { merge: true });

        } else {
            // Undo Task
            await updateDoc(taskRef, {
                isCompleted: false,
                streak: increment(-1),
                completedAt: null
            });
            // Remove Rewards
            await updateDoc(userRef, {
                'stats.xp': increment(-20),
                'stats.coins': increment(-10)
            });

            // Decrement completion for calendar
            const today = new Date().toISOString().split('T')[0];
            const completionRef = doc(db, `users/${user.uid}/completions`, today);
            await updateDoc(completionRef, {
                count: increment(-1)
            });
        }
    };

    return { stats, tasks, loading, addTask, toggleTask, deleteTask, updateTask, togglePin };
}

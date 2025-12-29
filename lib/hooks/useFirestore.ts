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
    createdAt?: any; // Timestamp
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
            collection(db, `users/${user.uid}/tasks`)
        );
        const unsubTasks = onSnapshot(tasksQuery, (snapshot) => {
            const loadedTasks = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Task[];

            // Sort client-side: pinned first, then by creation date
            loadedTasks.sort((a, b) => {
                if (a.isPinned && !b.isPinned) return -1;
                if (!a.isPinned && b.isPinned) return 1;
                // For createdAt, handle serverTimestamp which might be null initially
                const aTime = a.createdAt?.toMillis?.() || 0;
                const bTime = b.createdAt?.toMillis?.() || 0;
                return bTime - aTime; // Descending order
            });

            console.log('Tasks loaded:', loadedTasks.length);
            setTasks(loadedTasks);
            setLoading(false);
        });

        return () => {
            unsubUser();
            unsubTasks();
        };
    }, [user]);

    const addTask = async (title: string) => {
        if (!user) {
            console.error('No user found when trying to add task');
            return;
        }
        console.log('Adding task to Firestore for user:', user.uid);
        try {
            const newTaskRef = doc(collection(db, `users/${user.uid}/tasks`));
            await setDoc(newTaskRef, {
                title,
                isCompleted: false,
                streak: 0,
                isPinned: false,
                createdAt: serverTimestamp()
            });
            console.log('Task added to Firestore successfully');
        } catch (error) {
            console.error('Firestore error adding task:', error);
            throw error;
        }
    };

    const deleteTask = async (taskId: string) => {
        if (!user) return;

        // Get the task to check if it was completed
        const taskToDelete = tasks.find(t => t.id === taskId);

        // Delete the task
        await deleteDoc(doc(db, `users/${user.uid}/tasks`, taskId));

        // If task was completed, remove the rewards
        if (taskToDelete?.isCompleted) {
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, {
                'stats.xp': increment(-20),
                'stats.coins': increment(-10)
            });

            // Also decrement the completion count for calendar
            const completedDate = taskToDelete.completedAt?.toDate?.();
            if (completedDate) {
                const dateStr = completedDate.toISOString().split('T')[0];
                const completionRef = doc(db, `users/${user.uid}/completions`, dateStr);
                await updateDoc(completionRef, {
                    count: increment(-1)
                });
            }
        }
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

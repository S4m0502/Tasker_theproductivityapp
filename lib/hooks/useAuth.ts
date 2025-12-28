import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const logout = () => signOut(auth);

    return { user, loading, signInWithEmailAndPassword, signOut: logout, createUserWithEmailAndPassword };
}

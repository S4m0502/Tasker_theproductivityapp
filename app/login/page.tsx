'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            if (isRegistering) {
                await createUserWithEmailAndPassword(auth, email, password);
            } else {
                await signInWithEmailAndPassword(auth, email, password);
            }
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-900 text-white">
            <div className="w-full max-w-md p-8 space-y-6 bg-gray-800 rounded-xl shadow-lg">
                <h1 className="text-2xl font-bold text-center">
                    {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h1>

                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-100/10 rounded-lg">
                        {error}
                    </div>
                )}

                <form onSubmit={handleAuth} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        {isRegistering ? 'Sign Up' : 'Login'}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-400">
                    {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                    <button
                        onClick={() => setIsRegistering(!isRegistering)}
                        className="text-blue-400 hover:underline"
                    >
                        {isRegistering ? 'Login' : 'Sign Up'}
                    </button>
                </div>
            </div>
        </div>
    );
}

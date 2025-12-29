'use client';

import { useRouter } from 'next/navigation';

interface BottomNavProps {
    currentPage: 'dashboard' | 'leaderboard';
}

export default function BottomNav({ currentPage }: BottomNavProps) {
    const router = useRouter();

    return (
        <div className="max-w-md mx-auto mt-4 px-10 flex justify-between items-center">
            <button
                onClick={() => router.push('/dashboard')}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentPage === 'dashboard' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-300'
                    }`}
            >
                Inventory
            </button>
            <button
                onClick={() => router.push('/leaderboard')}
                className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentPage === 'leaderboard' ? 'text-blue-500' : 'text-gray-600 hover:text-gray-300'
                    }`}
            >
                Multiverse
            </button>
        </div>
    );
}

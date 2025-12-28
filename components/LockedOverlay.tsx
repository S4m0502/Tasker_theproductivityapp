'use client';

import { useState, useEffect } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../lib/hooks/useAuth';

export default function LockedOverlay({ isLocked, onUnlock }: { isLocked: boolean, onUnlock: () => void }) {
    const [show, setShow] = useState(false);
    const [opacity, setOpacity] = useState(0);

    useEffect(() => {
        if (isLocked) {
            // Delay show
            const timer = setTimeout(() => {
                setShow(true);
                // Fade in
                requestAnimationFrame(() => setOpacity(1));
            }, 200);
            return () => clearTimeout(timer);
        } else {
            setOpacity(0);
            const timer = setTimeout(() => setShow(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isLocked]);

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black text-red-600 font-mono transition-opacity duration-500"
            style={{ opacity }}
        >
            <div className="text-6xl font-bold mb-4 animate-pulse">LOCKED</div>
            <div className="text-xl mb-8">ACCESS DENIED</div>

            <button
                onClick={onUnlock}
                className="px-8 py-3 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-black transition-colors font-bold tracking-widest uppercase"
            >
                Unlock Protocol
            </button>
        </div>
    );
}

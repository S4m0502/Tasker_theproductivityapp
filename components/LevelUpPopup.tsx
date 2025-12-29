'use client';

import { useEffect, useState } from 'react';

interface LevelUpPopupProps {
    level: number;
    onClose: () => void;
}

export default function LevelUpPopup({ level, onClose }: LevelUpPopupProps) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Animate in
        setTimeout(() => setIsVisible(true), 100);

        // Auto close after 3 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
        }, 3000);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`fixed inset-0 z-[300] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className={`bg-gradient-to-br from-yellow-500 to-orange-600 p-8 rounded-3xl shadow-2xl transform transition-all duration-300 ${isVisible ? 'scale-100' : 'scale-75'}`}>
                <div className="text-center">
                    <div className="text-6xl mb-4 animate-bounce">🎉</div>
                    <h2 className="text-4xl font-black text-white mb-2">LEVEL {level}</h2>
                    <p className="text-lg text-white/90 font-bold uppercase tracking-widest">Achieved!</p>
                </div>
            </div>
        </div>
    );
}

'use client';

interface XPBarProps {
    xp: number;
    level: number;
}

export default function XPBar({ xp, level }: XPBarProps) {
    // Simple level logic: 100 XP per level
    const xpInCurrentLevel = xp % 100;
    const progress = Math.min(Math.max(xpInCurrentLevel, 0), 100);

    return (
        <div className="w-full space-y-1">
            <div className="flex justify-between items-end">
                <span className="text-xs font-bold text-blue-400 uppercase tracking-tighter">Level {level}</span>
                <span className="text-[10px] text-gray-500 font-mono">{xpInCurrentLevel}/100 XP</span>
            </div>
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden border border-gray-700/50">
                <div
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}

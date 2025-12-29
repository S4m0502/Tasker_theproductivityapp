'use client';

interface GoldCoinProps {
    amount: number;
}

export default function GoldCoin({ amount }: GoldCoinProps) {
    return (
        <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-full border border-yellow-500/20 shadow-inner">
            <div className="relative w-5 h-5">
                <div className="absolute inset-0 bg-yellow-500 rounded-full animate-pulse blur-[4px] opacity-20"></div>
                <div className="relative w-full h-full bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700 rounded-full flex items-center justify-center border border-yellow-200/50 shadow-lg">
                    <span className="text-[10px] font-bold text-yellow-900 leading-none">$</span>
                </div>
            </div>
            <span className="text-sm font-black text-yellow-500 font-mono leading-none">{amount}</span>
        </div>
    );
}
